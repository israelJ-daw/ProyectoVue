<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-vibrant shadow-sm">
    <div class="container-fluid px-4">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <img :src="`${baseUrl}logo.png`" alt="Logo" class="logo" />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto me-4 gap-lg-3">
          <li class="nav-item">
            <router-link
              class="nav-link"
              active-class="active-link"
              to="/"
            >
              Inicio
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              active-class="active-link"
              to="/playlists"
            >
              Mis Playlists
            </router-link>
          </li>

          <li class="nav-item">
            <router-link
              class="nav-link"
              active-class="active-link"
              to="/search"
            >
              Explorar
            </router-link>
          </li>
        </ul>

        <div class="user-section">
          <template v-if="user">
            <img :src="user.avatar" alt="Avatar" class="user-avatar" />
            <span class="user-name">{{ user.name }}</span>
            <button
              @click="logout"
              class="btn btn-outline-light btn-sm"
            >
              Cerrar sesión
            </button>
          </template>

          <template v-else>
            <button
              @click="openLogin"
              class="btn btn-light btn-sm fw-semibold"
            >
              Iniciar sesión
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const baseUrl = import.meta.env.BASE_URL


const { user, isLoggedIn } = storeToRefs(userStore)

const openLogin = () => {
  router.push({ name: 'Login' })
}

const logout = () => {
  userStore.logout()
  router.push({ name: 'Home' })
}
</script>

<style scoped>
.bg-vibrant {
  background: rgba(255, 64, 129, 0.85) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.navbar {
  color: white;
}

.logo {
  width: 80px;
}

.nav-link {
  color: white !important;
  font-weight: 600;
  position: relative;
  padding: 0.5rem 0;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #FFEB3B !important;
}

.active-link {
  color: #FFEB3B !important;
}

.active-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 100%;
  height: 2px;
  background-color: #FFEB3B;
  border-radius: 2px;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.6);
}

.user-name {
  font-weight: 600;
  color: white;
  white-space: nowrap;
}

.btn {
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-outline-light:hover {
  background-color: rgba(255, 0, 0, 0.75);
  color: #fff;
}

.navbar-toggler {
  border-color: rgba(0, 0, 0, 0.2);
}
</style>
