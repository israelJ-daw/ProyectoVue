<template>
  <div class="search-container">
    <div class="search-header mb-4">
      <h1 class="fw-bold text-dark mb-2">Explora en Deezer</h1>
      <p class="text-muted">Encuentra canciones, álbumes y artistas favoritos.</p>
    </div>

    <SearchBar @search="searchDeezer" />

    <!-- Filtros y Ordenamiento Premium -->
    <div class="filters-container mb-5" v-if="songs.length > 0 || albums.length > 0 || artists.length > 0">
      <div class="glass-panel animate-fade-in">
        <div class="row g-4 align-items-end">
          
          <!-- Filtro Duración -->
          <div class="col-md-4">
            <label class="form-label fw-bold text-uppercase"><i class="bi bi-clock me-1"></i> Duración</label>
            <select class="form-select form-select-sm rounded-pill premium-input" v-model="durationFilter">
              <option value="all">Todas las duraciones</option>
              <option value="short">⚡ Cortas (&lt; 2 min)</option>
              <option value="medium">🎵 Medias (2 - 4 min)</option>
              <option value="long">🐢 Largas (&gt; 4 min)</option>
            </select>
          </div>

          <!-- Filtro Artista (Texto) -->
          <div class="col-md-4">
            <label class="form-label fw-bold text-uppercase"><i class="bi bi-funnel me-1"></i> Filtrar Artista</label>
            <input type="text" class="form-control form-control-sm rounded-pill premium-input" v-model="artistFilter" placeholder="Ej: Shakira..." />
          </div>

          <!-- Ordenar Por -->
          <div class="col-md-4">
            <label class="form-label fw-bold text-uppercase"><i class="bi bi-sort-down me-1"></i> Ordenar Por</label>
            <select class="form-select form-select-sm rounded-pill premium-input" v-model="sortBy">
              <option value="relevance">✨ Relevancia</option>
              <option value="popularity">🔥 Popularidad (Rank)</option>
              <option value="duration_asc">⏱ Duración (Menor a Mayor)</option>
              <option value="duration_desc">⏳ Duración (Mayor a Menor)</option>
              <option value="alphabetical">🔤 Alfabético (A-Z)</option>
            </select>
          </div>

        </div>
      </div>
    </div>

    <!-- Resultados -->
    <div class="results-container animate-fade-in">
      
      <!-- Canciones -->
      <div v-if="filteredAndSortedSongs.length > 0" class="result-section mb-5">
        <div class="d-flex align-items-center mb-3">
           <h2 class="fw-bold mb-0 me-2 text-dark">Canciones</h2>
           <span class="badge bg-light text-secondary rounded-pill">{{ filteredAndSortedSongs.length }}</span>
        </div>
        <SearchResults :songs="filteredAndSortedSongs" @play="$emit('play', $event)" />
      </div>
      <div v-else-if="songs.length > 0" class="text-center py-4 text-muted border rounded-4 mb-4 bg-white">
        <i class="bi bi-filter-circle fs-4 d-block mb-2"></i>
        No hay canciones que coincidan con los filtros.
      </div>


      <!-- Álbumes -->
      <div v-if="filteredAndSortedAlbums.length > 0" class="result-section mb-5">
         <div class="d-flex align-items-center mb-3">
           <h2 class="fw-bold mb-0 me-2 text-dark">Álbumes</h2>
           <span class="badge bg-light text-secondary rounded-pill">{{ filteredAndSortedAlbums.length }}</span>
        </div>
        <SearchResults :albums="filteredAndSortedAlbums" @play="$emit('play', $event)" />
      </div>


      <!-- Artistas -->
      <div v-if="filteredAndSortedArtists.length > 0" class="result-section mb-5">
         <div class="d-flex align-items-center mb-3">
           <h2 class="fw-bold mb-0 me-2 text-dark">Artistas</h2>
           <span class="badge bg-light text-secondary rounded-pill">{{ filteredAndSortedArtists.length }}</span>
        </div>
        <SearchResults :artists="filteredAndSortedArtists" @play="$emit('play', $event)" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import SearchBar from "../components/SearchBar.vue";
import SearchResults from "../components/SearchResults.vue";
import { API_CONFIG } from "@/config/api";

const route = useRoute();
const searchQuery = ref(route.query.q || "");

const songs = ref([]);
const albums = ref([]);
const artists = ref([]);
const cache = new Map();


const durationFilter = ref("all");
const artistFilter = ref("");
const sortBy = ref("relevance");


const filteredAndSortedSongs = computed(() => {
  let result = [...songs.value];

  // 1. Filtrar por Duración
  if (durationFilter.value === "short") {
    result = result.filter(song => song.duration < 120); // < 2 min
  } else if (durationFilter.value === "medium") {
    result = result.filter(song => song.duration >= 120 && song.duration <= 240); // 2-4 min
  } else if (durationFilter.value === "long") {
    result = result.filter(song => song.duration > 240); // > 4 min
  }

  // 2. Filtrar por Artista
  if (artistFilter.value.trim() !== "") {
    result = result.filter(song =>
      song.artist.name.toLowerCase().includes(artistFilter.value.trim().toLowerCase())
    );
  }

  // 3. Ordenar
  if (sortBy.value === "popularity") {
    result.sort((a, b) => b.rank - a.rank);
  } else if (sortBy.value === "duration_asc") {
    result.sort((a, b) => a.duration - b.duration);
  } else if (sortBy.value === "duration_desc") {
    result.sort((a, b) => b.duration - a.duration);
  } else if (sortBy.value === "alphabetical") {
    result.sort((a, b) => a.title.localeCompare(b.title));
  }
  // 'relevance' no hace nada porque ya vienen así de la API

  return result;
});


const filteredAndSortedAlbums = computed(() => albums.value.filter(album =>
  album.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
  // Permitir también filtrar álbumes por el input de artista si coincide
  (artistFilter.value && album.artist.name.toLowerCase().includes(artistFilter.value.toLowerCase())) ||
  !artistFilter.value
));

const filteredAndSortedArtists = computed(() => artists.value.filter(artist =>
  artist.name.toLowerCase().includes(searchQuery.value.toLowerCase())
));


const searchDeezer = async (query) => {
  if (!query.trim()) return;
  searchQuery.value = query;

  if (cache.has(query)) {
    const cachedData = cache.get(query);
    songs.value = cachedData.songs;
    albums.value = cachedData.albums;
    artists.value = cachedData.artists;
    return;
  }


  const proxy = API_CONFIG.PROXY_URL;
  

  const songUrl = `${proxy}https://api.deezer.com/search?q=${encodeURIComponent(query)}`;
  const albumUrl = `${proxy}https://api.deezer.com/search/album?q=${encodeURIComponent(query)}`;
  const artistUrl = `${proxy}https://api.deezer.com/search/artist?q=${encodeURIComponent(query)}`;

  try {
    const [songResponse, albumResponse, artistResponse] = await Promise.all([
      fetch(songUrl),
      fetch(albumUrl),
      fetch(artistUrl)
    ]);

    if (!songResponse.ok || !albumResponse.ok || !artistResponse.ok) {
      throw new Error("Error al buscar en Deezer");
    }

    const songData = await songResponse.json();
    const albumData = await albumResponse.json();
    const artistData = await artistResponse.json();

    cache.set(query, { songs: songData.data, albums: albumData.data, artists: artistData.data });

    songs.value = songData.data || [];
    albums.value = albumData.data || [];
    artists.value = artistData.data || [];
  } catch (error) {
    console.error("Error en la búsqueda:", error.message);
  }
};

onMounted(() => {
  if (searchQuery.value) {
    searchDeezer(searchQuery.value);
  }
});
</script>

<style scoped>
.search-container {
  padding: 20px;
  background-color: #f8f9fa; /* Fondo muy suave */
  min-height: 100vh;
}

.search-header {
  text-align: center;
}

/* Estilos Premium Glassmorphism */
.glass-panel {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  border-radius: 24px;
  padding: 24px;
}

.form-label {
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: #5d6d7e;
  margin-bottom: 8px;
  display: block;
}

.premium-input {
  background: rgba(255, 255, 255, 0.6) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  color: #2c3e50;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 10px 15px;
  font-size: 0.95rem;
}

.premium-input:hover {
  background: rgba(255, 255, 255, 0.8) !important;
  transform: translateY(-1px);
}

.premium-input:focus {
  background: #fff !important;
  border-color: #FF4081 !important; /* Rosa vibrante */
  box-shadow: 0 0 0 4px rgba(255, 64, 129, 0.15) !important;
  outline: none;
}

.premium-input::placeholder {
  color: #a0a0a0;
  font-weight: 400;
}

/* Animaciones */
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar interna de resultados */
.results-container::-webkit-scrollbar {
  height: 6px;
}
.results-container::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
}
</style>
 
 
 
 
 