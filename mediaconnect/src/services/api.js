// Este servicio conecta con las APIs externas
const ANILIST_API = 'https://graphql.anilist.co';

export const fetchTrendingAnime = async () => {
  // Query de GraphQL para pedir los animes populares
  const query = `
  query {
    Page(page: 1, perPage: 12) {
      media(type: ANIME, sort: TRENDING_DESC) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        averageScore
        genres
      }
    }
  }
  `;

  try {
    const response = await fetch(ANILIST_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    const data = await response.json();
    // Devolvemos solo la lista limpia de animes
    return data.data.Page.media;
  } catch (error) {
    console.error("Error fetching anime:", error);
    return [];
  }
};