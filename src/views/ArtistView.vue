<template>
  <div class="artist-view-container" v-if="artist">
    <!-- Encabezado Hero -->
    <div class="artist-hero" :style="{ backgroundImage: `url(${artist.picture_xl || artist.picture_big})` }">
      <div class="hero-overlay">
        <h1 class="artist-name">{{ artist.name }}</h1>
        <p class="fan-count">{{ formatFans(artist.nb_fan) }} Fans</p>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Sección de Canciones Top -->
      <section class="mb-5">
        <h2 class="section-title">Canciones Top</h2>
        <div class="tracks-list">
          <div v-for="(track, index) in tracks" :key="track.id" class="track-row" @click="playTrack(track)">
            <span class="track-index">{{ index + 1 }}</span>
            <span class="track-title">{{ track.title }}</span>
            <span class="track-duration">{{ formatDuration(track.duration) }}</span>
          </div>
        </div>
      </section>

      <!-- Sección de Álbumes -->
      <section>
        <h2 class="section-title">Álbumes</h2>
        <div class="albums-grid">
          <div v-for="album in albums" :key="album.id" class="album-card" @click="goToAlbum(album.id)">
            <img :src="album.cover_medium" :alt="album.title" class="album-cover">
            <h4 class="album-title">{{ album.title }}</h4>
            <p class="album-year">{{ album.release_date }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div v-else class="loading-container">
    <p>Cargando artista...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchArtistDetails } from '@/api/apiFuncional';
import { usePlayerStore } from '@/stores/player';

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();

const artist = ref(null);
const tracks = ref([]);
const albums = ref([]);

const formatFans = (num) => {
  return new Intl.NumberFormat('es-ES', { notation: "compact", compactDisplay: "short" }).format(num);
};

const formatDuration = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
};

const playTrack = (track) => {
  playerStore.playTrack({
    ...track,
    artist: { name: artist.value.name } // Enriquecer datos de la pista si faltan
  });
};

const goToAlbum = (albumId) => {
  router.push(`/album/${albumId}`);
};

onMounted(async () => {
  const artistId = route.params.id;
  if (artistId) {
    const data = await fetchArtistDetails(artistId);
    if (data) {
      artist.value = data.artist;
      tracks.value = data.tracks;
      albums.value = data.albums;
    }
  }
});
</script>

<style scoped>
.artist-view-container {
  padding-bottom: 100px;
}

.artist-hero {
  height: 400px;
  background-size: cover;
  background-position: center 20%;
  position: relative;
  display: flex;
  align-items: flex-end;
}

.hero-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  width: 100%;
  padding: 40px;
  color: white;
}

.artist-name {
  font-size: 4rem;
  font-weight: 800;
  margin: 0;
  text-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.fan-count {
  font-size: 1.2rem;
  opacity: 0.9;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.section-title {
  color: #FF4081;
  font-weight: 700;
  margin-bottom: 20px;
  font-size: 1.8rem;
}

/* Lista de Pistas */
.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.track-row {
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  transition: all 0.2s;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.track-row:hover {
  background: #fff0f5; /* Hover rosa claro */
  transform: translateX(5px);
}

.track-index {
  width: 30px;
  font-weight: bold;
  color: #888;
}

.track-title {
  flex-grow: 1;
  font-weight: 600;
  color: #333;
}

.track-duration {
  color: #666;
}

/* Cuadrícula de Álbumes */
.albums-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 25px;
}

.album-card {
  text-align: center;
  cursor: pointer;
}

.album-cover {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 10px;
  transition: transform 0.3s;
}

.album-card:hover .album-cover {
  transform: scale(1.05);
}

.album-title {
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 5px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.album-year {
  color: #888;
  font-size: 0.9rem;
}

.loading-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  color: #666;
}

@media (max-width: 768px) {
  .artist-name {
    font-size: 2.5rem;
  }
}
</style>
