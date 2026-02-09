export const API_CONFIG = {
  BASE_URL: "https://api.deezer.com",
  PROXY_URL: "http://localhost:8080/",
  DEFAULT_HEADERS: {
    "X-Requested-With": "XMLHttpRequest",
  },
};

/**
 * Construye la URL completa usando el proxy y la URL base.
 * @param {string} endpoint - El endpoint de la API (ej: '/chart').
 * @returns {string} La URL completa para hacer fetch.
 */
export const buildUrl = (endpoint) => {

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_CONFIG.PROXY_URL}${API_CONFIG.BASE_URL}${cleanEndpoint}`;
};
