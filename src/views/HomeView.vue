<template>
  <div class="home-view">
    <!-- Sección de bienvenida con mensaje destacado -->
    <section class="welcome-section">
      <h1>¡Bienvenido a Deezer Music!</h1>
      <p>
        Disfruta de la música más actual, desde tus artistas favoritos hasta las canciones que marcan tendencia. 
        Explora, descubre y déjate llevar por el ritmo.
      </p>
    </section>

    <!-- Sección de artistas destacados -->
    <section class="featured-artists">
      <h2>🎤 Artistas Destacados</h2>
      <p>Sumérgete en las últimas estrellas que están dominando las listas de éxitos. ¡Conoce a los artistas más escuchados del momento!</p>
      <CarouselArtists title="Artistas Destacados" :items="artists" />
    </section>

    <!-- Sección de canciones destacadas -->
    <section class="featured-songs">
      <h2>🎵 Canciones Destacadas</h2>
      <p>Las canciones más populares y recomendadas por nuestros expertos. ¡No te pierdas los hits que todos están escuchando!</p>
      <SongCarousel title="Canciones Destacadas" :items="songs" />
    </section>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { fetchFeaturedData } from "@/api/apiFuncional.js";
import SongCarousel from "@/components/SongCarousel.vue";
import CarouselArtists from "@/components/CarouselArtists.vue";

export default {
  components: { SongCarousel, CarouselArtists },
  setup() {
    const artists = ref([]);
    const songs = ref([]);

    const loadData = async () => {
      const { artists: fetchedArtists, songs: fetchedSongs } = await fetchFeaturedData();
      artists.value = fetchedArtists;
      songs.value = fetchedSongs;
    };

    onMounted(loadData);

    return { artists, songs };
  },
};
</script>

<style scoped>
.home-view {
  padding: 40px 20px;
  text-align: center;
  /* background-color: #f0f0f0; REMOVED */
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-section h1 {
  font-size: 2.5rem;
  color: #FF4081;
  font-weight: bold;
}

.welcome-section p {
  font-size: 1.1rem;
  color: #555;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.featured-artists,
.featured-songs {
  margin-top: 40px;
  margin-bottom: 40px;
}

.featured-artists h2,
.featured-songs h2 {
  font-size: 2rem;
  color: #FF4081;
  margin-bottom: 10px;
}

.featured-artists p,
.featured-songs p {
  font-size: 1rem;
  color: #333;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .welcome-section h1 {
    font-size: 2rem;
  }
  
  .welcome-section p {
    font-size: 1rem;
  }
}
</style>
