<template>
  <v-app class="app-container">
    <!-- Icono de sonido global -->
    <div class="global-sound-icon-container">
      <v-btn
        icon
        variant="text"
        size="large"
        @click="toggleSound"
        class="global-sound-btn"
      >
        <v-icon :icon="isPlaying ? 'mdi-volume-high' : 'mdi-volume-off'" />
      </v-btn>
    </div>
    
    <v-main class="main-container">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { useAudio } from '@/composables/useAudio'

// Usar el composable de audio global
const { isPlaying, toggleSound } = useAudio()
</script>

<style>
/* Fondo con gradiente radial para toda la aplicación */
.v-theme--light .app-container {
  background: radial-gradient(circle at center, #381B7C 0%, #000005 100%);
  background-attachment: fixed;
  min-height: 100vh;
}

.v-theme--dark .app-container {
  background: radial-gradient(circle at center, #381B7C 0%, #000005 100%);
  background-attachment: fixed;
  min-height: 100vh;
}

.main-container {
  background: transparent;
  min-height: 100vh;
}

/* Icono de sonido global */
.global-sound-icon-container {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 1000;
}

.global-sound-btn {
  color: rgba(255, 255, 255, 0.7) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 50% !important;
  transition: all 0.3s ease !important;
}

.global-sound-btn:hover {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  transform: scale(1.1);
}

/* Responsive para el icono global */
@media (max-width: 768px) {
  .global-sound-icon-container {
    top: 1.5rem;
    right: 1.5rem;
  }
}

@media (max-width: 480px) {
  .global-sound-icon-container {
    top: 1rem;
    right: 1rem;
  }
}

/* Estilos del navbar removidos - ya no se necesitan */
</style>
