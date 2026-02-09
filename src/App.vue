<template>
  <div id="app">
    <Navbar />
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <MusicPlayer />
    <CustomModal />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import MusicPlayer from "@/components/MusicPlayer.vue";
import CustomModal from "@/components/CustomModal.vue";
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

onMounted(() => {
  userStore.initialize();
});
</script>

<style>
/* Reset & Base */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Outfit', sans-serif;
  background-color: #f8f9fa;
  color: #2c3e50;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Fondo Animado Global (Mesh Gradient Sutil) */
body {
  background: 
    radial-gradient(at 0% 0%, hsla(340,82%,76%,0.1) 0px, transparent 50%),
    radial-gradient(at 50% 100%, hsla(22,100%,77%,0.1) 0px, transparent 50%),
    radial-gradient(at 100% 0%, hsla(240,100%,70%,0.05) 0px, transparent 50%);
  background-attachment: fixed; /* Mantiene el fondo fijo al hacer scroll */
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* Add padding to bottom so content isn't hidden by fixed player */
  padding-bottom: 90px; 
}

.app-main {
  flex: 1; 
  position: relative; /* Necesario para transiciones absolutas si se quisieran */
}

/* Transiciones de Página */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Scrollbar Personalizado (Webkit) */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(0,0,0,0.02); 
}

::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.15); 
  border-radius: 10px;
  border: 2px solid rgba(0,0,0,0.02); /* Padding effect */
  background-clip: padding-box;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 64, 129, 0.5); 
}

/* Estilos de Selección de Texto */
::selection {
  background: rgba(255, 64, 129, 0.2);
  color: #FF4081;
}

/* Bootstrap Overrides Globales */
h1, h2, h3, h4, h5, h6 {
  font-weight: 700 !important;
  letter-spacing: -0.5px;
}

.btn {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  letter-spacing: 0.3px;
}
</style>

