import React, { useEffect, useState } from 'react';
import { fetchPopularSeries, searchSeries } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';
import { ChevronDown } from 'lucide-react';

const Series = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedSeries, setDisplayedSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const [page, setPage] = useState(1); // Control de página
  const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  const genres = [
    { id: 10759, name: "Acción y Aventura" }, { id: 16, name: "Animación" },
    { id: 35, name: "Comedia" }, { id: 80, name: "Crimen" },
    { id: 18, name: "Drama" }, { id: 9648, name: "Misterio" },
    { id: 10765, name: "Sci-Fi & Fantasy" }, { id: 10768, name: "Guerra & Política" }
  ];

  useEffect(() => { loadContent(1); }, []);

  useEffect(() => {
    let result = rawData;
    if (filters.genre) {
      const genreId = parseInt(filters.genre);
      result = result.filter(s => s.genre_ids && s.genre_ids.includes(genreId));
    }
    if (filters.year) {
      result = result.filter(s => s.first_air_date && s.first_air_date.startsWith(filters.year));
    }
    if (filters.minRating > 0) {
      result = result.filter(s => s.vote_average >= filters.minRating);
    }
    setDisplayedSeries(result);
  }, [rawData, filters]);

  const loadContent = async (pageNum = 1) => {
    setLoading(true);
    const data = await fetchPopularSeries(pageNum);
    
    if (pageNum === 1) {
        setRawData(data || []);
    } else {
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
    const data = await searchSeries(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-purple-500 pl-4">Series de TV</h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {displayedSeries.map((show) => (
            <MediaCard 
              key={`${show.id}-${Math.random()}`}
              id={show.id}
              title={show.name}
              image={show.poster_path ? `${IMAGE_BASE}${show.poster_path}` : 'https://via.placeholder.com/300x450'}
              rating={Math.round(show.vote_average * 10)}
              type="Serie TV"
            />
          ))}
      </div>

      {loading && <div className="text-slate-600 dark:text-white text-center py-10 animate-pulse">Cargando series...</div>}

      {/* Botón Cargar Más */}
      {!loading && displayedSeries.length > 0 && (
        <div className="mt-12 flex justify-center">
            <button 
            onClick={handleLoadMore}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-purple-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            >
            <ChevronDown size={20} /> Cargar más series
            </button>
        </div>
      )}
    </div>
  );
};

export default Series;