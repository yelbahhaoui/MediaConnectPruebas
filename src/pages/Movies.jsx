import React, { useEffect, useState } from 'react';
import { fetchPopularMovies, searchMovies } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';
import { ChevronDown } from 'lucide-react';

const Movies = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedMovies, setDisplayedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const [page, setPage] = useState(1); // Control de página
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  const genres = [
    { id: 28, name: "Acción" }, { id: 12, name: "Aventura" },
    { id: 16, name: "Animación" }, { id: 35, name: "Comedia" },
    { id: 80, name: "Crimen" }, { id: 18, name: "Drama" },
    { id: 10751, name: "Familia" }, { id: 14, name: "Fantasía" },
    { id: 27, name: "Terror" }, { id: 878, name: "Ciencia Ficción" }
  ];

  // Carga inicial
  useEffect(() => { loadContent(1); }, []);

  // Filtros en cliente
  useEffect(() => {
    let result = rawData;
    if (filters.genre) result = result.filter(m => m.genre_ids && m.genre_ids.includes(parseInt(filters.genre)));
    if (filters.year) result = result.filter(m => m.release_date && m.release_date.startsWith(filters.year));
    if (filters.minRating > 0) result = result.filter(m => m.vote_average >= filters.minRating);
    setDisplayedMovies(result);
  }, [rawData, filters]);

  const loadContent = async (pageNum = 1) => {
    setLoading(true);
    const data = await fetchPopularMovies(pageNum);
    
    if (pageNum === 1) {
      setRawData(data || []);
    } else {
      // Si es página > 1, añadimos los resultados a los que ya teníamos
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
    // En búsquedas solemos resetear porque la API de búsqueda de TMDB también se pagina aparte
    // Para simplificar, aquí buscamos y reseteamos la lista
    const data = await searchMovies(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-red-500 pl-4">
        Películas
      </h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedMovies.map((movie) => (
            <MediaCard 
              // Usamos un ID compuesto para evitar errores si la API devuelve duplicados
              key={`${movie.id}-${Math.random()}`}
              id={movie.id}
              title={movie.title}
              image={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/300x450'}
              rating={Math.round(movie.vote_average * 10)}
              type="Película"
            />
          ))}
      </div>
      
      {loading && <div className="text-slate-600 dark:text-white text-center py-10 animate-pulse">Cargando cartelera...</div>}

      {/* Botón Cargar Más */}
      {!loading && displayedMovies.length > 0 && (
        <div className="mt-12 flex justify-center">
            <button 
            onClick={handleLoadMore}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-red-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            >
            <ChevronDown size={20} /> Cargar más películas
            </button>
        </div>
      )}
    </div>
  );
};

export default Movies;