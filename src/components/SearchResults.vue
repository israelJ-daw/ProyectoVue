<template>
  <div class="search-results">

    <!-- Sección de Canciones -->
    <div v-if="songs && songs.length > 0" class="results-section">
      <h3 class="section-title">Canciones</h3>
      <div class="results-container">
        <div class="result-card" v-for="song in songs" :key="song.id" @click="playSong(song)">
          <div class="card-image-wrapper">
            <img :src="song.album?.cover_medium || song.picture_medium" alt="Album cover" class="cover-image" />
            <div class="play-overlay">
              <span class="play-icon">▶</span>
            </div>
          </div>
          
          <div class="card-info">
            <h4 class="card-title">{{ song.title }}</h4>
            <p class="card-subtitle">{{ song.artist.name }}</p>
            
            <button @click.stop="addToPlaylist(song)" class="btn-guapo btn-sm mt-3 w-100">
              Añadir
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Álbumes -->
    <div v-if="albums && albums.length > 0" class="results-section">
      <h3 class="section-title">Álbumes</h3>
      <div class="results-container">
        <div class="result-card" v-for="album in albums" :key="album.id" @click="goToAlbum(album.id)">
          <div class="card-image-wrapper">
            <img :src="album.cover_medium" alt="Album cover" class="cover-image" />
            <div class="play-overlay">
               <span class="play-icon"><i class="bi bi-eye"></i></span>
            </div>
          </div>
          <div class="card-info">
            <h4 class="card-title">{{ album.title }}</h4>
            <p class="card-subtitle">{{ album.artist.name }}</p>
            <button @click.stop="goToAlbum(album.id)" class="btn-guapo btn-sm mt-3 w-100">
              Ver Álbum
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- Sección de Artistas -->
    <div v-if="artists && artists.length > 0" class="results-section">
      <h3 class="section-title">Artistas</h3>
      <div class="results-container">
        <div class="result-card artist-card" v-for="artist in artists" :key="artist.id" @click="goToArtist(artist.id)">
          <div class="card-image-wrapper rounded-circle">
            <img :src="artist.picture_medium" alt="Artist picture" class="cover-image" />
            <div class="play-overlay rounded-circle">
               <span class="play-icon"><i class="bi bi-mic"></i></span>
            </div>
          </div>
          <div class="card-info">
            <h4 class="card-title">{{ artist.name }}</h4>
            <button @click.stop="goToArtist(artist.id)" class="btn-guapo btn-sm mt-3 w-100">
              Ver Perfil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites';
import { useUiStore } from '@/stores/ui';
import { usePlayerStore } from '@/stores/player';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

defineProps({
  songs: { type: Array, default: () => [] },
  albums: { type: Array, default: () => [] },
  artists: { type: Array, default: () => [] },
});

const router = useRouter();

const addToPlaylist = (song) => {
  const favoritesStore = useFavoritesStore();
  const uiStore = useUiStore();
  const userStore = useUserStore();

  if (!userStore.isLoggedIn) {
    uiStore.showModal(
      "¡Inicia Sesión!", 
      "Para crear tu colección de música perfecta, necesitas una cuenta. Regístrate o inicia sesión para continuar.", 
      "warning"
    );
    return;
  }
  
  favoritesStore.addSong({
    id: song.id,
    title: song.title,
    artist: song.artist,
    album: song.album,
    preview: song.preview,
    link: song.link
  });

  uiStore.showModal('¡Añadido!', `${song.title} se agregó a tus favoritos`, 'success');
};

const playSong = (song) => {
  const playerStore = usePlayerStore();
  playerStore.playTrack(song);
};

const goToAlbum = (albumId) => {
  router.push(`/album/${albumId}`);
};

const goToArtist = (artistId) => {
  router.push(`/artist/${artistId}`);
};
</script>

<style scoped>
.search-results {
  margin-top: 20px;
}

.results-section {
  margin-bottom: 50px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 25px;
  padding-left: 10px;
  border-left: 5px solid #FF4081;
  margin-left: 15px;
}

.results-container {
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding: 10px 15px 30px 15px;
  scrollbar-width: thin;
  scrollbar-color: #FF4081 #f1f1f1;
}

/* Card Styling - Edición Premium */
.result-card {
  background: linear-gradient(145deg, #FF4081, #FF6E99);
  border-radius: 20px;
  box-shadow: 
    0 10px 20px rgba(255, 64, 129, 0.2), 
    0 6px 6px rgba(0,0,0,0.1);
  width: 240px;
  min-width: 240px;
  padding: 15px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer; /* Cursor de mano para indicar clicable */
}

/* Efecto de Brillo de Cristal */
.result-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -50%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
  transform: skewX(-25deg);
  transition: 0.5s;
}

.result-card:hover::before {
  left: 100%;
}

.result-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 
    0 20px 40px rgba(255, 64, 129, 0.4),
    0 10px 10px rgba(0,0,0,0.1);
  z-index: 10;
}

/* Contenedor de Imagen */
.card-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  border: 4px solid rgba(255,255,255,0.2);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.result-card:hover .cover-image {
  transform: scale(1.15) rotate(2deg);
}

/* Información y Tipografía */
.card-info {
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
  margin: 5px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-subtitle {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

/* Botón Guapo */
.result-card .btn-guapo {
  background: #ffffff;
  color: #FF4081;
  border: none;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
}

.result-card .btn-guapo:hover {
  background: #f8f8f8;
  color: #FF4081;
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.3);
}

/* Superposición de reproducción */
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.result-card:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  font-size: 2rem;
  color: white;
}
</style>
 
 
 