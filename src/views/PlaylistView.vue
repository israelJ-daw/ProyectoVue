<template>
  <div class="container my-5">
    <div class="header-section mb-5 animate-fade-in">
      <h2 class="text-dark fw-bold d-flex align-items-center display-5">
        <div class="icon-box me-3 shadow-lg">
          <i class="bi bi-music-note-list text-gradient fs-2"></i>
        </div>
        Mis Playlists
      </h2>
      <p class="text-muted ms-1 mt-2">Tu colección personal de éxitos.</p>
    </div>

    <!-- Mensaje si no hay usuario -->
    <div v-if="!isLoggedIn" class="alert alert-light border-0 shadow-sm d-flex align-items-center p-4 rounded-4 animate-fade-up" role="alert">
      <div class="me-3 text-warning">
         <div class="icon-circle bg-warning-subtle text-warning">
           <i class="bi bi-lock-fill fs-4"></i>
         </div>
      </div>
      <div>
        <h5 class="alert-heading fw-bold mb-1">Acceso Restringido</h5>
        <p class="mb-0 text-muted">Inicia sesión para acceder a tu biblioteca musical.</p>
      </div>
    </div>

    <!-- Lista de canciones si hay usuario -->
    <div v-else>
      <div v-if="favorites.length > 0" class="row g-3">
        <transition-group name="list" tag="div" class="row g-3 w-100 m-0">
          <div v-for="(song, index) in favorites" :key="song.id" class="col-12">
            
            <!-- Tarjeta de Canción (Premium) -->
            <div 
              class="card border-0 shadow-sm hover-card transition-all rounded-4 overflow-hidden mb-2"
              :class="{ 'playing-active': isCurrentSong(song) }"
              :style="{ 'animation-delay': `${index * 50}ms` }"
            >
              <div class="row g-0 align-items-center bg-white p-2">
                
                <!-- Imagen del Álbum -->
                <div class="col-auto position-relative album-wrapper rounded-3">
                  <img :src="song.album.cover_medium" class="album-cover" alt="Album cover">
                  
                  <!-- Overlay de reproducción -->
                  <div class="play-overlay d-flex align-items-center justify-content-center"
                       :class="{ 'always-visible': isCurrentSong(song) }">
                     
                     <div v-if="isCurrentSong(song) && isPlaying" class="equalizer">
                       <span class="bar bar-1"></span>
                       <span class="bar bar-2"></span>
                       <span class="bar bar-3"></span>
                     </div>
                     
                     <button v-else @click="playSong(song)" class="btn btn-light rounded-circle shadow text-primary play-btn-overlay">
                      <i class="bi" :class="isCurrentSong(song) ? 'bi-pause-fill' : 'bi-play-fill'"></i>
                    </button>
                  </div>
                </div>

                <!-- Info de la Canción -->
                <div class="col">
                  <div class="card-body py-2 px-4">
                    <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                      <div class="track-info">
                        <h5 class="card-title mb-1 fw-bold text-dark text-truncate" 
                            :class="{ 'text-gradient': isCurrentSong(song) }"
                            style="max-width: 350px;">
                          {{ song.title }}
                        </h5>
                        <p class="card-text text-muted mb-0 d-flex align-items-center">
                          <i class="bi bi-person-fill me-1 small-icon"></i>{{ song.artist.name }}
                        </p>
                      </div>
                      
                      <!-- Botones de Acción -->
                      <div class="action-buttons d-flex gap-2 opacity-0-hover">
                        <button @click="playSong(song)" class="btn btn-action-primary rounded-pill px-4 fw-bold shadow-sm">
                          <i class="bi" :class="isCurrentSong(song) && isPlaying ? 'bi-pause-circle' : 'bi-play-circle'"></i> 
                          <span class="ms-2">{{ isCurrentSong(song) && isPlaying ? 'Pausar' : 'Reproducir' }}</span>
                        </button>
                        <button @click="removeFromFavorites(song.id)" class="btn btn-action-danger rounded-circle p-2 shadow-sm" title="Eliminar">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <!-- Fin Tarjeta -->

          </div>
        </transition-group>
      </div>

      <!-- Estado vacío -->
      <div v-else class="text-center py-5 animate-fade-in">
        <div class="empty-state-container mb-4 mx-auto">
           <div class="floating-icon">
             <i class="bi bi-music-note-beamed"></i>
           </div>
        </div>
        <h3 class="fw-bold text-dark mb-2">Tu colección está vacía</h3>
        <p class="text-muted mb-4 max-w-md mx-auto">Explora nuestro catálogo y guarda las canciones que te mueven.</p>
        <router-link to="/search" class="btn btn-gradient btn-lg rounded-pill shadow-lg px-5 fw-bold hover-scale">
          <i class="bi bi-search me-2"></i>Explorar Música
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFavoritesStore } from '@/stores/favorites';
import { useUiStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { usePlayerStore } from '@/stores/player';
import { storeToRefs } from 'pinia';


const userStore = useUserStore();
const favoritesStore = useFavoritesStore();
const uiStore = useUiStore();
const playerStore = usePlayerStore();


const { isLoggedIn } = storeToRefs(userStore);
const { favorites } = storeToRefs(favoritesStore);
const { currentTrack, isPlaying } = storeToRefs(playerStore);


const isCurrentSong = (song) => {
  return currentTrack.value && currentTrack.value.id === song.id;
};


const playSong = (song) => {
  if (isCurrentSong(song)) {
    playerStore.togglePlay();
  } else {
    playerStore.playTrack(song);
  }
};


const removeFromFavorites = (songId) => {
  const song = favorites.value.find(s => s.id === songId);
  if (!song) return;

  favoritesStore.removeSong(songId);
  uiStore.showModal('Eliminado', `${song.title} se ha eliminado de tus favoritos`, 'success');
};
</script>

<style scoped>
/* Animaciones de Entrada */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Transición de Lista */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Header */
.icon-box {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
}

.text-gradient {
  background: linear-gradient(45deg, #FF4081, #FF80AB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Tarjetas Premium */
.card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(0,0,0,0.04) !important;
  animation: slideIn 0.5s ease-out forwards;
  opacity: 0; /* Para la animación */
}

@keyframes slideIn {
  to { opacity: 1; transform: translateY(0); }
}

.card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 15px 35px rgba(255, 64, 129, 0.15) !important;
  border-color: rgba(255, 64, 129, 0.2) !important;
  z-index: 10;
}

.playing-active {
  border: 1px solid #FF4081 !important;
  background-color: #fff0f5 !important;
  box-shadow: 0 8px 20px rgba(255, 64, 129, 0.15) !important;
}

.playing-active .bg-white {
  background-color: #fff0f5 !important;
}

/* Imagen y Overlay */
.album-wrapper {
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.album-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.card:hover .album-cover {
  transform: scale(1.1);
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(2px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover .play-overlay,
.play-overlay.always-visible {
  opacity: 1;
}

/* Equalizer Animation */
.equalizer {
  display: flex;
  gap: 3px;
  align-items: flex-end;
  height: 20px;
}

.bar {
  width: 4px;
  background-color: #fff;
  animation: equalize 1s infinite;
}

.bar-1 { animation-delay: 0.1s; height: 60%; }
.bar-2 { animation-delay: 0.2s; height: 100%; }
.bar-3 { animation-delay: 0.3s; height: 40%; }

@keyframes equalize {
  0% { height: 20%; }
  50% { height: 100%; }
  100% { height: 20%; }
}

/* Botones y Acciones */
.action-buttons {
  opacity: 0.4; /* Sutil por defecto */
  transition: opacity 0.3s;
}

.card:hover .action-buttons,
.playing-active .action-buttons {
  opacity: 1;
}

.btn-action-primary {
  background: linear-gradient(45deg, #FF4081, #F50057);
  color: white;
  border: none;
  font-size: 0.9rem;
  transition: transform 0.2s;
}

.btn-action-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(245, 0, 87, 0.4);
}

.btn-action-danger {
  background: white;
  color: #dc3545;
  border: 1px solid #ffebee;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-action-danger:hover {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
}

/* Empty State */
.btn-gradient {
  background: linear-gradient(45deg, #FF4081, #FF9100);
  color: white;
  border: none;
}

.floating-icon {
  font-size: 4rem;
  background: linear-gradient(135deg, #e0f7fa, #fff);
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FF4081;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.hover-scale:hover {
  transform: scale(1.05);
}

.max-w-md {
  max-width: 450px;
}
</style>
