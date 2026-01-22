import React, { useEffect, useState } from 'react';
import { fetchPopularGames, searchGames } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';
import { ChevronDown } from 'lucide-react'; // Icono para el botón

const Games = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedGames, setDisplayedGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const [page, setPage] = useState(1); // Control de página

  const genres = [
    { id: "action", name: "Acción" }, { id: "adventure", name: "Aventura" },
    { id: "role-playing-games-rpg", name: "RPG" }, { id: "shooter", name: "Shooter" },
    { id: "indie", name: "Indie" }, { id: "strategy", name: "Estrategia" },
    { id: "sports", name: "Deportes" }, { id: "racing", name: "Carreras" }
  ];

  // Cargar inicial (Página 1)
  useEffect(() => { loadContent(1); }, []);

  // Aplicar filtros en el cliente
  useEffect(() => {
    let result = rawData;
    if (filters.genre) {
      result = result.filter(g => g.genres && g.genres.some(gen => gen.slug === filters.genre));
    }
    if (filters.year) {
      result = result.filter(g => g.released && g.released.startsWith(filters.year));
    }
    if (filters.minRating > 0) {
      result = result.filter(g => (g.metacritic || 0) >= filters.minRating * 10);
    }
    setDisplayedGames(result);
  }, [rawData, filters]);

  const loadContent = async (pageNum = 1) => {
    setLoading(true);
    const data = await fetchPopularGames(pageNum);
    
    if (pageNum === 1) {
      setRawData(data || []);
    } else {
      // Si es página 2 o más, añadimos al final de la lista existente
      setRawData(prev => [...prev, ...(data || [])]);
    }
    setLoading(false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadContent(nextPage);
  };

  const handleSearch = async (query) => {
    if (!query) { setPage(1); loadContent(1); return; }
    const data = await searchGames(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-green-500 pl-4">Videojuegos</h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayedGames.map((game) => (
          <MediaCard 
            // Usamos un key compuesto para evitar duplicados si la API repite alguno
            key={`${game.id}-${Math.random()}`}
            id={game.id}
            title={game.name}
            image={game.background_image}
            rating={game.metacritic || 0}
            type="Juego"
          />
        ))}
      </div>

      {loading && <div className="text-slate-600 dark:text-white text-center py-10 animate-pulse">Cargando...</div>}

      {/* BOTÓN CARGAR MÁS */}
      {!loading && displayedGames.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleLoadMore}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-green-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <ChevronDown size={20} /> Cargar más juegos
          </button>
        </div>
      )}
    </div>
  );
};

export default Games;