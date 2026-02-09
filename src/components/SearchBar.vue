<template>
  <div class="search-bar-container">
    <div class="search-input-wrapper">
      <span class="search-icon">
        <!-- SVG Search Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </span>
      <input
        type="text"
        v-model="query"
        placeholder="¿Qué quieres escuchar hoy?"
        class="search-input"
        @input="onSearch"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <button v-if="query" @click="clearSearch" class="clear-btn" title="Borrar búsqueda">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search']);

const query = ref('');
const isFocused = ref(false);

let debounceTimeout = null;

const onSearch = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    emit('search', query.value);
  }, 500);
};

const clearSearch = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  query.value = '';
  emit('search', '');
};
</script>

<style scoped>
.search-bar-container {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0 15px;
  margin-bottom: 30px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px; /* Wider layout as requested */
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.search-input {
  width: 100%;
  padding: 16px 50px 16px 55px; /* Space for icons */
  font-size: 1.1rem;
  border: 2px solid transparent;
  border-radius: 50px; /* Modern pill shape */
  background-color: #ffffff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); /* Subtle scalable shadow */
  transition: all 0.3s ease;
  color: #333;
}

.search-input::placeholder {
  color: #aaa;
  font-weight: 400;
}

/* Focus State */
.search-input:focus {
  outline: none;
  border-color: #FF4081; /* Brand color border */
  box-shadow: 0 8px 25px rgba(255, 64, 129, 0.15); /* Elegant glow */
  background-color: #fff;
}

/* Icons */
.search-icon {
  position: absolute;
  left: 20px;
  color: #FF4081;
  pointer-events: none;
  display: flex;
  align-items: center;
}

.clear-btn {
  position: absolute;
  right: 15px;
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background-color: #f0f0f0;
  color: #FF4081;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .search-input {
    padding: 14px 40px 14px 45px;
    font-size: 1rem;
  }
}
</style>
