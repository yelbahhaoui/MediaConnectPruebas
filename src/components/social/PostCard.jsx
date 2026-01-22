import React from 'react'; // Elimina useState local para likes
import { Heart, MessageCircle, Repeat, MoreHorizontal, Trash2 } from 'lucide-react';

const PostCard = ({ 
    user, handle, time, content, image, 
    likesCount = 0, // Nuevo prop
    isLiked = false, // Nuevo prop
    onLike,         // Nuevo prop (función)
    comments, retweets, tag, isOwner, onDelete,
    onClick // Para manejar el click en toda la tarjeta si se pasa
}) => {
  
  // Manejador local para evitar propagación del click al padre (navegación)
  const handleLikeClick = (e) => {
      e.stopPropagation();
      if (onLike) onLike();
  };

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer relative">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img 
            src={user?.avatar || "https://via.placeholder.com/150"} 
            alt={user?.name} 
            className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {/* Header Post */}
          <div className="flex items-center justify-between mb-1 relative">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 dark:text-white hover:underline">{user?.name}</span>
              <span className="text-slate-500 text-sm">@{handle}</span>
              <span className="text-slate-400 text-sm">·</span>
              <span className="text-slate-500 text-sm hover:underline">{time}</span>
            </div>
            {/* Menú Borrar */}
            {isOwner && onDelete && (
                 <button onClick={onDelete} className="text-slate-400 hover:text-red-500 p-1"><Trash2 size={16}/></button>
            )}
          </div>

          <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap mb-3 leading-relaxed">
            {content}
          </p>

          {/* Botones Acción */}
          <div className="flex items-center justify-between max-w-md text-slate-500 dark:text-slate-500 mt-3">
            <button className="flex items-center gap-2 group hover:text-blue-500 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-500/10"><MessageCircle size={18} /></div>
              <span className="text-sm">{comments || 0}</span>
            </button>
            
            <button 
              onClick={handleLikeClick} // Usamos el manejador local
              className={`flex items-center gap-2 group transition-colors ${isLiked ? 'text-pink-600' : 'hover:text-pink-500'}`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-500/10">
                  <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
              </div>
              <span className="text-sm">{likesCount}</span>
            </button>

             {/* Botón ver likes (Solo dueño) */}
             {isOwner && likesCount > 0 && (
                <span className="text-xs text-blue-500 hover:underline cursor-pointer ml-2" onClick={(e) => { e.stopPropagation(); alert("Lista de likes (TODO: Modal)"); }}>
                    Ver quién
                </span>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;