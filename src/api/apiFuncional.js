import { API_CONFIG, buildUrl } from '../config/api';

/**
 * Función genérica para realizar peticiones a la API
 * @param {string} endpoint - El endpoint de la API a consultar
 * @returns {Promise<any>} La respuesta en formato JSON o null en caso de error
 */
const fetchData = async (endpoint) => {
  try {
    const url = buildUrl(endpoint);
    const response = await fetch(url, {
      method: "GET",
      headers: API_CONFIG.DEFAULT_HEADERS,
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Error en petición a ${endpoint}:`, error);
    return null;
  }
};

/**
 * Obtiene los datos destacados (artistas y canciones) para la página de inicio
 */
export const fetchFeaturedData = async () => {
  try {
    const [artistsData, songsData] = await Promise.all([
      fetchData("/chart/0/artists"),
      fetchData("/chart/0/tracks"),
    ]);

    return {
      artists: artistsData?.data || [],
      songs: songsData?.data || [],
    };
  } catch (error) {
    console.error("❌ Error general al obtener datos destacados:", error);
    return { artists: [], songs: [] };
  }
};

/**
 * Obtiene los detalles completos de un artista (info, top tracks, álbumes)
 * @param {string|number} artistId - El ID del artista
 */
export const fetchArtistDetails = async (artistId) => {
  try {
    const [artist, tracks, albums] = await Promise.all([
      fetchData(`/artist/${artistId}`),
      fetchData(`/artist/${artistId}/top?limit=5`),
      fetchData(`/artist/${artistId}/albums`),
    ]);

    if (!artist) {
      throw new Error("No se pudo obtener la información del artista");
    }

    return {
      artist: artist,
      tracks: tracks?.data || [],
      albums: albums?.data || [],
    };
  } catch (error) {
    console.error(`❌ Error al obtener detalles del artista ${artistId}:`, error);
    return null;
  }
};

/**
 * Obtiene los detalles de un álbum y sus canciones
 * @param {string|number} albumId - El ID del álbum
 */
export const fetchAlbumDetails = async (albumId) => {
  try {
    const [album, tracks] = await Promise.all([
      fetchData(`/album/${albumId}`),
      fetchData(`/album/${albumId}/tracks`),
    ]);

    if (!album) {
      throw new Error("No se pudo obtener la información del álbum");
    }

    return {
      album: album,
      tracks: tracks?.data || [],
    };
  } catch (error) {
    console.error(`❌ Error al obtener detalles del álbum ${albumId}:`, error);
    return null;
  }
};
