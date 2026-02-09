import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import PlaylistsView from '../views/PlaylistView.vue';
import SearchView from '../views/SearchView.vue';
import LoginView from '../views/LoginView.vue';
import InfoView from '../views/InfoView.vue';
import ArtistView from '../views/ArtistView.vue';

import AlbumView from '../views/AlbumView.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/playlists',
    name: 'Playlists',
    component: PlaylistsView,
  },
  {
    path: '/search',
    name: 'Buscador',
    component: SearchView,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/song/:songId',
    name: 'Info',
    component: InfoView,
  },
  {
    path: '/artist/:id',
    name: 'Artist',
    component: ArtistView,
  },
  {
    path: '/album/:id',
    name: 'Album',
    component: AlbumView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
