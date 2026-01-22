import React, { useEffect, useState } from 'react';
import { fetchTrendingAnime, searchAnime } from '../services/api';
import MediaCard from '../components/media/MediaCard';
import FilterBar from '../components/common/FilterBar';
import { ChevronDown } from 'lucide-react';

const Anime = () => {
  const [rawData, setRawData] = useState([]);
  const [displayedAnime, setDisplayedAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: 0 });
  const [page, setPage] = useState(1);

  const genres = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
    "Horror", "Mecha", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports"
  ].map(g => ({ id: g, name: g }));

  useEffect(() => { loadContent(1); }, []);

  useEffect(() => {
    let result = rawData;
    if (filters.genre) {
      result = result.filter(a => a.genres && a.genres.includes(filters.genre));
    }
    if (filters.year) {
      result = result.filter(a => a.startDate && a.startDate.year == filters.year);
    }
    if (filters.minRating > 0) {
      result = result.filter(a => (a.averageScore || 0) >= filters.minRating * 10);
    }
    setDisplayedAnime(result);
  }, [rawData, filters]);

  const loadContent = async (pageNum = 1) => {
    setLoading(true);
    const data = await fetchTrendingAnime(pageNum);
    
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
    const data = await searchAnime(query);
    setRawData(data || []);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') setFilters({ genre: '', year: '', minRating: 0 });
    else setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 border-l-4 border-blue-500 pl-4">Anime</h1>
      
      <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} filters={filters} genresList={genres} />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayedAnime.map((anime) => (
          <MediaCard 
            key={`${anime.id}-${Math.random()}`}
            id={anime.id}
            title={anime.title.english || anime.title.romaji}
            image={anime.coverImage.large}
            rating={anime.averageScore}
            type="Anime"
          />
        ))}
      </div>

      {loading && <div className="text-slate-600 dark:text-white text-center py-10 animate-pulse">Cargando anime...</div>}

      {!loading && displayedAnime.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleLoadMore}
            className="bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold py-3 px-8 rounded-full transition-all hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <ChevronDown size={20} /> Cargar más anime
          </button>
        </div>
      )}
    </div>
  );
};

export default Anime;