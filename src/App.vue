<script setup lang="ts">
import { ref } from 'vue'
import WelcomePage from './components/WelcomePage.vue'
import LeadershipTest from './components/LeadershipTest.vue'

const showTest = ref(false)

const startTest = () => {
  showTest.value = true
}

const backToWelcome = () => {
  showTest.value = false
}
</script>

<template>
  <div id="app">
    <WelcomePage v-if="!showTest" @start-test="startTest" />
    <LeadershipTest v-else @back-to-welcome="backToWelcome" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
}
</style>
