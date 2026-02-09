import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', {
  state: () => {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    return {
      favorites: user ? JSON.parse(localStorage.getItem(`favorites_${user.name}`)) || [] : [],
    };
  },
  actions: {
    addSong(song) {
      if (!this.favorites.find(fav => fav.id === song.id)) {
        this.favorites.push(song);
        this.saveFavorites();
      }
    },
    removeSong(songId) {
      this.favorites = this.favorites.filter(fav => fav.id !== songId);
      this.saveFavorites();
    },
    saveFavorites() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        localStorage.setItem(`favorites_${user.name}`, JSON.stringify(this.favorites));
      }
    }
  }
});
