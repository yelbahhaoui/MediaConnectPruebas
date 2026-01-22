import { db } from './firebase'; 
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";

const ANILIST_API = 'https://graphql.anilist.co';

// --- CONFIGURACIÓN DE APIS ---
const TMDB_API_KEY = '838a2f96830809397180cc26e5480143'; 
const RAWG_API_KEY = 'fd0d765a93d6484f99da5195297889cc';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

// --- ANIME (Con paginación) ---
export const fetchTrendingAnime = async (page = 1) => {
  const query = `
  query ($page: Int) {
    Page(page: $page, perPage: 20) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title { romaji english }
        coverImage { large }
        averageScore
      }
    }
  }
  `;
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query, variables: { page } })
    });
    const data = await response.json();
    return data.data.Page.media;
  } catch (error) {
    console.error("Error anime:", error);
    return [];
  }
};

// --- PELÍCULAS (Con paginación) ---
export const fetchPopularMovies = async (page = 1) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error movies:", error);
    return [];
  }
};

// --- SERIES (Con paginación) ---
export const fetchPopularSeries = async (page = 1) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error series:", error);
    return [];
  }
};

// --- VIDEOJUEGOS (Con paginación) ---
export const fetchPopularGames = async (page = 1) => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&dates=2023-01-01,2024-12-31&ordering=-rating&page_size=20&page=${page}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error games:", error);
    return [];
  }
};

// --- BÚSQUEDAS (Sin cambios) ---

export const searchMovies = async (query) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}`);
    const data = await response.json();
    return data.results;
  } catch (error) { return []; }
};

export const searchSeries = async (query) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=es-ES&query=${query}`);
    const data = await response.json();
    return data.results;
  } catch (error) { return []; }
};

export const searchGames = async (query) => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&search=${query}&page_size=12`);
    const data = await response.json();
    return data.results;
  } catch (error) { return []; }
};

export const searchAnime = async (query) => {
  const gqlQuery = `
  query ($search: String) {
    Page(page: 1, perPage: 12) {
      media(type: ANIME, search: $search, sort: POPULARITY_DESC) {
        id
        title { romaji english }
        coverImage { large }
        averageScore
        genres
        startDate { year }
      }
    }
  }
  `;
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query: gqlQuery, variables: { search: query } })
    });
    const data = await response.json();
    return data.data.Page.media;
  } catch (error) { return []; }
};

// --- BÚSQUEDA DE USUARIOS (FIRESTORE) ---
export const searchUsers = async (searchTerm) => {
  if (!searchTerm) return [];
  try {
    const usersRef = collection(db, "users");
    // Nota: Esta es una búsqueda básica por prefijo (case-sensitive en algunos casos dependiendo de la config)
    // Para producción real se recomienda Algolia o Typesense.
    // Simulamos búsqueda "empieza por"
    const endTerm = searchTerm + '\uf8ff';
    
    const { query, where, limit } = require("firebase/firestore"); 
    return []; 
  } catch (error) {
    console.error("Error buscando usuarios:", error);
    return [];
  }
};


// --- DETALLES INDIVIDUALES ---

export const getMovieDetails = async (id) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits,videos`);
    const data = await response.json();
    return {
      title: data.title,
      overview: data.overview,
      image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
      date: data.release_date,
      rating: Math.round(data.vote_average * 10),
      duration: `${data.runtime} min`,
      creator: data.credits?.crew?.find(p => p.job === "Director")?.name || "Desconocido",
      genres: data.genres?.map(g => g.name).join(", "),
      status: data.status
    };
  } catch (error) { return null; }
};

export const getSeriesDetails = async (id) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits`);
    const data = await response.json();
    return {
      title: data.name,
      overview: data.overview,
      image: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      backdrop: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
      date: data.first_air_date,
      rating: Math.round(data.vote_average * 10),
      duration: `${data.number_of_seasons} Temporadas`,
      creator: data.created_by?.[0]?.name || "Desconocido",
      genres: data.genres?.map(g => g.name).join(", "),
      status: data.status
    };
  } catch (error) { return null; }
};

export const getGameDetails = async (id) => {
  try {
    const response = await fetch(`${RAWG_BASE_URL}/games/${id}?key=${RAWG_API_KEY}`);
    const data = await response.json();
    return {
      title: data.name,
      overview: data.description_raw,
      image: data.background_image,
      backdrop: data.background_image_additional,
      date: data.released,
      rating: data.metacritic,
      duration: `${data.playtime} horas`,
      creator: data.developers?.[0]?.name || "Desconocido",
      genres: data.genres?.map(g => g.name).join(", "),
      status: "Lanzado"
    };
  } catch (error) { return null; }
};

export const getAnimeDetails = async (id) => {
  const query = `
  query ($id: Int) {
    Media(id: $id) {
      title { romaji english }
      description
      coverImage { large extraLarge }
      bannerImage
      averageScore
      episodes
      status
      startDate { year month day }
      genres
      studios(isMain: true) { nodes { name } }
    }
  }
  `;
  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ query, variables: { id } })
    });
    const data = await response.json();
    const media = data.data.Media;
    return {
      title: media.title.english || media.title.romaji,
      overview: media.description.replace(/<[^>]*>?/gm, ''),
      image: media.coverImage.large,
      backdrop: media.bannerImage || media.coverImage.extraLarge,
      date: `${media.startDate.year}-${media.startDate.month}-${media.startDate.day}`,
      rating: media.averageScore,
      duration: `${media.episodes || '?'} Episodios`,
      creator: media.studios?.nodes?.[0]?.name || "Studio",
      genres: media.genres?.join(", "),
      status: media.status
    };
  } catch (error) { return null; }
};

// --- FAVORITOS (FIRESTORE) ---

export const addToFavorites = async (userId, item) => {
  try {
    await setDoc(doc(db, "users", userId, "favorites", item.id.toString()), {
      id: item.id,
      title: item.title,
      image: item.image,
      type: item.type || 'unknown',
      rating: item.rating,
      addedAt: new Date()
    });
    return true;
  } catch (e) {
    console.error("Error adding favorite: ", e);
    return false;
  }
};

export const removeFromFavorites = async (userId, itemId) => {
  try {
    await deleteDoc(doc(db, "users", userId, "favorites", itemId.toString()));
    return true;
  } catch (e) { return false; }
};

export const checkIsFavorite = async (userId, itemId) => {
  const docRef = doc(db, "users", userId, "favorites", itemId.toString());
  const docSnap = await getDoc(docRef);
  return docSnap.exists();
};