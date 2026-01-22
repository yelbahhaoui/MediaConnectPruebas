import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/social/PostCard'; // Reutilizamos PostCard
import { ArrowLeft } from 'lucide-react';

const PostDetail = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Cargar el Post Principal
  useEffect(() => {
    const postRef = doc(db, "posts", postId);
    const unsubscribePost = onSnapshot(postRef, (docSnap) => {
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data(), time: "Just now" }); // Ajusta fecha si quieres
      } else {
        navigate('/forum'); // Si no existe, volver
      }
      setLoading(false);
    });

    // 2. Cargar Comentarios (Subcolección)
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    return () => {
      unsubscribePost();
      unsubscribeComments();
    };
  }, [postId, navigate]);

  // 3. Publicar Comentario
  const handleComment = async () => {
    if (!newComment.trim() || !user) return;
    try {
      // Añadir a subcolección comments
      await addDoc(collection(db, "posts", postId, "comments"), {
        content: newComment,
        uid: user.uid,
        user: { name: user.displayName || "Usuario", avatar: user.photoURL || null },
        handle: user.email ? user.email.split('@')[0] : "user",
        createdAt: serverTimestamp(),
        likes: []
      });
      setNewComment("");
      // Opcional: Actualizar contador en el post padre
      // await updateDoc(doc(db, "posts", postId), { commentsCount: increment(1) });
    } catch (error) { console.error("Error comentando:", error); }
  };

   // Like en Post Principal (misma lógica que Forum)
   const handleLike = async () => {
    if (!user || !post) return;
    const postRef = doc(db, "posts", postId);
    const likes = post.likes || [];
    const isLiked = likes.includes(user.uid);
    if (isLiked) await updateDoc(postRef, { likes: arrayRemove(user.uid) });
    else await updateDoc(postRef, { likes: arrayUnion(user.uid) });
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <div className="max-w-2xl mx-auto border-x border-slate-200 dark:border-slate-800 min-h-screen">
        
        {/* Header */}
        <div className="sticky top-16 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><ArrowLeft size={20}/></button>
            <h1 className="text-xl font-bold">Publicación</h1>
        </div>

        {/* Post Principal */}
        {post && (
             <PostCard 
             {...post} 
             likesCount={post.likes?.length || 0}
             isLiked={user ? post.likes?.includes(user.uid) : false}
             onLike={handleLike}
             isOwner={user && post.uid === user.uid}
             // Añade props visuales para indicar que es el "main" si quieres (letra más grande, etc)
           />
        )}

        {/* Formulario Respuesta */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                {user?.photoURL && <img src={user.photoURL} className="w-full h-full object-cover"/>}
            </div>
            <div className="flex-1">
                <textarea 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Publica tu respuesta"
                    className="w-full bg-transparent outline-none text-lg dark:text-white resize-none h-20"
                />
                <div className="flex justify-end">
                    <button onClick={handleComment} disabled={!newComment || !user} className="bg-blue-600 text-white px-4 py-1.5 rounded-full font-bold disabled:opacity-50">Responder</button>
                </div>
            </div>
        </div>

        {/* Lista de Respuestas */}
        <div className="pb-20">
            {comments.map(comment => (
                <PostCard 
                    key={comment.id}
                    {...comment}
                    isComment={true} // Prop opcional para estilizar diferente si quieres
                    // Aquí podrías añadir lógica de likes para comentarios también
                />
            ))}
             {comments.length === 0 && <div className="p-8 text-center text-slate-500">Se el primero en responder.</div>}
        </div>

      </div>
    </div>
  );
};

export default PostDetail;