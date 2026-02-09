<template>
  <div v-if="items && items.length > 0" class="my-5">
    <h2 class="text-center mb-4 fw-bold text-uppercase" style="color: #FF4081;">{{ title }}</h2>
    
    <div id="artistBootstrapCarousel" class="carousel slide shadow rounded-4 overflow-hidden" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button 
          v-for="(item, index) in items" 
          :key="'indicator-' + item.id"
          type="button" 
          data-bs-target="#artistBootstrapCarousel" 
          :data-bs-slide-to="index" 
          :class="{ active: index === 0 }" 
          :aria-current="index === 0 ? 'true' : undefined"
          :aria-label="'Slide ' + (index + 1)"
        ></button>
      </div>

      <div class="carousel-inner">
        <div 
          v-for="(item, index) in items" 
          :key="item.id" 
          class="carousel-item" 
          :class="{ active: index === 0 }"
        >
          <div class="artist-slide-container">
            <img 
              :src="item.picture_xl || item.picture_big || item.picture_medium" 
              class="d-block w-100 h-100 artist-img" 
              :alt="item.name"
              @click="goToArtist(item.id)"
              style="object-fit: cover; object-position: center 20%; filter: brightness(0.6);"
            >
          </div>
          
          <div class="carousel-caption d-none d-md-block">
            <h3 class="display-4 fw-bold text-white">{{ item.name }}</h3>
            <p class="fs-5 text-light" v-if="item.nb_fan">
              {{ formatFans(item.nb_fan) }} Fans
            </p>
            <button 
              class="btn btn-lg btn-danger rounded-pill mt-2 px-4" 
              style="background-color: #FF4081; border: none;"
              @click="goToArtist(item.id)"
            >
              Ver Artista
            </button>
          </div>
        </div>
      </div>

      <button class="carousel-control-prev" type="button" data-bs-target="#artistBootstrapCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#artistBootstrapCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

defineProps({
  title: String,
  items: Array
});

const router = useRouter();

const formatFans = (num) => {
  return new Intl.NumberFormat('es-ES', { notation: "compact", compactDisplay: "short" }).format(num);
};

const goToArtist = (id) => {
  router.push(`/artist/${id}`);
};
</script>

<style scoped>
.artist-slide-container {
  height: 500px;
  position: relative;
  background-color: #000;
}

.artist-img {
  cursor: pointer;
  
}

.artist-img:hover {
  filter: brightness(0.8) !important;
  transition: filter 0.3s ease;
}

@media (max-width: 768px) {
  .artist-slide-container {
    height: 300px; 
  }
}

.carousel-indicators button {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 5px;
}

.carousel-caption {
  bottom: 20%;
}
</style>