import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { 
  collection, query, where, onSnapshot, addDoc, 
  serverTimestamp, orderBy, getDocs, updateDoc, doc 
} from 'firebase/firestore';
import { Send, Search, User, MessageCircle, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const scrollRef = useRef();

  // 1. CARGAR MIS CONVERSACIONES (SIDEBAR)
  useEffect(() => {
    if (!user) return;
    
    // Escuchar chats donde yo estoy incluido
    const q = query(
      collection(db, "chats"), 
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => {
        const data = doc.data();
        // ARREGLO 1: Calcular siempre quién es el otro usuario al cargar la lista
        const otherUser = data.users.find(u => u.uid !== user.uid) || { name: "Usuario", avatar: null };
        return { id: doc.id, ...data, otherUser };
      });
      setChats(chatData);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. CARGAR MENSAJES
  useEffect(() => {
    if (!selectedChat?.id) return;

    const q = query(
      collection(db, "chats", selectedChat.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
      // Scroll automático al fondo
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [selectedChat?.id]); // Dependencia clave: ID del chat

  // 3. BUSCAR USUARIOS
  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      try {
        const usersRef = collection(db, "users");
        // Buscamos usuarios por nombre
        const q = query(
          usersRef, 
          where("displayName", ">=", searchQuery),
          where("displayName", "<=", searchQuery + '\uf8ff')
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs
          .map(doc => doc.data())
          .filter(u => u.uid !== user.uid); 
        setSearchResults(results);
      } catch (error) { console.error(error); }
    };

    const delayDebounceFn = setTimeout(() => { searchUsers(); }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, user]);

  // 4. CREAR O SELECCIONAR CHAT (ARREGLADO)
  const handleSelectUserFromSearch = async (userResult) => {
    // A. Comprobar si ya existe en la lista cargada
    const existingChat = chats.find(chat => 
      chat.participants.includes(userResult.uid)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      // B. Si no existe, CREARLO EN FIREBASE
      const newChatData = {
        participants: [user.uid, userResult.uid], // Array simple para búsquedas
        users: [ // Datos completos para mostrar nombres/fotos
          { uid: user.uid, name: user.displayName, avatar: user.photoURL },
          { uid: userResult.uid, name: userResult.displayName, avatar: userResult.photoURL }
        ],
        updatedAt: serverTimestamp(),
        lastMessage: { text: "", senderId: null } // Vacío al inicio
      };

      try {
          const docRef = await addDoc(collection(db, "chats"), newChatData);
          
          // ARREGLO 2: Forzamos el 'otherUser' en el estado local para que el Header no salga vacío
          // mientras Firebase actualiza la lista.
          setSelectedChat({ 
              id: docRef.id, 
              ...newChatData, 
              otherUser: { // IMPORTANTE: Aquí pasamos los datos del usuario buscado
                  name: userResult.displayName, 
                  avatar: userResult.photoURL,
                  uid: userResult.uid
              } 
          });
      } catch (error) {
          console.error("Error creando chat:", error);
      }
    }
    
    setSearchQuery("");
    setIsSearching(false);
  };

  // 5. ENVIAR MENSAJE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat?.id) return;

    const msgText = newMessage;
    setNewMessage(""); 

    try {
        // A. Guardar mensaje
        await addDoc(collection(db, "chats", selectedChat.id, "messages"), {
          text: msgText,
          senderId: user.uid,
          createdAt: serverTimestamp()
        });

        // B. Actualizar Chat Padre (para que suba en la lista y se vea el último mensaje)
        await updateDoc(doc(db, "chats", selectedChat.id), {
          lastMessage: { 
              text: msgText, 
              senderId: user.uid,
              timestamp: new Date()
          },
          updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error("Error enviando mensaje:", error);
    }
  };

  // Helper para mostrar datos del otro usuario en el Header de forma segura
  const getHeaderInfo = () => {
    if (!selectedChat) return { name: "", avatar: null };
    // Si tenemos 'otherUser' calculado, úsalo. Si no, búscalo en el array 'users'
    if (selectedChat.otherUser) return selectedChat.otherUser;
    
    const found = selectedChat.users?.find(u => u.uid !== user.uid);
    return found || { name: "Usuario", avatar: null };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-10 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[80vh] flex">
        
        {/* SIDEBAR */}
        <div className={`w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mensajes</h2>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Buscar usuario..." 
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isSearching ? (
                /* RESULTADOS BÚSQUEDA */
                <div className="p-2">
                    <p className="text-xs font-bold text-slate-400 px-2 mb-2 uppercase">Resultados</p>
                    {searchResults.length > 0 ? (
                        searchResults.map(u => (
                            <div key={u.uid} onClick={() => handleSelectUserFromSearch(u)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                    {u.photoURL ? <img src={u.photoURL} className="w-full h-full object-cover"/> : <User size={20}/>}
                                </div>
                                <p className="font-bold text-slate-900 dark:text-white">{u.displayName}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-slate-500 p-2 text-center">No encontrado.</p>
                    )}
                </div>
            ) : (
                /* LISTA CHATS */
                <div>
                   {chats.map(chat => (
                    <div 
                      key={chat.id} 
                      onClick={() => setSelectedChat(chat)}
                      className={`flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                        {chat.otherUser?.avatar ? <img src={chat.otherUser.avatar} className="w-full h-full object-cover"/> : <User size={20} className="text-slate-500"/>}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">{chat.otherUser?.name}</h4>
                          {chat.updatedAt && (
                             <span className="text-[10px] text-slate-400">
                                {new Date(chat.updatedAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                             </span>
                          )}
                        </div>
                        <p className={`text-sm truncate ${chat.lastMessage?.senderId === user.uid ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200 font-medium'}`}>
                          {chat.lastMessage?.text ? (chat.lastMessage.senderId === user.uid ? `Tú: ${chat.lastMessage.text}` : chat.lastMessage.text) : 
                          <span className="italic text-slate-400">Nuevo chat</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className={`w-full md:w-2/3 flex flex-col bg-slate-50/50 dark:bg-black/20 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Header con Info Segura */}
              <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm z-10">
                <button onClick={() => setSelectedChat(null)} className="md:hidden p-2 hover:bg-slate-100 rounded-full text-slate-500"><ArrowLeft size={20}/></button>
                <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
                   {headerInfo.avatar ? <img src={headerInfo.avatar} className="w-full h-full object-cover"/> : <User className="text-slate-500"/>}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{headerInfo.name}</h3>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === user.uid;
                  return (
                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                        isMe 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'
                      }`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                           {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..." 
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
               {/* Estado vacío */}
               <MessageCircle size={64} className="mb-4 text-slate-200 dark:text-slate-800"/>
               <p>Selecciona un chat para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;