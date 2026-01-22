import React, { useEffect, useState } from 'react';
import PostCard from '../components/social/PostCard';
import { PenSquare, Flame, User } from 'lucide-react';
import { db } from '../services/firebase';
// Añadimos 'deleteDoc' y 'doc' a los imports
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");

  // 1. LEER POSTS
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString() : "Just now"
      }));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  // 2. PUBLICAR
  const handlePublish = async () => {
    if (!newPostContent.trim()) return;
    if (!user) { alert("Debes iniciar sesión"); return; }
    try {
      await addDoc(collection(db, "posts"), {
        content: newPostContent,
        uid: user.uid,
        user: { name: user.displayName || "Usuario", avatar: user.photoURL || null },
        handle: user.email ? user.email.split('@')[0] : "user",
        createdAt: serverTimestamp(),
        likes: 0, comments: 0, retweets: 0, tag: "General"
      });
      setNewPostContent("");
    } catch (error) { console.error("Error publicando:", error); }
  };

  // 3. ELIMINAR POST (NUEVO)
  const handleDelete = async (postId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este post?")) {
      try {
        await deleteDoc(doc(db, "posts", postId));
      } catch (error) {
        console.error("Error eliminando post:", error);
        alert("No se pudo eliminar el post.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="hidden lg:block col-span-1 p-4 border-r border-slate-200 dark:border-slate-800 sticky top-16 h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 px-2 text-slate-900 dark:text-white">Categorías</h2>
          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold transition-colors">🏠 Para ti</button>
            <button className="w-full text-left px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">🔥 Tendencias</button>
          </nav>
        </div>

        {/* COLUMNA CENTRAL */}
        <div className="col-span-1 lg:col-span-2 border-r border-slate-200 dark:border-slate-800 min-h-screen">
          <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4">
            <h1 className="text-xl font-bold mb-4 hidden md:block text-slate-900 dark:text-white">Inicio</h1>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm">
                {user?.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-white font-bold text-sm">{user?.displayName ? user.displayName[0].toUpperCase() : <User size={18} />}</span>}
              </div>
              <div className="flex-1">
                <input type="text" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder={`${user ? `¿Qué cuentas, ${user.displayName || 'usuario'}?` : 'Inicia sesión para publicar...'}`} className="w-full bg-transparent text-xl placeholder-slate-400 dark:placeholder-slate-500 outline-none border-none mb-4 text-slate-900 dark:text-white" disabled={!user} />
                <div className="flex justify-end"><button onClick={handlePublish} disabled={!newPostContent || !user} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-full font-bold transition-all shadow-md">Publicar</button></div>
              </div>
            </div>
          </div>

          {/* LISTA DE POSTS */}
          <div>
            {posts.map((post) => {
              let finalPostData = { ...post };
              
              // Comprobamos si eres el dueño
              const isMyPost = user && ((post.uid && post.uid === user.uid) || (post.user.name === user.displayName) || (post.handle === user.email?.split('@')[0]));

              if (isMyPost) {
                finalPostData.user = { name: user.displayName, avatar: user.photoURL };
              }

              return (
                <PostCard 
                  key={post.id} 
                  {...finalPostData} 
                  isOwner={isMyPost} // <--- Pasamos si es dueño
                  onDelete={() => handleDelete(post.id)} // <--- Pasamos la función eliminar
                />
              );
            })}
            {posts.length === 0 && <div className="p-8 text-center text-slate-500">No hay publicaciones aún.</div>}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="hidden lg:block col-span-1 p-4 sticky top-16 h-fit">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
             <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white"><Flame size={20} className="text-orange-500" /> Tendencias</h3>
            <div className="space-y-4">
              <div className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg cursor-pointer transition-colors"><p className="text-xs text-slate-500">Videojuegos</p><p className="font-bold text-slate-900 dark:text-white">GTA VI</p></div>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden fixed bottom-6 right-6"><button className="bg-blue-600 p-4 rounded-full shadow-lg text-white"><PenSquare size={24} /></button></div>
    </div>
  );
};

export default Forum;