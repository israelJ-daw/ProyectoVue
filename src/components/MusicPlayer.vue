<template>
  <div v-if="currentTrack" class="music-player-bar">
    <div class="player-content">
      <!-- Información de la Pista -->
      <div class="track-info">
        <img :src="currentTrack.album?.cover_medium || currentTrack.album?.cover" alt="Cover" class="cover-thumb shadow-sm" />
        <div class="track-details">
          <span class="track-title text-dark">{{ currentTrack.title }}</span>
          <span class="track-artist text-muted">{{ currentTrack.artist?.name }}</span>
        </div>
      </div>

      <!-- Controles Centrales -->
      <div class="player-controls">
        <button class="control-btn shadow-sm" @click="togglePlay">
          <i :class="isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'"></i>
        </button>
      </div>

      <!-- Progreso -->
      <div class="progress-container">
        <span class="time text-muted">{{ formatTime(currentTime) }}</span>
        <input
          type="range"
          :value="progress"
          @input="seek"
          min="0"
          max="100"
          class="progress-slider"
        />
        <span class="time text-muted">{{ formatTime(duration) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { usePlayerStore } from "@/stores/player";
import { storeToRefs } from "pinia";

const playerStore = usePlayerStore();
const { currentTrack, isPlaying } = storeToRefs(playerStore);
const { togglePlay } = playerStore;

const audio = new Audio();
const currentTime = ref(0);
const duration = ref(30);
const progress = ref(0);

// Observar cambios de pista
watch(currentTrack, (newTrack) => {
  if (newTrack && newTrack.preview) {
    audio.src = newTrack.preview;
    audio.play()
      .then(() => { isPlaying.value = true; })
      .catch(e => console.error("Error playing:", e));
  }
});

// Observar cambios de estado de reproducción/pausa desde el store
watch(isPlaying, (playing) => {
  if (playing) {
    audio.play();
  } else {
    audio.pause();
  }
});

const updateProgress = () => {
  currentTime.value = audio.currentTime;
  progress.value = (audio.currentTime / duration.value) * 100;
};

const seek = (event) => {
  const newTime = (event.target.value / 100) * duration.value;
  audio.currentTime = newTime;
  currentTime.value = newTime;
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

onMounted(() => {
  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => {
    isPlaying.value = false;
    progress.value = 0;
  });
});

onUnmounted(() => {
  audio.pause();
  audio.removeEventListener("timeupdate", updateProgress);
  audio.src = "";
});
</script>

<style scoped>
.music-player-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.85); /* Fondo blanco translúcido */
  backdrop-filter: blur(12px); /* Efecto Glassmorphism */
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 12px 24px;
  z-index: 1050;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.08); /* Sombra suave */
  transition: all 0.3s ease;
}

.player-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.track-info {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 250px;
}

.cover-thumb {
  width: 56px;
  height: 56px;
  border-radius: 12px; /* Más redondeado */
  object-fit: cover;
  border: 1px solid rgba(0,0,0,0.05);
}

.track-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.track-title {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #212529;
}

.track-artist {
  font-size: 0.8rem;
  color: #6c757d;
}

.control-btn {
  background: linear-gradient(135deg, #FF4081, #F50057); /* Gradiente vibrante */
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Efecto rebote */
}

.control-btn:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 4px 15px rgba(245, 0, 87, 0.4);
}

.control-btn:active {
  transform: scale(0.95);
}

.progress-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-slider {
  flex: 1;
  height: 6px;
  cursor: pointer;
  accent-color: #FF4081; /* Color del slider */
  border-radius: 4px;
  background: rgba(0,0,0,0.1);
  appearance: none; /* Resetear estilos por defecto */
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #FF4081;
  cursor: pointer;
  transition: transform 0.1s;
}

.progress-slider::-webkit-slider-thumb:hover {
  transform: scale(1.3);
}

.time {
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 35px;
  text-align: center;
}

@media (max-width: 768px) {
  .player-content {
    flex-direction: column;
    gap: 12px;
    padding-bottom: 5px;
  }
  .track-info {
    width: 100%;
    margin-bottom: 5px;
  }
  .progress-container {
    width: 100%;
  }
  .music-player-bar {
    padding: 12px 16px;
    border-radius: 20px 20px 0 0; /* Bordes redondeados arriba en móvil */
  }
}
</style>

  