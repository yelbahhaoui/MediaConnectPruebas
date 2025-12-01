import React, { useEffect, useState } from 'react';
import { fetchTrendingAnime } from '../services/api';
import MediaCard from '../components/media/MediaCard';

const Anime = () => {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta cuando la página se carga
  useEffect(() => {
    const loadAnime = async () => {
      const data = await fetchTrendingAnime();
      setAnimes(data);
      setLoading(false);
    };
    loadAnime();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8 border-l-4 border-blue-500 pl-4">
        Anime en Tendencia
      </h1>

      {loading ? (
        <div className="text-white text-center py-20">Cargando animes...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {animes.map((anime) => (
            <MediaCard 
              key={anime.id}
              title={anime.title.english || anime.title.romaji}
              image={anime.coverImage.large}
              rating={anime.averageScore}
              type="Anime"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Anime;