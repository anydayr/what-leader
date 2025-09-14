<template>
  <div class="welcome-page">

      
       
        <button @click="startTest" class="start-button">
          Comenzar Test
        </button>
 
    
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  startTest: []
}>()

const startTest = () => {
  emit('startTest')
}
</script>

<style scoped>
.welcome-page {
  min-height: 100vh;
  width: 100%;
 
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow-x: hidden;
  box-sizing: border-box;
}

.welcome-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.welcome-container {
  width: 100%;
  max-width: 100%;
  background: transparent;
  text-align: center;
  position: relative;
  z-index: 1;
  animation: slideUp 0.8s ease-out;
  padding: 40px 20px;
  box-sizing: border-box;
  overflow-x: hidden;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-content {
  padding: 40px 20px;
  text-align: center;
}

.welcome-title {
  color: white;
  font-size: 4rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  line-height: 1.2;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 0 60px 0;
  font-style: italic;

}

.start-button {
  background: linear-gradient(135deg, #ffffff, #f5f5f5);
  color: #1565c0;
  border: 3px solid white;
  padding: 20px 60px;
  border-radius: 15px;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 40px;
  text-shadow: none;
}

.start-button:hover {
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0);
  transform: translateY(-4px);

  color: #0d47a1;
}

.start-button:active {
  transform: translateY(-1px);
}


@media (max-width: 768px) {
  .welcome-page {
    padding: 0;
  }
  
  .welcome-container {
    padding: 20px 15px;
  }
  
  .welcome-content {
    padding: 20px 10px;
  }
  
  .welcome-title {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 2rem;
    margin-bottom: 40px;
  }
  
  .start-button {
    padding: 18px 50px;
    font-size: 1.3rem;
  }
}
</style>
