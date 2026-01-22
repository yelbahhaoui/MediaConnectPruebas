import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { db } from '../services/firebase';
import { 
  collection, query, where, onSnapshot, addDoc, 
  serverTimestamp, orderBy, getDocs, updateDoc, doc 
} from 'firebase/firestore';
import { Send, Search, User, MessageCircle, ArrowLeft } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  
  const messagesContainerRef = useRef(null);

  // 1. CARGAR LISTA DE CHATS
  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "chats"), 
      where("participants", "array-contains", user.uid),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatData = snapshot.docs.map(doc => {
        const data = doc.data();
        const otherUser = data.users?.find(u => u.uid !== user.uid) || { name: "Usuario", avatar: null };
        return { id: doc.id, ...data, otherUser };
      });
      
      setChats(chatData);
      setLoadingChats(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. RESTAURAR CHAT DESDE URL
  useEffect(() => {
    const urlChatId = searchParams.get('chatId');
    if (urlChatId && !loadingChats && chats.length > 0) {
      if (selectedChat?.id === urlChatId) return;
      const foundChat = chats.find(c => c.id === urlChatId);
      if (foundChat) setSelectedChat(foundChat);
    }
  }, [searchParams, chats, loadingChats]);

  // 3. CARGAR MENSAJES Y SCROLL
  useEffect(() => {
    if (!selectedChat?.id) return;

    const q = query(
      collection(db, "chats", selectedChat.id, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => doc.data());
      setMessages(msgs);
      
      // Scroll al final sin mover la pantalla entera
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsubscribe();
  }, [selectedChat?.id]);

  // 4. BUSCAR USUARIOS
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
        const q = query(
          usersRef, 
          where("displayName", ">=", searchQuery),
          where("displayName", "<=", searchQuery + '\uf8ff')
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs
          .map(doc => ({ uid: doc.id, ...doc.data() }))
          .filter(u => u.uid !== user.uid); 
        setSearchResults(results);
      } catch (error) { console.error(error); }
    };

    const delayDebounceFn = setTimeout(() => { searchUsers(); }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, user]);

  const selectChat = (chat) => {
    setSelectedChat(chat);
    setSearchParams({ chatId: chat.id });
    setIsSearching(false);
    setSearchQuery("");
  };

  const handleSelectUserFromSearch = async (userResult) => {
    if (!userResult.uid) return console.error("Usuario sin UID");

    const existingChat = chats.find(chat => 
      chat.participants.includes(userResult.uid)
    );

    if (existingChat) {
      selectChat(existingChat);
    } else {
      const newChatData = {
        participants: [user.uid, userResult.uid], 
        users: [ 
          { uid: user.uid, name: user.displayName || "Yo", avatar: user.photoURL || null },
          { uid: userResult.uid, name: userResult.displayName || "Usuario", avatar: userResult.photoURL || null }
        ],
        updatedAt: serverTimestamp(),
        lastMessage: { text: "", senderId: null }
      };

      try {
          const docRef = await addDoc(collection(db, "chats"), newChatData);
          const newChatObj = { id: docRef.id, ...newChatData, otherUser: newChatData.users[1] };
          setChats(prev => [newChatObj, ...prev]);
          selectChat(newChatObj);
      } catch (error) { console.error("Error creando chat:", error); }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat?.id) return;

    const msgText = newMessage;
    setNewMessage(""); 

    try {
        await addDoc(collection(db, "chats", selectedChat.id, "messages"), {
          text: msgText,
          senderId: user.uid,
          createdAt: serverTimestamp()
        });

        await updateDoc(doc(db, "chats", selectedChat.id), {
          lastMessage: { 
              text: msgText, 
              senderId: user.uid,
              timestamp: new Date()
          },
          updatedAt: serverTimestamp()
        });
    } catch (error) { console.error("Error envío:", error); }
  };

  const getHeaderInfo = () => {
    if (!selectedChat) return { name: "Chat", avatar: null };
    if (selectedChat.otherUser) return selectedChat.otherUser;
    return { name: "Usuario", avatar: null };
  };

  const headerInfo = getHeaderInfo();

  return (
    // Ajuste de altura para móvil (calc(100vh - header))
    <div className="h-[calc(100vh-4rem)] md:min-h-screen bg-gray-50 dark:bg-slate-950 pt-20 pb-4 px-0 md:px-4 transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 md:rounded-2xl shadow-none md:shadow-xl border-x md:border border-slate-200 dark:border-slate-800 overflow-hidden h-full flex">
        
        {/* --- COLUMNA IZQUIERDA (LISTA) --- 
            Lógica: Si hay chat seleccionado, se oculta en móvil (hidden). 
            Si NO hay chat, se muestra (flex).
            En escritorio (md:flex) siempre se muestra.
        */}
        <div className={`w-full md:w-1/3 border-r border-slate-200 dark:border-slate-800 flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
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
                <div className="p-2">
                    <p className="text-xs font-bold text-slate-400 px-2 mb-2 uppercase">Resultados</p>
                    {searchResults.length > 0 ? (
                        searchResults.map(u => (
                            <div key={u.uid} onClick={() => handleSelectUserFromSearch(u)} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold overflow-hidden">
                                    {u.photoURL ? <img src={u.photoURL} className="w-full h-full object-cover"/> : u.displayName?.[0]}
                                </div>
                                <p className="font-bold text-slate-900 dark:text-white">{u.displayName}</p>
                            </div>
                        ))
                    ) : ( <p className="text-sm text-slate-500 p-2 text-center">No encontrado.</p> )}
                </div>
            ) : (
                <div>
                   {chats.map(chat => (
                    <div 
                      key={chat.id} 
                      onClick={() => selectChat(chat)} 
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
                  {chats.length === 0 && !loadingChats && (
                      <div className="p-8 text-center text-slate-500"><p>No tienes chats.</p></div>
                  )}
                </div>
            )}
          </div>
        </div>

        {/* --- COLUMNA DERECHA (CONVERSACIÓN) --- 
            Lógica: Si hay chat seleccionado, se muestra (flex).
            Si NO hay chat, se oculta en móvil (hidden).
            En escritorio (md:flex) se muestra siempre.
        */}
        <div className={`w-full md:w-2/3 flex-col bg-slate-50 dark:bg-black/20 ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
          {selectedChat ? (
            <>
              <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-sm z-10">
                {/* Botón Volver (Solo visible en móvil) */}
                <button onClick={() => { setSelectedChat(null); setSearchParams({}); }} className="md:hidden p-2 hover:bg-slate-100 rounded-full text-slate-500"><ArrowLeft size={20}/></button>
                
                <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
                   {headerInfo.avatar ? <img src={headerInfo.avatar} className="w-full h-full object-cover"/> : <User className="text-slate-500"/>}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{headerInfo.name}</h3>
              </div>

              {/* Contenedor de Mensajes */}
              <div 
                ref={messagesContainerRef} 
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.map((msg, index) => {
                  const isMe = msg.senderId === user.uid;
                  return (
                    <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] md:max-w-[70%] px-4 py-2 rounded-2xl ${msg.senderId === user.uid ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none shadow-sm'}`}>
                        <p>{msg.text}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                           {msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '...'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Mensaje..." className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-full px-4 py-3 focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" />
                <button type="submit" disabled={!newMessage.trim()} className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors disabled:opacity-50"><Send size={20} /></button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
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