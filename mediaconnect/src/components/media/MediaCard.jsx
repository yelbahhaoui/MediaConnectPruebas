import React from 'react';
import { Star } from 'lucide-react';

const MediaCard = ({ title, image, rating, type }) => {
  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-blue-500/20 transition-all hover:-translate-y-1 cursor-pointer group">
      {/* Contenedor de Imagen */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded-md flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">{rating}%</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{type}</span>
        <h3 className="text-white font-semibold truncate mt-1" title={title}>{title}</h3>
      </div>
    </div>
  );
};

export default MediaCard;