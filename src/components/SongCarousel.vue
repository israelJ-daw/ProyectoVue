<template>
  <div class="playlist-container">
    <div class="playlist-header">
      <h2>{{ title }}</h2>
      <span class="song-count">{{ validItems.length }} canciones</span>
    </div>
    
    <div class="playlist-list">
      <div
        v-for="(item, index) in validItems"
        :key="item.id"
        class="playlist-row"
        @click="playSong(item)"
      >
        <div class="track-number">{{ index + 1 }}</div>
        
        <div class="track-info">
          <div class="track-image-container">
            <img
              :src="item.picture_medium || (item.album?.cover_medium) || '/default-song.jpg'"
              :alt="item.title || item.name"
              class="track-image"
            />
            <div class="play-overlay">
              <span class="play-icon">▶</span>
            </div>
          </div>
          
          <div class="track-text">
            <h3 class="track-title">{{ item.title || item.name }}</h3>
            <p class="track-artist">{{ item.artist?.name || 'Artista Desconocido' }}</p>
          </div>

          <div class="acciones">
            <button class="btn-guapo" title="Añadir a Playlist" @click.stop="addToPlaylist(item)">
              Añadir a Playlist
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { usePlayerStore } from "@/stores/player";
import { useFavoritesStore } from "@/stores/favorites";
import { useUiStore } from "@/stores/ui";
import { useUserStore } from "@/stores/user";

const props = defineProps(["title", "items"]);

const playerStore = usePlayerStore();
const favoritesStore = useFavoritesStore();
const uiStore = useUiStore();

const validItems = computed(() => {
  if (!props.items) return [];
  return props.items.filter(
    (item) => item.picture_medium || item.album?.cover_medium || item.title
  );
});

const playSong = (item) => {
  playerStore.playTrack(item);
};

const userStore = useUserStore();

const addToPlaylist = (item) => {
  if (!userStore.isLoggedIn) {
    uiStore.showModal(
      "¡Inicia Sesión!", 
      "Para crear tu colección de música perfecta, necesitas una cuenta. Regístrate o inicia sesión para continuar.", 
      "warning"
    );
    return;
  }

  favoritesStore.addSong({
    id: item.id,
    title: item.title || item.name,
    artist: item.artist,
    album: item.album || { cover_medium: item.picture_medium },
    preview: item.preview,
    link: item.link
  });
  uiStore.showModal('¡Añadido!', `${item.title || item.name} se agregó a tu playlist`, 'success');
};
</script>

<style scoped>
.playlist-container {
  max-width: 900px;
  margin: 30px auto;
  padding: 24px;
  background: linear-gradient(145deg, #ffffff, #f0f2f5);
  border-radius: 20px;
  box-shadow: 
    0 10px 30px rgba(0,0,0,0.05),
    0 1px 3px rgba(0,0,0,0.03);
}

.playlist-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(0,0,0,0.03);
}

.playlist-header h2 {
  font-size: 1.8rem;
  color: #FF4081;
  font-weight: 700;
  margin: 0;
}

.song-count {
  color: #888;
  font-size: 0.9rem;
  font-weight: 500;
}

.playlist-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.playlist-row {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 12px;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;
}

.playlist-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
  border-color: rgba(0,0,0,0.02);
  background: #f8f9fa;
}

.track-number {
  width: 30px;
  color: #999;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  margin-right: 16px;
}

.track-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.track-image-container {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.track-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.playlist-row:hover .track-image {
  transform: scale(1.1);
}

.track-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.track-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 4px;
}

.track-artist {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

/* Efectos de superposición de reproducción al pasar el mouse */
.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.playlist-row:hover .play-overlay {
  opacity: 1;
}

.play-icon {
  color: white;
  font-size: 1.2rem;
}

/* Acciones y Botón Playlist */
.acciones {
  margin-left: auto;
  padding-left: 16px;
}
/* Estilos del botón movidos a base.css bajo la clase .btn-guapo */
</style>



