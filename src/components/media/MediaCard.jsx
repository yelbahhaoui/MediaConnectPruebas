import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const MediaCard = ({ id, title, image, rating, type }) => {
  
  const getPath = () => {
    if (type === 'Película') return `/movie/${id}`;
    if (type === 'Serie TV') return `/series/${id}`;
    if (type === 'Juego') return `/game/${id}`;
    if (type === 'Anime') return `/anime/${id}`;
    return '/';
  };

  return (
    <Link to={getPath()} className="block"> 
      <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all hover:-translate-y-1 cursor-pointer group h-full flex flex-col border border-slate-200 dark:border-slate-700">
        
        {/* Contenedor de Imagen */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md flex items-center gap-1 backdrop-blur-sm">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-bold text-white">{rating}%</span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col justify-end">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{type}</span>
          <h3 className="text-slate-900 dark:text-white font-semibold truncate mt-1" title={title}>{title}</h3>
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;