import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlayerStore = defineStore('player', () => {
  const currentTrack = ref(null);
  const isPlaying = ref(false);

  const playTrack = (track) => {
    if (track && track.preview) {
      currentTrack.value = track;
      isPlaying.value = true;
    } else {
      console.warn("La canción no tiene preview disponible:", track);
      alert("Lo sentimos, esta canción no tiene vista previa disponible.");
    }
  };

  const togglePlay = () => {
    if (currentTrack.value) {
      isPlaying.value = !isPlaying.value;
    }
  };

  return {
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay
  };
});
