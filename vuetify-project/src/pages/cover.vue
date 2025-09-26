<template>
  <div class="cover-page">
    <div class="cover-content">
      <!-- Contenido superior -->
      <div class="cover-top">
        <div class="cover-title">
          SI YO DIRIJO
        </div>
        
        <div class="cover-subtitle">
          ¿Aún no sabes que tipo de líder eres?
        </div>
        
        <v-btn
          color="primary"
          size="x-large"
          variant="elevated"
          @click="goToInstructions"
          class="cover-start-btn"
        >
          Descubrelo ya
        </v-btn>
      </div>
      
      <!-- Imágenes de líderes -->
      <div class="leaders-images">
        <img src="@/assets/leader-b.png" alt="Líder B" class="leader-image" />
        <img src="@/assets/lider-e.png" alt="Líder E" class="leader-image" />
        <img src="@/assets/leader-a.png" alt="Líder A" class="leader-image" />
        <img src="@/assets/leader-c.png" alt="Líder C" class="leader-image" />
        <img src="@/assets/leader-d.png" alt="Líder D" class="leader-image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToInstructions = () => {
  router.push('/instructions')
}
</script>

<style scoped>
/* Portada */
@import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap');

.cover-page {
  position: fixed;
  width: 100%;
  height: 100vh;
  background: radial-gradient(circle at center, #381B7C 0%, #000005 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}


.cover-content {
  text-align: center;
  color: white;
  max-width: 800px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 5rem 0 0 0;
}

.cover-title {
  font-family: 'Julius Sans One', sans-serif;
  font-size: 4.5rem;
  font-weight: 400;
  line-height: 1.1;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 0.1em;
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cover-subtitle {
  font-family: 'Julius Sans One', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 3rem;
  opacity: 0.9;
  letter-spacing: 0.05em;
}

.cover-start-btn {
  font-family: 'Julius Sans One', sans-serif !important;
  font-size: 1.2rem !important;
  font-weight: 400 !important;
  padding: 1rem 3rem !important;
  border-radius: 50px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
  box-shadow: 
    0 8px 32px 0 rgba(156, 39, 176, 0.4),
    0 4px 16px 0 rgba(233, 30, 99, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 40px rgba(233, 30, 99, 0.2) !important;
  transition: all 0.3s ease !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  position: relative;
  overflow: hidden;
}

.cover-start-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.cover-start-btn:hover::before {
  left: 100%;
}

.cover-start-btn:hover {
  transform: translateY(-3px) !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 
    0 12px 40px 0 rgba(156, 39, 176, 0.5),
    0 6px 20px 0 rgba(233, 30, 99, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 60px rgba(233, 30, 99, 0.3) !important;
}

/* Contenedor superior */
.cover-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Estilos para las imágenes de líderes */
.leaders-images {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: nowrap;
  width: 100%;
  padding: 0 1rem;
}

.leader-image {
  height: 280px;
  width: auto;
  object-fit: contain;
  border-radius: 12px;
  flex-shrink: 0;
}


/* Responsive */
@media (max-width: 768px) {
  .cover-content {
    padding: 1rem 0;
  }
  
  .cover-title {
    font-size: 3rem;
  }
  
  .cover-subtitle {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  .cover-start-btn {
    font-size: 1rem !important;
    padding: 0.8rem 2rem !important;
  }
  
  .leaders-images {
    gap: 0.8rem;
  }
  
  .leader-image {
    height: 200px;
  }
}

@media (max-width: 480px) {
  .cover-content {
    padding: 0.5rem 0;
  }
  
  .cover-title {
    font-size: 2.5rem;
  }
  
  .cover-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .leaders-images {
    gap: 0.6rem;
    padding: 0 0.5rem;
  }
  
  .leader-image {
    height: 160px;
  }
}
</style>
