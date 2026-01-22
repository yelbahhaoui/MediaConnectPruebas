import React, { useEffect, useState } from 'react';
import PostCard from '../components/social/PostCard';
import { PenSquare, Flame, User, MessageCircle } from 'lucide-react'; // Añadido MessageCircle
import { db } from '../services/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Forum = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [trends, setTrends] = useState([]); // Estado para tendencias

  // 1. LEER POSTS EN TIEMPO REAL
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt ? new Date(doc.data().createdAt.seconds * 1000).toLocaleDateString() : "Just now"
      }));
      setPosts(postsData);
      calculateTrends(postsData); // Calcular tendencias cada vez que cambian los posts
    });
    return () => unsubscribe();
  }, []);

  // Función para calcular tendencias (simple: hashtags o palabras frecuentes)
  const calculateTrends = (posts) => {
    const hashtags = {};
    posts.forEach(post => {
      // Extraer hashtags con regex
      const matches = post.content.match(/#[\w]+/g);
      if (matches) {
        matches.forEach(tag => {
          hashtags[tag] = (hashtags[tag] || 0) + 1;
        });
      }
    });
    // Convertir a array y ordenar
    const sortedTrends = Object.entries(hashtags)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5) // Top 5
      .map(([tag, count]) => ({ tag, count }));

    setTrends(sortedTrends.length > 0 ? sortedTrends : [{ tag: "#General", count: posts.length }]);
  };

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
        likes: [], // Array de UIDs de usuarios que dieron like
        commentsCount: 0, // Contador simple para mostrar
        retweets: 0,
        tag: "General" // Podrías extraer el primer hashtag aquí
      });
      setNewPostContent("");
    } catch (error) { console.error("Error publicando:", error); }
  };

  // 3. ELIMINAR POST
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

  // 4. DAR LIKE (Funcionalidad Real)
  const handleLike = async (postId, likesArray) => {
    if (!user) { alert("Inicia sesión para dar like"); return; }
    const postRef = doc(db, "posts", postId);
    const isLiked = likesArray.includes(user.uid);

    try {
      if (isLiked) {
        await updateDoc(postRef, { likes: arrayRemove(user.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(user.uid) });
      }
    } catch (error) { console.error("Error dando like:", error); }
  };

  // Navegar al detalle del post
  const goToPost = (postId) => {
    navigate(`/forum/post/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* COLUMNA IZQUIERDA */}
        <div className="hidden lg:block col-span-1 p-4 border-r border-slate-200 dark:border-slate-800 sticky top-16 h-screen overflow-y-auto">
          <h2 className="text-xl font-bold mb-6 px-2 text-slate-900 dark:text-white">Navegación</h2>
          <nav className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold transition-colors">🏠 Inicio</button>
            <button className="w-full text-left px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">🔔 Notificaciones</button>
            <button
              onClick={() => navigate('/chat')} // <--- AQUI ESTÁ EL CAMBIO
              className="w-full text-left px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              📩 Mensajes
            </button>
            <button className="w-full text-left px-4 py-3 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">👤 Perfil</button>
          </nav>
        </div>

        {/* COLUMNA CENTRAL */}
        <div className="col-span-1 lg:col-span-2 border-r border-slate-200 dark:border-slate-800 min-h-screen pb-20">
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

              const isMyPost = user && ((post.uid && post.uid === user.uid) || (post.user.name === user.displayName) || (post.handle === user.email?.split('@')[0]));

              if (isMyPost) {
                finalPostData.user = { name: user.displayName, avatar: user.photoURL };
              }

              // Preparamos datos para el componente PostCard (asegurando arrays)
              const likes = post.likes || [];
              const isLiked = user ? likes.includes(user.uid) : false;

              return (
                <div key={post.id} onClick={() => goToPost(post.id)} className="cursor-pointer"> {/* Click para ir al detalle */}
                  <PostCard
                    {...finalPostData}
                    likesCount={likes.length} // Pasamos número
                    isLiked={isLiked}         // Pasamos si yo le di like
                    onLike={() => handleLike(post.id, likes)} // Función like real
                    isOwner={isMyPost}
                    onDelete={(e) => { e.stopPropagation(); handleDelete(post.id); }} // Stop propagation para no abrir el post al borrar
                  // Pasamos props extra si PostCard las soporta, o las ajustas en PostCard
                  />
                </div>
              );
            })}
            {posts.length === 0 && <div className="p-8 text-center text-slate-500">No hay publicaciones aún.</div>}
          </div>
        </div>

        {/* COLUMNA DERECHA (Tendencias Reales) */}
        <div className="hidden lg:block col-span-1 p-4 sticky top-16 h-fit">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-900 dark:text-white"><Flame size={20} className="text-orange-500" /> Tendencias</h3>
            <div className="space-y-4">
              {trends.map((trend, index) => (
                <div key={index} className="hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-lg cursor-pointer transition-colors">
                  <p className="text-xs text-slate-500">Tendencia en MediaConnect</p>
                  <p className="font-bold text-slate-900 dark:text-white">{trend.tag}</p>
                  <p className="text-xs text-slate-400">{trend.count} posts</p>
                </div>
              ))}
              {trends.length === 0 && <p className="text-sm text-slate-500">No hay tendencias suficientes.</p>}
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden fixed bottom-6 right-6"><button className="bg-blue-600 p-4 rounded-full shadow-lg text-white" onClick={() => window.scrollTo(0, 0)}><PenSquare size={24} /></button></div>
    </div>
  );
};

export default Forum;