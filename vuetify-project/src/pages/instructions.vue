<template>
  <div class="instructions-page">
    <!-- Botón de regreso -->
    <div class="back-button-container">
      <v-btn
        icon
        variant="text"
        size="large"
        @click="goToCover"
        class="back-btn"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </div>

    <div class="instructions-content">
      <!-- Header -->
      <div class="instructions-header">
        <h1 class="instructions-title">ESCENARIOS</h1>
        <p class="instructions-subtitle">Selecciona un escenario para comenzar el test</p>
      </div>

      <!-- Grid de tarjetas de escenarios -->
      <div class="scenarios-grid">
        <div 
          v-for="(scenario, index) in scenarios" 
          :key="index"
          class="scenario-card"
          @click="selectScenario(scenario)"
        >
          <div class="scenario-image-container">
            <img 
              :src="scenario.image" 
              :alt="scenario.name"
              class="scenario-image"
            />
          </div>
          <div class="scenario-info">
            <h3 class="scenario-name">{{ scenario.name }}</h3>
            <p class="scenario-description">{{ scenario.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawer de información del caso -->
    <v-navigation-drawer
      v-model="drawer"
      location="right"
      width="500"
      temporary
      class="case-drawer"
    >
      <div class="drawer-content">
        <!-- Header del drawer -->
        <div class="drawer-header">
          <v-btn
            icon
            variant="text"
            @click="closeDrawer"
            class="close-btn"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <h2 class="drawer-title">{{ selectedScenario?.name }}</h2>
        </div>

        <!-- Contenido del caso -->
        <div v-if="selectedScenario" class="case-details">
          <!-- Imagen del caso -->
            <div class="case-image-container">
              <div class="time-chip">
                <v-icon class="time-icon">mdi-clock-outline</v-icon>
                <span class="time-text">{{ selectedScenario.estimatedTime }}</span>
              </div>
              <img 
                :src="selectedScenario.image" 
                :alt="selectedScenario.name"
                class="case-image"
              />
              <v-btn
                icon
                @click="openCluesModal"
                class="clues-loupe-btn"
              >
                <v-icon class="clues-loupe-icon">mdi-magnify</v-icon>
              </v-btn>
            </div>

          <!-- Información detallada -->
          <div class="case-info">
            <h3 class="case-subtitle">Descripción del Caso</h3>
            <p class="case-description">{{ selectedScenario.detailedDescription }}</p>

            <h3 class="case-subtitle">Objetivos de Investigación</h3>
            <ul class="case-objectives">
              <li v-for="objective in selectedScenario.objectives" :key="objective">
                {{ objective }}
              </li>
            </ul>

            <h3 class="case-subtitle">Equipo de Investigación</h3>
            <div class="team-slider-wrapper" v-if="selectedScenario.id === 1">
              <Splide
                :options="splideOptions"
                class="team-slider"
              >
                <SplideSlide 
                  v-for="member in teamMembers" 
                  :key="member.id"
                  class="avatar-slide"
                >
                  <div 
                    class="avatar-container"
                    @click="openMemberModal(member)"
                  >
                    <div class="avatar-image">
                      <img 
                        :src="member.avatar" 
                        :alt="member.name"
                        class="avatar-img"
                      />
                      <div class="avatar-overlay">
                        <v-icon class="info-icon">mdi-information</v-icon>
                      </div>
                    </div>
                    <h4 class="avatar-name">{{ member.name }}</h4>
                  </div>
                </SplideSlide>
              </Splide>
            </div>


          </div>

          <!-- Botón para comenzar -->
          <div class="drawer-actions">
            <v-btn
              color="primary"
              size="large"
              variant="elevated"
              @click="startInvestigation"
              class="start-btn"
              block
            >
              Comenzar Investigación
            </v-btn>
          </div>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Modal de información del miembro del equipo -->
    <v-dialog v-model="memberModal" max-width="500" class="member-modal">
      <v-card class="member-modal-card" v-if="selectedMember">
        <div class="modal-header">
          <div class="member-photo-container">
            <img 
              :src="selectedMember.avatar" 
              :alt="selectedMember.name"
              class="member-photo"
            />
          </div>
          <h2 class="modal-title">{{ selectedMember.name }}</h2>
          <v-btn
            icon
            variant="text"
            @click="closeMemberModal"
            class="modal-close-btn"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="modal-content">
          <div class="member-details">
            <h3 class="detail-title">Descripción</h3>
            <p class="detail-text">{{ selectedMember.description }}</p>

            <h3 class="detail-title">Fortalezas</h3>
            <ul class="detail-list">
              <li v-for="strength in selectedMember.strengths" :key="strength">
                {{ strength }}
              </li>
            </ul>

            <h3 class="detail-title">Debilidades</h3>
            <ul class="detail-list">
              <li v-for="weakness in selectedMember.weaknesses" :key="weakness">
                {{ weakness }}
              </li>
            </ul>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Modal de Pistas -->
    <v-dialog v-model="cluesModal" max-width="600px" persistent>
      <v-card class="clues-modal-card">
        <div class="modal-header">
          <h2 class="modal-title">
            <v-icon class="modal-title-icon">mdi-magnify</v-icon>
            Pistas Disponibles
          </h2>
          <v-btn
            icon
            variant="text"
            @click="closeCluesModal"
            class="modal-close-btn"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="modal-content">
          <div class="clues-list" v-if="selectedScenario">
            <div 
              v-for="(clue, index) in selectedScenario.clues" 
              :key="index"
              class="clue-modal-item"
            >
              <div class="clue-number">{{ index + 1 }}</div>
              <div class="clue-content">
                <p class="clue-text">{{ clue }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <v-btn
            variant="outlined"
            @click="closeCluesModal"
            class="close-clues-btn"
          >
            Cerrar
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { Splide, SplideSlide } from '@splidejs/vue-splide'
import '@splidejs/vue-splide/css'

interface Scenario {
  id: number
  name: string
  description: string
  image: string
  detailedDescription: string
  objectives: string[]
  clues: string[]
  estimatedTime: string
}

interface TeamMember {
  id: number
  name: string
  avatar: string
  description: string
  strengths: string[]
  weaknesses: string[]
}

const router = useRouter()
const drawer = ref(false)
const selectedScenario = ref<Scenario | null>(null)
const memberModal = ref(false)
const selectedMember = ref<TeamMember | null>(null)
const cluesModal = ref(false)

// Opciones de Splide
const splideOptions = {
  type: 'slide',
  perPage: 3,
  perMove: 1,
  gap: '1rem',
  arrows: true,
  pagination: false,
  drag: 'free',
  snap: true,
  focus: 'center',
  breakpoints: {
    768: {
      perPage: 3,
      gap: '0.8rem',
      arrows: false
    },
    480: {
      perPage: 2,
      gap: '0.6rem',
      arrows: false
    }
  }
}

// Casos misteriosos para investigadores
const scenarios = [
  {
    id: 1,
    name: 'El Incendio Sospechoso en la Fábrica',
    description: 'Investiga las causas de un incendio que parece no ser accidental',
    image: '/src/assets/farmaceutica.png',
    detailedDescription: 'Un incendio devastador ha arrasado la fábrica textil "Industrias del Norte" en las primeras horas de la madrugada. Aunque inicialmente se pensó en un accidente, varios indicios sugieren que podría tratarse de un incendio premeditado. Como investigador experto, debes determinar si fue un accidente o un acto criminal.',
    objectives: [
      'Determinar la causa exacta del incendio',
      'Identificar posibles responsables',
      'Analizar evidencias forenses',
      'Evaluar testimonios de testigos'
    ],
    clues: [
      'Restos de líquido inflamable encontrados',
      'Testimonio del vigilante nocturno',
      'Registros de acceso al edificio',
      'Historial de disputas laborales'
    ],
    estimatedTime: '45-60 minutos'
  },
  {
    id: 2,
    name: 'El Misterio del Manuscrito Perdido',
    description: 'Descubre el paradero de un manuscrito histórico desaparecido',
    image: '/src/assets/manuscrito.png',
    detailedDescription: 'El manuscrito original de "Las Crónicas del Rey Arturo" ha desaparecido misteriosamente de la Biblioteca Nacional. Este documento de valor incalculable fue escrito en el siglo XII y es considerado una pieza fundamental de la literatura medieval.',
    objectives: [
      'Localizar el paradero del manuscrito',
      'Identificar al responsable del robo',
      'Recuperar el documento intacto',
      'Prevenir futuros robos'
    ],
    clues: [
      'Sistema de seguridad comprometido',
      'Testimonio del bibliotecario',
      'Huellas dactilares en la vitrina',
      'Movimientos sospechosos en cámaras'
    ],
    estimatedTime: '30-45 minutos'
  },
  {
    id: 3,
    name: 'La Conspiración en el Ayuntamiento',
    description: 'Desentraña una red de corrupción en la administración pública',
    image: '/src/assets/conspiracion.png',
    detailedDescription: 'Una investigación periodística ha revelado posibles actos de corrupción en el ayuntamiento de la ciudad. Se sospecha de desvío de fondos públicos y tráfico de influencias en contratos municipales.',
    objectives: [
      'Verificar las acusaciones de corrupción',
      'Identificar a los involucrados',
      'Recopilar evidencia documental',
      'Presentar un caso sólido'
    ],
    clues: [
      'Documentos financieros sospechosos',
      'Testimonios de empleados municipales',
      'Registros de llamadas telefónicas',
      'Transferencias bancarias irregulares'
    ],
    estimatedTime: '60-75 minutos'
  },
  {
    id: 5,
    name: 'El Asesinato en el Teatro',
    description: 'Investiga un crimen en el escenario del teatro municipal',
    image: '/src/assets/teatro.png',
    detailedDescription: 'Durante una representación de "Hamlet", el actor principal ha sido encontrado muerto en su camerino. La policía sospecha que no fue un accidente, sino un asesinato premeditado.',
    objectives: [
      'Determinar la causa de la muerte',
      'Identificar al asesino',
      'Establecer el motivo del crimen',
      'Recopilar evidencia forense'
    ],
    clues: [
      'Análisis toxicológico pendiente',
      'Testimonios del elenco',
      'Acceso restringido al camerino',
      'Historial de enemistades'
    ],
    estimatedTime: '55-70 minutos'
  }
]

// Equipo de investigación para el caso de incendio
const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Inspector de Incendios',
    avatar: new URL('@/assets/Inspector-de-incendios.png', import.meta.url).href,
    description: 'Experto en análisis de incendios con más de 15 años de experiencia. Especializado en determinar causas y patrones en escenas de fuego.',
    strengths: [
      'Análisis meticuloso de evidencias',
      'Identificación de patrones de combustión',
      'Experiencia en reconstrucción de eventos',
      'Conocimiento profundo de materiales inflamables'
    ],
    weaknesses: [
      'Puede ser excesivamente crítico consigo mismo',
      'Tiende a sobreanalizar situaciones simples',
      'A veces duda de sus propias conclusiones'
    ]
  },
  {
    id: 2,
    name: 'Analista Forense',
    avatar: new URL('@/assets/forense.png', import.meta.url).href,
    description: 'Profesional especializado en análisis de evidencias físicas y químicas. Metódico y preciso en sus investigaciones.',
    strengths: [
      'Documentación exhaustiva de evidencias',
      'Análisis químico preciso',
      'Interpretación de resultados de laboratorio',
      'Presentación clara de hallazgos'
    ],
    weaknesses: [
      'Puede tomar más tiempo del necesario',
      'A veces es demasiado perfeccionista',
      'Se enfoca demasiado en detalles menores'
    ]
  },
  {
    id: 3,
    name: 'Técnico de Seguridad',
    avatar: new URL('@/assets/tecnico-de-seguridad.png', import.meta.url).href,
    description: 'Especialista en sistemas de seguridad y prevención. Enfoque creativo para resolver problemas complejos.',
    strengths: [
      'Soluciones innovadoras a problemas técnicos',
      'Conocimiento de sistemas de seguridad',
      'Adaptabilidad a situaciones cambiantes',
      'Trabajo en equipo eficiente'
    ],
    weaknesses: [
      'Puede ser indeciso bajo presión',
      'A veces necesita más tiempo para decisiones',
      'Tiende a considerar demasiadas opciones'
    ]
  },
  {
    id: 4,
    name: 'Detective Criminal',
    avatar: new URL('@/assets/detective.png', import.meta.url).href,
    description: 'Investigador experimentado con habilidades excepcionales para obtener información y confianza de testigos.',
    strengths: [
      'Habilidades de interrogatorio avanzadas',
      'Lectura de lenguaje corporal',
      'Construcción de relaciones de confianza',
      'Persuasión y carisma natural'
    ],
    weaknesses: [
      'Puede distraerse con nuevas ideas',
      'A veces pierde el foco en detalles importantes',
      'Tiende a seguir pistas secundarias'
    ]
  },
  {
    id: 5,
    name: 'Historiador Local',
    avatar: new URL('@/assets/historiador-local.png', import.meta.url).href,
    description: 'Conocedor profundo de la historia local y las relaciones comunitarias. Conecta fácilmente con las personas.',
    strengths: [
      'Conocimiento profundo de la comunidad',
      'Habilidades de comunicación empática',
      'Entendimiento del contexto histórico',
      'Construcción de relaciones personales'
    ],
    weaknesses: [
      'Puede perderse en detalles históricos',
      'A veces se desvía del tema principal',
      'Tiende a priorizar relaciones sobre eficiencia'
    ]
  }
]

const goToCover = () => {
  router.push('/welcome')
}

const selectScenario = (scenario: Scenario) => {
  selectedScenario.value = scenario
  drawer.value = true
}

const closeDrawer = () => {
  drawer.value = false
  selectedScenario.value = null
}

const startInvestigation = () => {
  // Aquí se puede agregar lógica adicional antes de ir al test
  console.log('Iniciando investigación:', selectedScenario.value)
  router.push('/test')
}

const openMemberModal = (member: TeamMember) => {
  selectedMember.value = member
  memberModal.value = true
}

const closeMemberModal = () => {
  memberModal.value = false
  selectedMember.value = null
}

const openCluesModal = () => {
  cluesModal.value = true
}

const closeCluesModal = () => {
  cluesModal.value = false
}

</script>

<style scoped>
/* Página de instrucciones */
@import url('https://fonts.googleapis.com/css2?family=Julius+Sans+One&display=swap');

.instructions-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: radial-gradient(circle at center, #381B7C 0%, #000005 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

/* Botón de regreso */
.back-button-container {
  position: absolute;
  top: 2rem;
  left: 2rem;
  z-index: 10;
}

.back-btn {
  color: rgba(255, 255, 255, 0.7) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 50% !important;
  transition: all 0.3s ease !important;
}

.back-btn:hover {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  transform: scale(1.1);
}

/* Contenido principal */
.instructions-content {
  width: 100%;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.instructions-header {
  margin-bottom: 3rem;
}

.instructions-title {
  font-family: 'Julius Sans One', sans-serif;
  font-size: 3.5rem;
  font-weight: 400;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.instructions-subtitle {
  font-size: 1.3rem;
  opacity: 0.9;
  margin-bottom: 0;
}

/* Grid de escenarios */
.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 2rem;
  width: fit-content;
  margin: 0 auto;
  justify-items: center;
}

/* Tarjetas de escenarios */
.scenario-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 32px 0 rgba(56, 27, 124, 0.3),
    0 4px 16px 0 rgba(0, 0, 5, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  width: 100%;
  max-width: 350px;
}

.scenario-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.scenario-card:hover::before {
  left: 100%;
}

.scenario-card:hover {
  transform: scale(1.05);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 12px 40px 0 rgba(56, 27, 124, 0.4),
    0 6px 20px 0 rgba(0, 0, 5, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 0 40px rgba(255, 255, 255, 0.1);
}

.scenario-image-container {
  width: calc(100% + 3rem);
  height: 160px;
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
  position: relative;
}

.scenario-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.scenario-card:hover .scenario-image {
  transform: scale(1.1);
}

.scenario-info {
  text-align: center;
  padding: 0 1.5rem 1.5rem 1.5rem;
}

.scenario-name {
  font-family: 'Julius Sans One', sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.3;
}

.scenario-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
  margin: 0;
}

/* Responsive */
@media (max-width: 1400px) {
  .scenarios-grid {
    gap: 1.2rem;
    padding: 1.5rem;
  }
}

@media (max-width: 1200px) {
  .scenarios-grid {
    gap: 1rem;
    padding: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .scenarios-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .instructions-page {
    padding: 1rem;
  }
  
  .back-button-container {
    top: 1.5rem;
    left: 1.5rem;
  }
  
  .instructions-title {
    font-size: 2.5rem;
  }
  
  .instructions-subtitle {
    font-size: 1.1rem;
  }
  
  .scenarios-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.2rem;
    padding: 1rem;
  }
  
  .scenario-card {
    max-width: 320px;
  }
  
  .scenario-image-container {
    height: 120px;
    margin-bottom: 1rem;
  }
  
  .scenario-name {
    font-size: 1rem;
  }
  
  .scenario-description {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .instructions-page {
    padding: 0.5rem;
  }
  
  .back-button-container {
    top: 1rem;
    left: 1rem;
  }
  
  .instructions-title {
    font-size: 2rem;
  }
  
  .instructions-subtitle {
    font-size: 1rem;
  }
  
  .scenarios-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 0.5rem;
  }
  
  .scenario-card {
    max-width: 350px;
  }
  
  .scenario-image-container {
    height: 100px;
    margin-bottom: 0.8rem;
  }
  
  .scenario-name {
    font-size: 0.9rem;
  }
  
  .scenario-description {
    font-size: 0.75rem;
  }
}

/* Estilos del Drawer */
.case-drawer {
  background: radial-gradient(circle at center, #381B7C 0%, #000005 100%) !important;
}

.drawer-content {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: white;
}

.drawer-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.close-btn {
  color: rgba(255, 255, 255, 0.7) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 50% !important;
}

.close-btn:hover {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.drawer-title {
  font-family: 'Julius Sans One', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  flex: 1;
}

.case-details {
  flex: 1;
  overflow-y: auto;
  overflow-x: visible;
  padding: 0 2rem;
}

.case-image-container {
  width: 100%;
  height: 200px;
  margin: 2rem 0;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.case-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.time-chip {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.time-icon {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

.time-text {
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.9rem;
  font-weight: 500;
  font-family: 'Julius Sans One', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.clues-loupe-btn {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.9) !important;
  border-radius: 50% !important;
  width: 50px !important;
  height: 50px !important;
  z-index: 10;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease !important;
}

.clues-loupe-btn:hover {
  background: rgba(255, 255, 255, 0.25) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  color: rgba(255, 255, 255, 1) !important;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.clues-loupe-icon {
  font-size: 1.4rem !important;
}

.case-info {
  padding-bottom: 2rem;
}

.case-subtitle {
  font-family: 'Julius Sans One', sans-serif;
  font-size: 1.2rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  margin: 2rem 0 1rem 0;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.5rem;
}

.case-description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.case-objectives {
  color: rgba(255, 255, 255, 0.9);
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.case-objectives li {
  margin-bottom: 0.8rem;
  line-height: 1.5;
}

.case-clues {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.clue-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.clue-icon {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
}

.clue-text {
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
}

.case-time {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

.team-slider-wrapper {
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  overflow: visible;
}

.team-slider {
  padding: 0.5rem 0;
  overflow: visible;
}

.avatar-slide {
  display: flex;
  justify-content: center;
}

.avatar-container {
  text-align: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-container:hover {
  transform: scale(1.05);
}

.avatar-image {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 0.5rem auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.avatar-container:hover .avatar-image {
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 
    0 0 20px rgba(255, 255, 255, 0.2),
    0 8px 25px rgba(156, 39, 176, 0.4),
    0 4px 15px rgba(233, 30, 99, 0.3);
  transform: translateY(-5px);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.info-icon {
  color: white;
  font-size: 1.5rem;
}

.avatar-name {
  font-family: 'Julius Sans One', sans-serif;
  font-size: 0.7rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Splide arrows customization */
:deep(.splide__arrow) {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: rgba(255, 255, 255, 0.9) !important;
  border-radius: 50% !important;
  width: 40px !important;
  height: 40px !important;
}

:deep(.splide__arrow:hover) {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
  color: rgba(255, 255, 255, 1) !important;
}

:deep(.splide__arrow svg) {
  fill: rgba(255, 255, 255, 0.9) !important;
  width: 20px !important;
  height: 20px !important;
}

:deep(.splide__arrow:hover svg) {
  fill: rgba(255, 255, 255, 1) !important;
}

:deep(.splide__arrow svg path) {
  fill: rgba(255, 255, 255, 0.9) !important;
}

:deep(.splide__arrow:hover svg path) {
  fill: rgba(255, 255, 255, 1) !important;
}

:deep(.splide__arrow--prev) {
  left: -10px;
}

:deep(.splide__arrow--next) {
  right: -10px;
}


.drawer-actions {
  padding: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.start-btn {
  font-family: 'Julius Sans One', sans-serif !important;
  font-size: 1.1rem !important;
  font-weight: 400 !important;
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
}

/* Modal de Pistas */
.clues-modal-card {
  background: linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(50, 50, 50, 0.95)) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  border-radius: 20px !important;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Julius Sans One', sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
  color: #ffffff;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.modal-title-icon {
  color: rgba(233, 30, 99, 0.8);
  font-size: 1.4rem;
}

.modal-close-btn {
  color: rgba(255, 255, 255, 0.7) !important;
}

.modal-close-btn:hover {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

.modal-content {
  padding: 2rem;
  max-height: 400px;
  overflow-y: auto;
}

.clues-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.clue-modal-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  transition: all 0.3s ease;
}

.clue-modal-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(233, 30, 99, 0.3);
  transform: translateY(-2px);
}

.clue-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: linear-gradient(135deg, rgba(233, 30, 99, 0.8), rgba(156, 39, 176, 0.8));
  color: white;
  border-radius: 50%;
  font-family: 'Julius Sans One', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  flex-shrink: 0;
}

.clue-content {
  flex: 1;
}

.clue-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.modal-actions {
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
}

.close-clues-btn {
  font-family: 'Julius Sans One', sans-serif !important;
  font-size: 1rem !important;
  font-weight: 400 !important;
  border-radius: 25px !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
  padding: 0.8rem 2rem !important;
  text-transform: uppercase !important;
  letter-spacing: 0.1em !important;
  transition: all 0.3s ease !important;
}

.close-clues-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px solid rgba(255, 255, 255, 0.5) !important;
  transform: translateY(-2px);
}

.start-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 
    0 12px 40px 0 rgba(156, 39, 176, 0.5),
    0 6px 20px 0 rgba(233, 30, 99, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 60px rgba(233, 30, 99, 0.3) !important;
  transform: translateY(-2px);
}

/* Estilos del Modal de Miembro */
.member-modal-card {
  background: radial-gradient(circle at center, #381B7C 0%, #000005 100%) !important;
  color: white !important;
}

.modal-header {
  padding: 2rem 2rem 1rem 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.member-photo-container {
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.member-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-title {
  font-family: 'Julius Sans One', sans-serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: rgba(255, 255, 255, 0.7) !important;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 50% !important;
}

.modal-close-btn:hover {
  color: rgba(255, 255, 255, 1) !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 1px solid rgba(255, 255, 255, 0.4) !important;
}

.modal-content {
  padding: 2rem;
}

.member-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-title {
  font-family: 'Julius Sans One', sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 0.8rem 0;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 0.3rem;
}

.detail-text {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  margin: 0;
}

.detail-list {
  color: rgba(255, 255, 255, 0.9);
  padding-left: 1.5rem;
  margin: 0;
}

.detail-list li {
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

/* Responsive para el drawer */
@media (max-width: 768px) {
  .case-drawer {
    width: 100% !important;
  }
  
  .drawer-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }
  
  .drawer-title {
    font-size: 1.3rem;
  }
  
  .case-details {
    padding: 0 1.5rem;
  }
  
  .case-image-container {
    height: 150px;
    margin: 1.5rem 0;
  }
  
  .time-chip {
    top: 0.8rem;
    right: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  
  .time-icon {
    font-size: 1rem;
  }
  
  .time-text {
    font-size: 0.8rem;
  }
  
  .clues-loupe-btn {
    bottom: 0.8rem;
    left: 0.8rem;
    width: 45px !important;
    height: 45px !important;
  }
  
  .clues-loupe-icon {
    font-size: 1.2rem !important;
  }
  
  .case-subtitle {
    font-size: 1.1rem;
  }
  
  .team-slider-wrapper {
    padding: 0.8rem 0;
  }
  
  .avatar-image {
    width: 70px;
    height: 70px;
  }
  
  .avatar-name {
    font-size: 0.65rem;
  }
  
  :deep(.splide__arrow) {
    display: none !important;
  }
  
  .drawer-actions {
    padding: 1.5rem;
  }
  
}

@media (max-width: 480px) {
  .drawer-header {
    padding: 1rem 1rem 0.5rem 1rem;
  }
  
  .drawer-title {
    font-size: 1.1rem;
  }
  
  .case-details {
    padding: 0 1rem;
  }
  
  .case-image-container {
    height: 120px;
    margin: 1rem 0;
  }
  
  .time-chip {
    top: 0.6rem;
    right: 0.6rem;
    padding: 0.3rem 0.6rem;
  }
  
  .time-icon {
    font-size: 0.9rem;
  }
  
  .time-text {
    font-size: 0.7rem;
  }
  
  .clues-loupe-btn {
    bottom: 0.6rem;
    left: 0.6rem;
    width: 40px !important;
    height: 40px !important;
  }
  
  .clues-loupe-icon {
    font-size: 1.1rem !important;
  }
  
  .case-subtitle {
    font-size: 1rem;
  }
  
  .team-slider-wrapper {
    padding: 0.6rem 0;
  }
  
  .avatar-image {
    width: 60px;
    height: 60px;
  }
  
  .avatar-name {
    font-size: 0.65rem;
  }
  
  .drawer-actions {
    padding: 1rem;
  }
  
  
  /* Modal de pistas responsive */
  .modal-header {
    padding: 1rem 1.5rem;
  }
  
  .modal-title {
    font-size: 1.1rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .clue-modal-item {
    padding: 0.8rem;
  }
  
  .clue-number {
    width: 25px;
    height: 25px;
    font-size: 0.8rem;
  }
  
  .clue-text {
    font-size: 0.9rem;
  }
  
  .modal-actions {
    padding: 1rem 1.5rem;
  }
}
</style>