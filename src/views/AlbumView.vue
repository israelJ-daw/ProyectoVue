<template>
  <div class="album-view container my-5" v-if="album">
    <!-- Cabecera del Álbum -->
    <div class="row align-items-center mb-5 animate-fade-in">
      <div class="col-md-4 text-center text-md-start mb-4 mb-md-0">
        <div class="album-cover-wrapper shadow-lg">
          <img :src="album.cover_xl" :alt="album.title" class="img-fluid rounded-4 album-cover" />
        </div>
      </div>
      <div class="col-md-8 text-center text-md-start">
        <h5 class="text-uppercase text-muted letter-spacing-2 mb-2">Álbum</h5>
        <h1 class="display-3 fw-bold mb-3 text-dark">{{ album.title }}</h1>
        <div class="d-flex align-items-center justify-content-center justify-content-md-start gap-3 mb-4">
          <img :src="album.artist.picture_small" class="rounded-circle artist-mini-img" alt="Artist" />
          <h4 class="mb-0 fw-bold">
            <router-link :to="'/artist/' + album.artist.id" class="text-decoration-none text-dark hover-link">
              {{ album.artist.name }}
            </router-link>
          </h4>
          <span class="text-muted">• {{ new Date(album.release_date).getFullYear() }} • {{ album.nb_tracks }} canciones</span>
        </div>
        
        <!-- Botón Reproducir Todo (Simulado) -->
        <button class="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-sm hover-scale" @click="playAlbum">
          <i class="bi bi-play-fill me-2 fs-4 align-middle"></i> Reproducir
        </button>
      </div>
    </div>

    <!-- Lista de Canciones -->
    <div class="tracks-section animate-fade-up">
      <h3 class="mb-4 fw-bold text-dark border-bottom pb-2">Canciones</h3>
      <SongCarousel :items="tracks" title="" />
    </div>
  </div>

  <div v-else class="text-center py-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Cargando...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { fetchAlbumDetails } from '@/api/apiFuncional';
import SongCarousel from '@/components/SongCarousel.vue';
import { usePlayerStore } from '@/stores/player';

const route = useRoute();
const playerStore = usePlayerStore();
const album = ref(null);
const tracks = ref([]);

onMounted(async () => {
  const albumId = route.params.id;
  const data = await fetchAlbumDetails(albumId);
  if (data) {
    album.value = data.album;

    tracks.value = data.tracks.map(track => ({
      ...track,
      album: {
        id: data.album.id,
        title: data.album.title,
        cover_medium: data.album.cover_medium,
        cover_xl: data.album.cover_xl
      }
    }));
  }
});

const playAlbum = () => {
  if (tracks.value.length > 0) {
    playerStore.playTrack(tracks.value[0]);
  }
};
</script>

<style scoped>
.album-view {
  min-height: 80vh;
}

.album-cover-wrapper {
  position: relative;
  transition: transform 0.3s ease;
}

.album-cover-wrapper:hover {
  transform: scale(1.02);
}

.album-cover {
  width: 100%;
  max-width: 350px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
}

.letter-spacing-2 {
  letter-spacing: 2px;
}

.artist-mini-img {
  width: 32px;
  height: 32px;
}

.hover-link:hover {
  text-decoration: underline !important;
  color: #FF4081 !important;
}

.hover-scale {
  transition: transform 0.2s;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.btn-primary {
  background-color: #FF4081;
  border-color: #FF4081;
}

.btn-primary:hover {
  background-color: #d81b60;
  border-color: #d81b60;
}

/* Animaciones */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

.animate-fade-up {
  animation: fadeUp 0.8s ease-out 0.2s backwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
