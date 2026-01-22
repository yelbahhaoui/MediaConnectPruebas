import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { 
  collection, query, where, onSnapshot, addDoc, 
  serverTimestamp, orderBy, getDocs, setDoc, doc, updateDoc 
} from 'firebase/firestore';
import { Send, Search, User, MessageCircle } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const scrollRef = useRef();

  // 1. CARGAR MIS CONVERSACIONES (TIEMPO REAL)
  useEffect(() => {
    if (!user) return;
    
    // Buscamos chats donde yo soy participante
    const q = query(
      collection(db, "chats"), 
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Filtramos para saber quién es el "otro" usuario
        otherUser: doc.data().users.find(u => u.uid !== user.uid)
      }));
      setChats(chatData);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. CARGAR MENSAJES DEL CHAT SELECCIONADO (TIEMPO REAL)
  useEffect(() => {
    if (!selectedChat) return;

    const q = query(
      collection(db, "chats", selectedChat.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
      // Scroll automático al fondo al llegar mensaje nuevo
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    });

    return () => unsubscribe();
  }, [selectedChat]);

  // 3. BUSCAR USUARIOS PARA NUEVO CHAT
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Búsqueda simple por nombre (asegúrate de tener los usuarios creados en Firestore)
      const usersRef = collection(db, "users");
      const q = query(
        usersRef, 
        where("displayName", ">=", searchQuery),
        where("displayName", "<=", searchQuery + '\uf8ff')
      );
      
      const snapshot = await getDocs(q);
      const results = snapshot.docs
        .map(doc => doc.data())
        .filter(u => u.uid !== user.uid); // No mostrarme a mí mismo
      
      setSearchResults(results);
    } catch (error) {
      console.error("Error buscando:", error);
    }
  };

  // 4. SELECCIONAR O CREAR CHAT
  const handleSelectUser = async (otherUser) => {
    // Verificar si ya existe un chat con esta persona
    const existingChat = chats.find(chat => 
      chat.participants.includes(otherUser.uid)
    );

    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      // Crear nuevo chat
      const newChatData = {
        participants: [user.uid, otherUser.uid],
        users: [
          { uid: user.uid, name: user.displayName, avatar: user.photoURL },
          { uid: otherUser.uid, name: otherUser.displayName, avatar: otherUser.photoURL }
        ],
        updatedAt: serverTimestamp(),
        lastMessage: { text: "Chat iniciado", senderId: user.uid }
      };

      const docRef = await addDoc(collection(db, "chats"), newChatData);
      setSelectedChat({ id: docRef.id, ...newChatData, otherUser });
    }
    
    setSearchQuery(""); // Limpiar búsqueda
    setSearchResults([]);
  };

  // 5. ENVIAR MENSAJE
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const msg = newMessage;
    setNewMessage(""); // Limpiar input rápido para UX

    // A. Añadir mensaje a subcolección
    await addDoc(collection(db, "chats", selectedChat.id, "messages"), {
      text: msg,
      senderId: user.uid,
      createdAt: serverTimestamp()
    });

    // B. Actualizar el chat padre con el último mensaje (para la lista lateral)
    await updateDoc(doc(db, "chats", selectedChat.id), {
      lastMessage: { text: msg, senderId: user.uid },
      updatedAt: serverTimestamp()
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-10 px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden h-[80vh] flex">
        
        {/* --- BARRA LATERAL (Lista de Chats) --- */}
        <div className={`w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Header Sidebar */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Mensajes</h2>
            
            {/* Buscador */}
            <form onSubmit={handleSearch} className="relative">
              <input 
                type="text" 
                placeholder="Buscar usuario..." 
                className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              {searchQuery && <button type="submit" className="hidden"></button>}
            </form>
          </div>

          {/* Lista Resultados Búsqueda */}
          {searchResults.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900">
              <p className="text-xs font-bold text-slate-400 px-2 mb-2 uppercase">Resultados de búsqueda</p>
              {searchResults.map(u => (
                <div key={u.uid} onClick={() => handleSelectUser(u)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                    {u.photoURL ? <img src={u.photoURL} className="w-full h-full object-cover"/> : <User size={20}/>}
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">{u.displayName}</p>
                </div>
              ))}
            </div>
          ) : (
            /* Lista Chats Existentes */
            <div className="flex-1 overflow-y-auto">
              {chats.map(chat => (
                <div 
                  key={chat.id} 
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-3 p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedChat?.id === chat.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {chat.otherUser?.avatar ? <img src={chat.otherUser.avatar} className="w-full h-full object-cover"/> : <User size={20} className="text-slate-500"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{chat.otherUser?.name || "Usuario"}</h4>
                      {/* Aquí podrías poner la hora si quieres */}
                    </div>
                    <p className={`text-sm truncate ${chat.lastMessage?.senderId === user.uid ? 'text-slate-400' : 'text-slate-600 dark:text-slate-300 font-medium'}`}>
                      {chat.lastMessage?.senderId === user.uid && "Tú: "}{chat.lastMessage?.text}
                    </p>
                  </div>
                </div>
              ))}
              
              {chats.length === 0 && searchResults.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-20"/>
                  <p>No tienes mensajes.</p>
                  <p className="text-sm">Busca un usuario para empezar a chatear.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- ÁREA PRINCIPAL (Chat) --- */}
        <div className={`w-full md:w-2/3 flex flex-col bg-slate-50/50 dark:bg-black/20 ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm">
                <button onClick={() => setSelectedChat(null)} className="md:hidden text-slate-500">← Volver</button>
                <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden">
                   {selectedChat.otherUser?.avatar ? <img src={selectedChat.otherUser.avatar} className="w-full h-full object-cover"/> : <User className="m-2"/>}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{selectedChat.otherUser?.name}</h3>
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
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:text-white"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            /* Estado vacío (Select a chat) */
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                 <Send size={40} className="text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">Tus Mensajes</h3>
              <p>Selecciona una conversación o busca un usuario para empezar.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Chat;