import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Star, User, Tag, Heart } from 'lucide-react';
import { getMovieDetails, getSeriesDetails, getGameDetails, getAnimeDetails, addToFavorites, removeFromFavorites, checkIsFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Details = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(false);
      try {
        let data = null;
        if (type === 'movie') data = await getMovieDetails(id);
        else if (type === 'series') data = await getSeriesDetails(id);
        else if (type === 'game') data = await getGameDetails(id);
        else if (type === 'anime') data = await getAnimeDetails(id);

        if (data) {
          setItem(data);
          if (user) {
            const exists = await checkIsFavorite(user.uid, id);
            setIsFav(exists);
          }
        } else { setError(true); }
      } catch (err) { setError(true); } 
      finally { setLoading(false); }
    };
    loadData();
  }, [id, type, user]);

  const handleToggleFavorite = async () => {
    if (!user) return alert("Inicia sesión para añadir a favoritos");
    const itemToSave = { ...item, id, type };
    if (isFav) { await removeFromFavorites(user.uid, id); setIsFav(false); } 
    else { await addToFavorites(user.uid, itemToSave); setIsFav(true); }
  };

  if (loading) return <div className="text-center py-20 text-xl dark:text-white">Cargando información...</div>;
  if (error || !item) return <div className="text-center py-20 dark:text-white">No se encontraron detalles.</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 transition-colors duration-300">
      
      {/* HERO BACKDROP (Siempre oscuro por la imagen) */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-slate-900/60 to-transparent z-10"></div>
        <img src={item.backdrop || item.image} alt="Fondo" className="w-full h-full object-cover opacity-80" />
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors">
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-7xl mx-auto px-4 -mt-32 relative z-20 mb-20">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* POSTER */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img src={item.image} alt={item.title} className="w-64 h-96 object-cover rounded-xl shadow-2xl border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-800" />
          </div>

          {/* INFORMACIÓN */}
          <div className="flex-1 pt-4 md:pt-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 drop-shadow-md md:drop-shadow-none">{item.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">{type.toUpperCase()}</span>
              <span className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300 px-3 py-1 rounded-full text-sm flex items-center gap-1 shadow-sm border border-slate-200 dark:border-slate-700">
                <Star size={14} className="text-yellow-500 fill-yellow-500" /> {item.rating || '?'}%
              </span>
              <span className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300 px-3 py-1 rounded-full text-sm shadow-sm border border-slate-200 dark:border-slate-700">{item.status}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><Calendar size={12}/> ESTRENO</p>
                <p className="font-medium text-slate-900 dark:text-white">{item.date || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><Clock size={12}/> DURACIÓN</p>
                <p className="font-medium text-slate-900 dark:text-white">{item.duration}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><User size={12}/> CREADOR</p>
                <p className="font-medium text-slate-900 dark:text-white truncate" title={item.creator}>{item.creator}</p>
              </div>
              <div>
                <p className="text-slate-500 text-xs uppercase font-bold mb-1 flex items-center gap-1"><Tag size={12}/> GÉNEROS</p>
                <p className="font-medium text-slate-900 dark:text-white truncate" title={item.genres}>{item.genres}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white border-l-4 border-blue-500 pl-3">Sinopsis</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">{item.overview || "No hay descripción disponible."}</p>
            </div>
            
            <div className="mt-8">
               <button 
                onClick={handleToggleFavorite}
                className={`px-6 py-3 rounded-lg font-bold transition-transform hover:scale-105 flex items-center gap-2 shadow-lg ${
                  isFav ? 'bg-pink-600 text-white shadow-pink-500/30' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30'
                }`}
              >
                <Heart fill={isFav ? "currentColor" : "none"} />
                {isFav ? "En Favoritos" : "Añadir a Favoritos"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;