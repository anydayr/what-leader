<template>
  <v-app class="app-container">
    <v-app-bar class="glassmorphism-bar" elevation="0" height="70">
      <v-app-bar-title class="font-weight-bold text-white">
        <v-icon class="mr-2" color="white">mdi-account-group</v-icon>
        Test de Liderazgo
      </v-app-bar-title>
    </v-app-bar>

    <v-main class="main-container">
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
// Componente simplificado sin cambio de tema
</script>

<style>
/* Fondo rosa para toda la aplicación */
.v-theme--light .app-container {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fad0c4 100%);
  background-attachment: fixed;
  min-height: 100vh;
}

.v-theme--dark .app-container {
  background: #000000;
  background-attachment: fixed;
  min-height: 100vh;
}

.main-container {
  background: transparent;
  min-height: calc(100vh - 70px);
}

/* Glassmorphism para la barra de navegación - Rosa */
.glassmorphism-bar {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 182, 193, 0.3);
  box-shadow: 0 8px 32px 0 rgba(233, 30, 99, 0.2);
}

.v-theme--dark .glassmorphism-bar {
  background: rgba(233, 30, 99, 0.15) !important;
  border-bottom: 1px solid rgba(233, 30, 99, 0.3);
  box-shadow: 0 8px 32px 0 rgba(233, 30, 99, 0.2);
}

/* Botón con efecto glassmorphism - Rosa */
.glassmorphism-btn {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 182, 193, 0.3);
  border-radius: 12px !important;
  transition: all 0.3s ease;
}

.glassmorphism-btn:hover {
  background: rgba(255, 192, 203, 0.2) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(233, 30, 99, 0.2);
  border: 1px solid rgba(255, 64, 129, 0.4);
}

.v-theme--dark .glassmorphism-btn {
  background: rgba(233, 30, 99, 0.1) !important;
  border: 1px solid rgba(233, 30, 99, 0.3);
}

.v-theme--dark .glassmorphism-btn:hover {
  background: rgba(233, 30, 99, 0.2) !important;
  box-shadow: 0 8px 25px rgba(233, 30, 99, 0.3);
  border: 1px solid rgba(233, 30, 99, 0.5);
}

/* Estilos del botón de tema removidos - ya no se necesitan */
</style>
