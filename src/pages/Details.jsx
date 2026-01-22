import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getAnimeDetails, getMovieDetails, getSeriesDetails, getGameDetails, checkIsFavorite, addToFavorites, removeFromFavorites } from '../services/api';
import { Star, Calendar, Clock, PlayCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Details = ({ type: propsType }) => {
  const { id } = useParams();
  const { user } = useAuth();
  const location = useLocation();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  const type = propsType || (location.pathname.includes('anime') ? 'anime' : 
                            location.pathname.includes('movie') ? 'movie' : 
                            location.pathname.includes('game') ? 'game' : 'series');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      let data = null;
      try {
        switch (type) {
          case 'anime': data = await getAnimeDetails(id); break;
          case 'movie': data = await getMovieDetails(id); break;
          case 'series': data = await getSeriesDetails(id); break;
          case 'game': data = await getGameDetails(id); break;
          default: data = null;
        }
      } catch (error) { console.error(error); }

      if (user && data) {
        try {
          const isFav = await checkIsFavorite(user.uid, id);
          setIsFavorite(isFav);
        } catch (error) {}
      }
      setContent(data);
      setLoading(false);
    };
    loadData();
  }, [id, type, user]);

  const toggleFavorite = async () => {
    if (!user) return alert("Inicia sesión para guardar favoritos");
    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFromFavorites(user.uid, id);
        setIsFavorite(false);
      } else {
        await addToFavorites(user.uid, { id, title: content.title, image: content.image, rating: content.rating, type });
        setIsFavorite(true);
      }
    } catch (error) { alert("Error al actualizar favoritos"); }
    setFavLoading(false);
  };

  // Loader Adaptable
  if (loading) return <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-white">Cargando...</div>;
  if (!content) return <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-slate-900 dark:text-white">No encontrado.</div>;

  return (
    // 1. Fondo base adaptable
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      
      {/* Banner / Backdrop */}
      <div className="relative h-[50vh] w-full">
        {/* 2. Degradado mágico: Pasa de imagen a BLANCO en modo claro, y a NEGRO en modo oscuro */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 dark:from-slate-950 dark:via-slate-950/60 to-transparent z-10" />
        
        <img src={content.backdrop || content.image} alt="Backdrop" className="w-full h-full object-cover opacity-60 dark:opacity-50" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20 max-w-7xl mx-auto flex items-end gap-8">
           <img src={content.image} alt={content.title} className="w-48 rounded-xl shadow-2xl border-4 border-white dark:border-slate-800 hidden md:block aspect-[2/3] object-cover" />
           <div className="mb-4">
             {/* Título oscuro en día, claro en noche */}
             <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 dark:text-white">{content.title}</h1>
             
             <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 mb-6">
                {content.date && <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700"><Calendar size={14}/> {content.date.split('-')[0]}</span>}
                {content.duration && <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700"><Clock size={14}/> {content.duration}</span>}
                <span className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 px-3 py-1 rounded-full border border-yellow-200 dark:border-yellow-500/30">
                  <Star size={14} fill="currentColor" /> {content.rating}%
                </span>
             </div>
             
             <button onClick={toggleFavorite} disabled={favLoading} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-md ${isFavorite ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-slate-100 text-slate-900 border border-slate-300 hover:bg-slate-200 dark:bg-white dark:border-none'}`}>
                 <Star size={20} fill={isFavorite ? "currentColor" : "none"} /> {isFavorite ? 'En Favoritos' : 'Añadir a Favoritos'}
             </button>
           </div>
        </div>
      </div>

      {/* --- GRID LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* COLUMNA IZQUIERDA */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Sinopsis */}
          <section>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">Sinopsis</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{content.overview || "No hay descripción disponible."}</p>
          </section>

          {/* Trailer */}
          {content.video && (
             <section>
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600 dark:text-red-500"><PlayCircle size={20}/> Trailer</h3>
               <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800">
                 <iframe 
                   width="100%" height="100%" 
                   src={`https://www.youtube.com/embed/${content.video}`} 
                   title="Trailer" frameBorder="0" allowFullScreen
                 ></iframe>
               </div>
             </section>
          )}

           {/* Géneros */}
           {content.genres && (
             <section>
                <h3 className="text-sm font-bold mb-3 text-slate-500 uppercase tracking-wider">Géneros</h3>
                <div className="flex flex-wrap gap-2">
                  {content.genres.split(', ').map(g => (
                    <span key={g} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 transition-colors cursor-default border border-slate-200 dark:border-slate-700">
                      {g}
                    </span>
                  ))}
                </div>
             </section>
           )}
        </div>

        {/* COLUMNA DERECHA (Sidebar) */}
        <div className="space-y-8">
          
          {/* Info Técnica */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
             <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Detalles</h3>
             <div className="space-y-4">
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Creador / Estudio</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{content.creator}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Estado</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{content.status}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs uppercase font-bold">Fecha Estreno</p>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{content.date || "Desconocida"}</p>
                </div>
             </div>
          </div>

          {/* Reparto */}
          {content.cast && content.cast.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">Reparto Principal</h3>
              <div className="grid grid-cols-1 gap-3">
                {content.cast.map(actor => (
                  <div key={actor.id} className="flex items-center gap-3 bg-white dark:bg-slate-900/30 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-transparent shadow-sm dark:shadow-none">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                      {actor.image ? <img src={actor.image} alt={actor.name} className="w-full h-full object-cover"/> : <User className="p-2 text-slate-500"/>}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-slate-200 truncate">{actor.name}</p>
                      <p className="text-xs text-slate-500 truncate">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Details;