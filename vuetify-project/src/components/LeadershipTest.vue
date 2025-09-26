<template>
  <!-- Test de Liderazgo -->
  <v-container class="fill-height cover-page" max-width="1400">
    <v-card class="mx-auto glassmorphism-card" elevation="0" rounded="xl">
      <v-card-title class="text-center py-6">
        <div class="text-h4 font-weight-bold test-title">
          Test de Liderazgo
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <v-row class="fill-height" no-gutters>
          <!-- Columna izquierda: Test -->
          <v-col cols="12" md="8" class="pr-md-4">
            <div class="test-container">
        <!-- Instrucciones -->
        <v-alert
          type="info"
          variant="tonal"
          class="mb-6"
        >
          <v-alert-title>Instrucciones</v-alert-title>
          <div class="text-content">
            Responde cada pregunta según tu experiencia personal y profesional. 
            Utiliza la escala del 1 al 5, donde:
            <ul class="mt-2">
              <li><strong>1:</strong> Totalmente en desacuerdo</li>
              <li><strong>2:</strong> En desacuerdo</li>
              <li><strong>3:</strong> Neutral</li>
              <li><strong>4:</strong> De acuerdo</li>
              <li><strong>5:</strong> Totalmente de acuerdo</li>
            </ul>
          </div>
        </v-alert>

        <!-- Preguntas del test -->
        <div v-if="testStarted && !showResults">
          <!-- Indicador de progreso con corredor -->
          <div class="progress-container mb-6">
            <div 
              class="progress-runner" 
              :class="{ 'finished': progress >= 100 }"
              :style="{ left: progress + '%' }"
            >
              {{ progress >= 100 ? '🌙' : '🚀' }}
            </div>
          <v-progress-linear
            :model-value="progress"
            color="primary"
            height="6"
            rounded
              class="progress-bar"
          ></v-progress-linear>
          </div>

          <div class="text-center mb-4">
            <v-chip color="primary" variant="tonal" class="progress-chip">
              <v-icon class="mr-2" size="small">mdi-chart-line</v-icon>
              {{ Math.round(progress) }}% Completado
            </v-chip>
          </div>

          <v-card class="mb-6 mx-auto question-card glassmorphism-question" elevation="0" rounded="xl">
            <v-card-text class="pa-6">
              <div class="text-h6 mb-4 question-text">
                {{ questions[currentQuestion]?.text }}
              </div>

              <div class="rating-cards mt-4">
                <v-row class="ga-2">
                  <v-col
                    v-for="option in ratingOptions"
                    :key="option.value"
                  >
                    <v-card
                      :class="[
                        'rating-card',
                        'pa-2',
                        'text-center',
                        'cursor-pointer',
                        'transition-all',
                        'h-100',
                        { 'selected': isSelected(option.value) }
                      ]"
                      :color="isSelected(option.value) ? 'primary' : option.color"
                      :variant="isSelected(option.value) ? 'tonal' : 'outlined'"
                      :elevation="isSelected(option.value) ? 8 : 2"
                      @click="selectOption(option.value)"
                      hover
                    >
                      <div class="d-flex flex-column align-center justify-center h-100">
                        <div class="text-h5 mb-1">{{ option.emoji }}</div>
                        <div class="text-h6 font-weight-bold mb-1 option-number">{{ option.value }}</div>
                        <div class="text-caption text-wrap option-label">{{ option.shortLabel }}</div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>
            </v-card-text>
          </v-card>

          <!-- Botones de navegación -->
          <div class="d-flex justify-space-between">
            <v-btn
              :disabled="currentQuestion === 0"
              variant="outlined"
              @click="previousQuestion"
              prepend-icon="mdi-chevron-left"
              class="animated-btn slide-left"
            >
              Anterior
            </v-btn>

            <v-btn
              v-if="currentQuestion < questions.length - 1"
              :disabled="answers[currentQuestion] === null"
              :color="answers[currentQuestion] === null ? 'grey' : 'primary'"
              variant="elevated"
              @click="handleNextClick"
              :append-icon="answers[currentQuestion] === null ? 'mdi-lock' : 'mdi-chevron-right'"
              class="animated-btn slide-right"
            >
              {{ answers[currentQuestion] === null ? 'Responde para continuar' : 'Siguiente' }}
            </v-btn>

            <v-btn
              v-else
              :disabled="!allQuestionsAnswered"
              color="primary"
              variant="elevated"
              @click="calculateResults"
              prepend-icon="mdi-check"
              class="animated-btn bounce-btn"
            >
              Finalizar Test
            </v-btn>
          </div>
        </div>

        <!-- Resultados -->
        <div v-if="showResults" class="text-center">
          <v-icon
            size="64"
            color="success"
            class="mb-4"
          >
            mdi-trophy
          </v-icon>

          <div class="text-h5 mb-4 text-white">¡Test Completado!</div>

          <v-row>
            <v-col cols="12" md="4">
              <v-card class="pa-4 glassmorphism-result" elevation="0" rounded="xl">
                <v-card-title class="text-center text-white">
                  <v-icon color="primary" class="mr-2">mdi-account-group</v-icon>
                  Liderazgo de Personas
                </v-card-title>
                <v-card-text class="text-center">
                  <div class="text-h4 text-primary">{{ results.peopleLeadership }}</div>
                  <div class="text-caption">de 45 puntos</div>
                  <v-progress-linear
                    :model-value="(results.peopleLeadership / 45) * 100"
                    color="primary"
                    height="8"
                    rounded
                    class="mt-2"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="pa-4 glassmorphism-result" elevation="0" rounded="xl">
                <v-card-title class="text-center text-white">
                  <v-icon color="secondary" class="mr-2">mdi-target</v-icon>
                  Liderazgo de Tareas
                </v-card-title>
                <v-card-text class="text-center">
                  <div class="text-h4 text-secondary">{{ results.taskLeadership }}</div>
                  <div class="text-caption">de 45 puntos</div>
                  <v-progress-linear
                    :model-value="(results.taskLeadership / 45) * 100"
                    color="secondary"
                    height="8"
                    rounded
                    class="mt-2"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="pa-4 glassmorphism-result" elevation="0" rounded="xl">
                <v-card-title class="text-center text-white">
                  <v-icon color="accent" class="mr-2">mdi-lightbulb</v-icon>
                  Liderazgo Total
                </v-card-title>
                <v-card-text class="text-center">
                  <div class="text-h4 text-accent">{{ results.totalScore }}</div>
                  <div class="text-caption">de 90 puntos</div>
                  <v-progress-linear
                    :model-value="(results.totalScore / 90) * 100"
                    color="accent"
                    height="8"
                    rounded
                    class="mt-2"
                  ></v-progress-linear>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Interpretación de resultados -->
          <v-card class="mt-6 glassmorphism-interpretation" elevation="0" rounded="xl">
            <v-card-title class="text-white">
              <v-icon class="mr-2" color="white">mdi-chart-line</v-icon>
              Interpretación de Resultados
            </v-card-title>
            <v-card-text>
              <div class="mb-4 text-content">
                <strong>Tu perfil de liderazgo:</strong>
              </div>
              
              <v-alert
                :type="getLeadershipType().type as 'error' | 'info' | 'success' | 'warning'"
                variant="tonal"
                class="mb-4"
              >
                <v-alert-title>{{ getLeadershipType().title }}</v-alert-title>
                {{ getLeadershipType().description }}
              </v-alert>

              <div class="text-body-2 text-content">
                <p><strong>Liderazgo de Personas:</strong> Se enfoca en motivar, desarrollar y apoyar a los miembros del equipo.</p>
                <p><strong>Liderazgo de Tareas:</strong> Se concentra en la planificación, organización y cumplimiento de objetivos.</p>
                <p>Un líder efectivo necesita equilibrar ambos aspectos según la situación.</p>
              </div>
            </v-card-text>
          </v-card>

          <div class="mt-6">
            <v-btn
              color="primary"
              variant="elevated"
              @click="resetTest"
              prepend-icon="mdi-refresh"
              class="animated-btn rotate-btn"
            >
              Realizar Test Nuevamente
            </v-btn>
          </div>
        </div>
            </div>
          </v-col>

          <!-- Columna derecha: Lista de respuestas -->
          <v-col cols="12" md="4" class="pl-md-4">
            <div class="answers-container">
              <v-card class="glassmorphism-answers" elevation="0" rounded="xl">
                <v-card-title class="text-center py-4">
                  <div class="text-h6 font-weight-bold answers-title">
                    <span class="mr-2">📋</span>
                    Respuestas
                  </div>
                </v-card-title>
                
                <v-divider class="mx-4"></v-divider>
                
                <v-card-text class="pa-4">
                  <div v-if="!testStarted" class="text-center py-8">
                    <v-icon size="48" color="grey-lighten-1" class="mb-4">mdi-help-circle-outline</v-icon>
                    <div class="text-body-1 text-grey-lighten-1">
                      Inicia el test para ver las respuestas
                    </div>
                  </div>
                  
                  <div v-else>
                    <!-- Mensaje informativo -->
                    <v-alert
                      :type="answeredQuestionsCount > 0 ? 'success' : 'info'"
                      variant="tonal"
                      density="compact"
                      class="mb-4"
                    >
                      <v-alert-title class="text-caption">
                        {{ answeredQuestionsCount > 0 ? '🎉 Progreso' : '🚀 ¡Comienza!' }}
                      </v-alert-title>
                      <div class="text-caption">
                        {{ answeredQuestionsCount > 0 
                          ? `Has respondido ${answeredQuestionsCount} de ${questions.length} preguntas`
                          : 'Responde tu primera pregunta para ver tu progreso aquí'
                        }}
                      </div>
                    </v-alert>
                    
                    <div v-if="answeredQuestionsCount === 0" class="text-center py-8">
                      <v-icon size="48" color="grey-lighten-1" class="mb-4">mdi-help-circle-outline</v-icon>
                      <div class="text-body-1 text-grey-lighten-1">
                        Tus respuestas aparecerán aquí
                      </div>
                    </div>
                    
                    <div v-else class="answers-list">
                      <div
                      v-for="(question, index) in answeredQuestions"
                      :key="question.index"
                      :class="[
                        'answer-item',
                        'mb-2',
                        'pa-3',
                        'rounded-lg',
                        'cursor-pointer',
                        'transition-all',
                        {
                          'answered': true,
                          'current': question.index === currentQuestion,
                          'selected': selectedAnswerIndex === question.index
                        }
                      ]"
                      @click="editAnswer(question.index)"
                    >
                      <div class="d-flex align-center">
                        <v-chip
                          :color="getAnswerColor(question.index)"
                          size="small"
                          class="mr-3"
                        >
                          {{ question.index + 1 }}
                        </v-chip>
                        
                        <div class="flex-grow-1">
                          <div class="text-body-2 font-weight-medium mb-1">
                            {{ question.text.length > 50 ? question.text.substring(0, 50) + '...' : question.text }}
                          </div>
                          
                          <div class="d-flex align-center">
                            <span 
                              class="answer-emoji mr-2"
                              :style="{ fontSize: '1.2rem' }"
                            >
                              {{ getAnswerIcon(answers[question.index] as number) }}
                            </span>
                            <span class="text-caption text-grey-lighten-1">
                              {{ getAnswerText(answers[question.index] as number) }}
                            </span>
                          </div>
                        </div>
                        
                        <span
                          v-if="question.index === currentQuestion"
                          class="current-indicator"
                        >
                          ➡️
                        </span>
                      </div>
                    </div>
          </div>
        </div>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Estado del test
const testStarted = ref(true) // Siempre iniciado en la página del test
const showResults = ref(false)
const currentQuestion = ref(0)
const answers = ref<(number | null)[]>(Array(18).fill(null))
const selectedAnswerIndex = ref<number | null>(null)

// Generar opciones especiales aleatorias para cada pregunta
const specialOptions = ref<number[]>([])

// Inicializar opciones especiales al cargar el componente
const initializeSpecialOptions = () => {
  specialOptions.value = Array(18).fill(0).map(() => Math.floor(Math.random() * 5) + 1)
  console.log('🎲 Opciones especiales generadas:', specialOptions.value)
}

// Inicializar el test automáticamente al cargar el componente
onMounted(() => {
  initializeSpecialOptions()
  
  // Mostrar alerta de bienvenida
  setTimeout(() => {
    const alertData = {
      title: '✨ ¡Comencemos!',
      message: 'Responde cada pregunta con honestidad basándote en tu experiencia personal y profesional. No hay respuestas correctas o incorrectas, simplemente refleja tu estilo de liderazgo actual.',
      emoji: '',
      color: 'primary',
      duration: 4500
    }
    createProgressAlert(alertData)
  }, 500)
})

// Opciones de calificación con colores y emojis
const ratingOptions = [
  { 
    label: '1 - Totalmente en desacuerdo', 
    shortLabel: 'Totalmente en desacuerdo',
    value: 1, 
    color: 'red-lighten-1',
    emoji: '😡'
  },
  { 
    label: '2 - En desacuerdo', 
    shortLabel: 'En desacuerdo',
    value: 2, 
    color: 'orange-lighten-1',
    emoji: '😕'
  },
  { 
    label: '3 - Neutral', 
    shortLabel: 'Neutral',
    value: 3, 
    color: 'yellow-lighten-1',
    emoji: '😐'
  },
  { 
    label: '4 - De acuerdo', 
    shortLabel: 'De acuerdo',
    value: 4, 
    color: 'light-green-lighten-1',
    emoji: '😊'
  },
  { 
    label: '5 - Totalmente de acuerdo', 
    shortLabel: 'Totalmente de acuerdo',
    value: 5, 
    color: 'green-lighten-1',
    emoji: '😍'
  }
]

// Preguntas del test con categorización
const questions = [
  { text: 'Animo a los miembros de mi equipo a participar en la toma de decisiones y trato de implementar sus ideas y sugerencias.', category: 'people' },
  { text: 'Nada es más importante que completar un objetivo o tarea.', category: 'task' },
  { text: 'Monitoreo muy de cerca la duración de las tareas para asegurarme que serán completadas a tiempo.', category: 'task' },
  { text: 'Me gusta ayudar a los demás a realizar nuevas tareas o procedimientos.', category: 'people' },
  { text: 'Cuanto más desafiante es la tarea, más lo disfruto.', category: 'task' },
  { text: 'Animo a mis colaboradores a ser creativos en su trabajo.', category: 'people' },
  { text: 'Cuando miro una situación o tarea compleja ha sido complementada, me aseguro de todos los detalles.', category: 'task' },
  { text: 'Me es fácil llevar a cabo varias tareas complicadas al mismo tiempo.', category: 'task' },
  { text: 'Disfruto leyendo artículos, libros o revistas acerca de capacitación, liderazgo y psicología, y luego lo pongo en práctica.', category: 'people' },
  { text: 'Cuando corrijo errores no me preocupan las relaciones personales.', category: 'task' },
  { text: 'Yo administro mi tiempo con efectividad.', category: 'task' },
  { text: 'Me gusta explicar los detalles de una tarea compleja a mis empleados.', category: 'people' },
  { text: 'Dividir grandes proyectos en pequeñas tareas manejables es como una segunda naturaleza para mí.', category: 'task' },
  { text: 'No hay nada más importante que desarrollar un gran equipo de trabajo.', category: 'people' },
  { text: 'Me gusta analizar problemas.', category: 'task' },
  { text: 'Respeto los límites de los demás.', category: 'people' },
  { text: 'Aconsejar a mis empleados para que mejore su desempeño es mi naturaleza.', category: 'people' },
  { text: 'Disfruto leyendo artículos, libros y revistas acerca de mi profesión y luego implemento los procedimientos que he aprendido.', category: 'people' }
]

// Resultados
const results = ref({
  peopleLeadership: 0,
  taskLeadership: 0,
  totalScore: 0
})

// Computed properties
const progress = computed(() => {
  const answeredQuestions = answers.value.filter(answer => answer !== null).length
  return (answeredQuestions / questions.length) * 100
})

const allQuestionsAnswered = computed(() => {
  return answers.value.every(answer => answer !== null)
})

const answeredQuestionsCount = computed(() => {
  return answers.value.filter(answer => answer !== null).length
})

const answeredQuestions = computed(() => {
  return questions.map((question, index) => ({ ...question, index }))
    .filter((_, index) => answers.value[index] !== null)
    .sort((a, b) => b.index - a.index) // Ordenar de más reciente a más antigua
})

// Métodos
// Función para iniciar el test
const startTest = () => {
  testStarted.value = true
  showResults.value = false
  currentQuestion.value = 0
  answers.value = Array(18).fill(null)
  selectedAnswerIndex.value = null
  
  // Inicializar opciones especiales
  initializeSpecialOptions()
  
  // Mostrar alerta de bienvenida
  setTimeout(() => {
    const alertData = {
      title: '✨ ¡Comencemos!',
      message: 'Responde cada pregunta con honestidad basándote en tu experiencia personal y profesional. No hay respuestas correctas o incorrectas, simplemente refleja tu estilo de liderazgo actual.',
      emoji: '',
      color: 'primary',
      duration: 4500
    }
    createProgressAlert(alertData)
  }, 500)
}

const selectOption = (value: number) => {
  // Asegurar que la respuesta se guarde correctamente
  answers.value[currentQuestion.value] = value
  
  // Limpiar la selección en la lista de respuestas
  selectedAnswerIndex.value = null
  
  // Forzar la reactividad para que Vue actualice la UI
  answers.value = [...answers.value]
  
  // Verificar si esta opción es la especial para esta pregunta
  const specialOption = specialOptions.value[currentQuestion.value]
  console.log(`🔍 Pregunta ${currentQuestion.value + 1}: Opción seleccionada ${value}, Opción especial ${specialOption}`)
  
  if (value === specialOption) {
    console.log(`🎉 ¡Efectos activados! Pregunta ${currentQuestion.value + 1}, Opción ${value}`)
    
    // Crear efectos de emojis del tipo seleccionado
    setTimeout(() => {
      createRandomEmojiEffects(value) // Pasar el valor seleccionado
    }, 300)
    
    // Mostrar alerta sutil con el emoji seleccionado
    setTimeout(() => {
      const selectedOption = ratingOptions.find(opt => opt.value === value)
      const selectedEmoji = selectedOption?.emoji || '🎊'
      
      const alertData = {
        title: `${selectedEmoji} ¡Excelente elección!`,
        message: `Tu respuesta refleja una perspectiva muy interesante sobre el liderazgo. ¡Sigue así!`,
        emoji: selectedEmoji,
        color: 'primary',
        duration: 2500
      }
      createProgressAlert(alertData)
    }, 500)
  } else {
    console.log(`❌ No hay efectos especiales para esta selección`)
  }
}

// Función para crear emojis del tipo seleccionado por toda la página
const createRandomEmojiEffects = (selectedValue?: number) => {
  console.log('🎭 Creando efectos de emojis del tipo seleccionado:', selectedValue)
  
  // Si hay un valor seleccionado, usar su emoji, sino usar emojis aleatorios
  let targetEmoji = '✨'
  if (selectedValue) {
    const selectedOption = ratingOptions.find(opt => opt.value === selectedValue)
    targetEmoji = selectedOption?.emoji || '✨'
  }
  
  console.log('🎯 Emoji objetivo:', targetEmoji)
  
  const emojiCount = 25 // Más emojis del mismo tipo
  
  for (let i = 0; i < emojiCount; i++) {
    setTimeout(() => {
      // Usar el emoji seleccionado o uno aleatorio para finalización
      const emojiToUse = selectedValue ? targetEmoji : (['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)] || '✨')
      const emojiElement = document.createElement('div')
      emojiElement.textContent = emojiToUse
      emojiElement.className = 'random-emoji-effect'
      
      // Posición aleatoria en la pantalla (evitar bordes)
      const randomX = 50 + Math.random() * (window.innerWidth - 100)
      const randomY = 50 + Math.random() * (window.innerHeight - 100)
      
      // Tamaño aleatorio más visible
      const randomSize = 2 + Math.random() * 4 // 2-6rem
      
      console.log(`🎪 Creando emoji ${emojiToUse} en posición (${randomX}, ${randomY}) tamaño ${randomSize}rem`)
      
      // Aplicar estilos directamente
      emojiElement.style.position = 'fixed'
      emojiElement.style.left = randomX + 'px'
      emojiElement.style.top = randomY + 'px'
      emojiElement.style.fontSize = randomSize + 'rem'
      emojiElement.style.zIndex = '9999'
      emojiElement.style.pointerEvents = 'none'
      emojiElement.style.userSelect = 'none'
      emojiElement.style.opacity = '0'
      emojiElement.style.transform = 'scale(0) rotate(0deg)'
      emojiElement.style.transition = 'all 1s ease-out'
      
      // Agregar filtros de colores
      const colors = [
        'drop-shadow(0 0 15px rgba(255, 105, 180, 0.8))',
        'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))',
        'drop-shadow(0 0 15px rgba(233, 30, 99, 0.8))',
        'drop-shadow(0 0 15px rgba(156, 39, 176, 0.8))',
        'drop-shadow(0 0 15px rgba(63, 81, 181, 0.8))'
      ]
      emojiElement.style.filter = colors[Math.floor(Math.random() * colors.length)] || 'none'
      
      document.body.appendChild(emojiElement)
      console.log('✅ Emoji agregado al DOM')
      
      // Forzar reflow
      emojiElement.offsetHeight
      
      // Animar aparición
      setTimeout(() => {
        console.log(`🎬 Animando aparición de ${emojiToUse}`)
        emojiElement.style.opacity = '0.9'
        emojiElement.style.transform = 'scale(1) rotate(180deg)'
      }, 200)
      
      // Animar movimiento y rotación
      setTimeout(() => {
        const moveX = (Math.random() - 0.5) * 300
        const moveY = (Math.random() - 0.5) * 300
        emojiElement.style.transform = `scale(1.5) rotate(360deg) translate(${moveX}px, ${moveY}px)`
        emojiElement.style.opacity = '0.7'
      }, 1000)
      
      // Animar desaparición
      setTimeout(() => {
        console.log(`🎬 Animando desaparición de ${emojiToUse}`)
        emojiElement.style.opacity = '0'
        emojiElement.style.transform = 'scale(0) rotate(720deg)'
      }, 3000)
      
      // Remover del DOM
      setTimeout(() => {
        if (emojiElement.parentNode) {
          console.log(`🗑️ Removiendo emoji ${emojiToUse}`)
          emojiElement.parentNode.removeChild(emojiElement)
        }
      }, 4000)
      
    }, i * 150) // Retraso más espaciado para ver mejor
  }
  
  // Vibración divertida
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100, 50, 200])
  }
}

// Función removida - ya no necesitamos emoji de prueba

// Función removida - las alertas de progreso ahora son solo por opciones especiales

// Función para crear alerta de progreso visual
const createProgressAlert = (alertData: any) => {
  // Crear el contenedor de la alerta
  const alertContainer = document.createElement('div')
  alertContainer.className = 'progress-alert-overlay'
  
  // Estilos del contenedor - Posición inferior derecha
  alertContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 10000;
    pointer-events: none;
    opacity: 0;
    transition: all 0.5s ease-out;
  `
  
  // Crear la tarjeta de alerta estilo toast
  const alertCard = document.createElement('div')
  alertCard.className = 'progress-alert-card'
  alertCard.style.cssText = `
    background: rgba(233, 30, 99, 0.45);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 182, 193, 0.8);
    border-radius: 15px;
    padding: 20px 25px;
    text-align: left;
    box-shadow: 0 8px 32px rgba(233, 30, 99, 0.5);
    transform: translateX(450px);
    transition: all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    max-width: 420px;
    min-width: 350px;
  `
  
  // Contenido de la alerta estilo toast
  alertCard.innerHTML = `
    <div style="display: flex; align-items: flex-start; gap: ${alertData.emoji ? '15px' : '0'};">
      ${alertData.emoji ? `<div style="font-size: 2rem; flex-shrink: 0;">${alertData.emoji}</div>` : ''}
      <div style="flex: 1;">
        <div style="font-size: 1.1rem; font-weight: bold; color: white; margin-bottom: 8px;">
          ${alertData.title}
        </div>
        <div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.9); line-height: 1.5;">
          ${alertData.message}
        </div>
      </div>
    </div>
  `
  
  alertContainer.appendChild(alertCard)
  document.body.appendChild(alertContainer)
  
  // Animar aparición desde la derecha
  setTimeout(() => {
    alertContainer.style.opacity = '1'
    alertCard.style.transform = 'translateX(0)'
  }, 100)
  
  // Animar desaparición hacia la derecha
  setTimeout(() => {
    alertContainer.style.opacity = '0'
    alertCard.style.transform = 'translateX(450px)'
  }, alertData.duration)
  
  // Remover del DOM
  setTimeout(() => {
    if (alertContainer.parentNode) {
      alertContainer.parentNode.removeChild(alertContainer)
    }
  }, alertData.duration + 500)
  
  // Vibración suave
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100, 50, 100])
  }
}

// Función helper para verificar si una opción está seleccionada
const isSelected = (optionValue: number) => {
  return answers.value[currentQuestion.value] === optionValue
}

const handleNextClick = () => {
  if (answers.value[currentQuestion.value] === null) {
    // Mostrar alerta cuando intente avanzar sin responder
    showAnswerRequiredAlert()
    return
  }
  nextQuestion()
}

const nextQuestion = () => {
  if (currentQuestion.value < questions.length - 1 && answers.value[currentQuestion.value] !== null) {
    currentQuestion.value++
    selectedAnswerIndex.value = null
    
    // Ya no necesitamos alertas automáticas de mitad y final
    // Los efectos especiales ahora son aleatorios por pregunta
  }
}

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
    selectedAnswerIndex.value = null
  }
}

const calculateResults = () => {
  let peopleScore = 0
  let taskScore = 0

  questions.forEach((question, index) => {
    const answer = answers.value[index] as number
    if (question.category === 'people') {
      peopleScore += answer
    } else {
      taskScore += answer
    }
  })

  results.value = {
    peopleLeadership: peopleScore,
    taskLeadership: taskScore,
    totalScore: peopleScore + taskScore
  }

  // Mostrar alerta de felicitación antes de los resultados
  showCompletionAlert()
  
  // Mostrar resultados después de un pequeño delay
  setTimeout(() => {
    showResults.value = true
  }, 2000)
}

// Función para mostrar alerta de finalización
const showCompletionAlert = () => {
  const alertData = {
    title: '🎊 ¡Felicitaciones!',
    message: '¡Has completado exitosamente el Test de Liderazgo! Tus respuestas han sido analizadas y ahora podrás conocer tu perfil único como líder, incluyendo tus fortalezas y áreas de oportunidad.',
    emoji: '🏆',
    color: 'success',
    duration: 5000
  }
  
  createProgressAlert(alertData)
  
  // Crear efectos de emojis aleatorios al finalizar
  setTimeout(() => {
    console.log('🏆 Activando efectos de finalización')
    createRandomEmojiEffects()
  }, 2000)
}

const getLeadershipType = () => {
  const { peopleLeadership, taskLeadership } = results.value
  
  if (peopleLeadership > taskLeadership + 5) {
    return {
      type: 'info',
      title: 'Líder Orientado a las Personas',
      description: 'Tu estilo de liderazgo se centra en el desarrollo y bienestar de tu equipo. Eres excelente motivando y apoyando a otros, pero podrías beneficiarte de enfocarte más en los objetivos y tareas específicas.'
    }
  } else if (taskLeadership > peopleLeadership + 5) {
    return {
      type: 'warning',
      title: 'Líder Orientado a las Tareas',
      description: 'Tu estilo de liderazgo se enfoca en la eficiencia y el cumplimiento de objetivos. Eres excelente organizando y completando tareas, pero podrías beneficiarte de dedicar más tiempo al desarrollo de tu equipo.'
    }
  } else {
    return {
      type: 'success',
      title: 'Líder Equilibrado',
      description: 'Tienes un estilo de liderazgo equilibrado que combina efectivamente la orientación hacia las personas y las tareas. Este es un perfil ideal que te permite adaptarte a diferentes situaciones de liderazgo.'
    }
  }
}

const resetTest = () => {
  testStarted.value = false
  showResults.value = false
  currentQuestion.value = 0
  answers.value = Array(18).fill(null)
  selectedAnswerIndex.value = null
  results.value = {
    peopleLeadership: 0,
    taskLeadership: 0,
    totalScore: 0
  }
  
  // Reinicializar opciones especiales para un nuevo test
  specialOptions.value = []
}

// Métodos para manejar la lista de respuestas
const editAnswer = (index: number) => {
  if (testStarted.value && !showResults.value) {
    // Si la pregunta actual no está respondida, mostrar alerta
    if (answers.value[currentQuestion.value] === null && index !== currentQuestion.value) {
      showAnswerRequiredAlert()
      return
    }
    
    currentQuestion.value = index
    selectedAnswerIndex.value = index
  }
}

const getAnswerColor = (index: number) => {
  if (index === currentQuestion.value) return 'primary'
  if (answers.value[index] !== null) return 'success'
  return 'grey'
}

const getAnswerIcon = (value: number) => {
  const option = ratingOptions.find(opt => opt.value === value)
  switch (value) {
    case 1: return '😡'
    case 2: return '😕'
    case 3: return '😐'
    case 4: return '😊'
    case 5: return '😍'
    default: return '❓'
  }
}

const getAnswerText = (value: number) => {
  const option = ratingOptions.find(opt => opt.value === value)
  return option ? option.shortLabel : 'Sin respuesta'
}

// Función para mostrar alerta cuando intente avanzar sin responder
const showAnswerRequiredAlert = () => {
  const alertData = {
    title: '🔒 Respuesta Requerida',
    message: 'Por favor selecciona una opción antes de continuar a la siguiente pregunta. Es importante que respondas todas las preguntas para obtener un análisis preciso de tu estilo de liderazgo.',
    emoji: '⚠️',
    color: 'warning',
    duration: 4000
  }
  
  createProgressAlert(alertData)
  
  // Efecto visual en las tarjetas de rating para llamar la atención
  const ratingCards = document.querySelectorAll('.rating-card')
  ratingCards.forEach((card, index) => {
    const htmlCard = card as HTMLElement
    setTimeout(() => {
      htmlCard.style.transform = 'scale(1.05)'
      htmlCard.style.boxShadow = '0 8px 25px rgba(255, 193, 7, 0.4)'
      
      setTimeout(() => {
        htmlCard.style.transform = 'scale(1)'
        htmlCard.style.boxShadow = ''
      }, 300)
    }, index * 100)
  })
}
</script>

<style scoped>
/* Estilos para el test de liderazgo */
.cover-page {
  background: radial-gradient(circle at center, #381B7C 0%, #000005 100%);
  min-height: 100vh;
}

/* Glassmorphism para tarjetas principales */
.glassmorphism-card {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px 0 rgba(56, 27, 124, 0.3),
    0 4px 16px 0 rgba(0, 0, 5, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 24px;
}

.v-theme--dark .glassmorphism-card {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px 0 rgba(56, 27, 124, 0.4),
    0 4px 16px 0 rgba(0, 0, 5, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Glassmorphism para tarjetas de preguntas */
.glassmorphism-question {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 
    0 6px 24px 0 rgba(56, 27, 124, 0.25),
    0 3px 12px 0 rgba(0, 0, 5, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border-radius: 20px;
}

.v-theme--dark .glassmorphism-question {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 6px 24px 0 rgba(56, 27, 124, 0.35),
    0 3px 12px 0 rgba(0, 0, 5, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

/* Glassmorphism para tarjetas de resultados */
.glassmorphism-result {
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 4px 16px 0 rgba(56, 27, 124, 0.2),
    0 2px 8px 0 rgba(0, 0, 5, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.glassmorphism-result:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px 0 rgba(56, 27, 124, 0.3),
    0 3px 10px 0 rgba(0, 0, 5, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.v-theme--dark .glassmorphism-result {
  background: rgba(255, 255, 255, 0.06) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 4px 16px 0 rgba(56, 27, 124, 0.3),
    0 2px 8px 0 rgba(0, 0, 5, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

.v-theme--dark .glassmorphism-result:hover {
  box-shadow: 
    0 6px 20px 0 rgba(56, 27, 124, 0.4),
    0 3px 10px 0 rgba(0, 0, 5, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Glassmorphism para interpretación */
.glassmorphism-interpretation {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 
    0 5px 20px 0 rgba(56, 27, 124, 0.22),
    0 2px 10px 0 rgba(0, 0, 5, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 18px;
}

.v-theme--dark .glassmorphism-interpretation {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(22px);
  -webkit-backdrop-filter: blur(22px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 5px 20px 0 rgba(56, 27, 124, 0.32),
    0 2px 10px 0 rgba(0, 0, 5, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

/* Glassmorphism para lista de respuestas */
.glassmorphism-answers {
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 8px 32px 0 rgba(56, 27, 124, 0.18),
    0 4px 16px 0 rgba(0, 0, 5, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.v-theme--dark .glassmorphism-answers {
  background: rgba(255, 255, 255, 0.04) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 8px 32px 0 rgba(56, 27, 124, 0.25),
    0 4px 16px 0 rgba(0, 0, 5, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

/* Glassmorphism para tarjetas de rating */
.rating-card {
  background: rgba(255, 255, 255, 0.12) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  box-shadow: 
    0 4px 12px 0 rgba(56, 27, 124, 0.2),
    0 2px 6px 0 rgba(0, 0, 5, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  min-height: 120px;
  width: 100%;
  color: rgba(255, 255, 255, 0.9);
}

.rating-card:hover:not(.selected) {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px 0 rgba(56, 27, 124, 0.3),
    0 3px 8px 0 rgba(0, 0, 5, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.18) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  color: rgba(255, 255, 255, 1);
}

.rating-card.selected {
  transform: translateY(-3px) !important;
  box-shadow: 
    0 8px 20px 0 rgba(56, 27, 124, 0.4),
    0 4px 10px 0 rgba(0, 0, 5, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5) !important;
  z-index: 2;
  background: rgba(255, 255, 255, 0.25) !important;
  color: rgba(255, 255, 255, 1);
}

.v-theme--dark .rating-card {
  background: rgba(255, 255, 255, 0.06) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  box-shadow: 
    0 4px 12px 0 rgba(56, 27, 124, 0.3),
    0 2px 6px 0 rgba(0, 0, 5, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.85);
}

.v-theme--dark .rating-card:hover:not(.selected) {
  box-shadow: 
    0 6px 16px 0 rgba(56, 27, 124, 0.4),
    0 3px 8px 0 rgba(0, 0, 5, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.95);
}

.v-theme--dark .rating-card.selected {
  box-shadow: 
    0 8px 20px 0 rgba(56, 27, 124, 0.5),
    0 4px 10px 0 rgba(0, 0, 5, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3) !important;
  background: rgba(255, 255, 255, 0.15) !important;
  color: rgba(255, 255, 255, 1);
}

/* Estilos para títulos */
.test-title, .answers-title {
  color: #837B6B !important;
}

.v-theme--dark .test-title, .v-theme--dark .answers-title {
  color: #F5CB84 !important;
}

/* Estilos para botones animados */
.animated-btn {
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
  position: relative;
  overflow: hidden;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease;
}

.animated-btn:hover::before {
  left: 100%;
}

.animated-btn:hover {
  transform: translateY(-3px) !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: 2px solid rgba(255, 255, 255, 0.4) !important;
  box-shadow: 
    0 12px 40px 0 rgba(156, 39, 176, 0.5),
    0 6px 20px 0 rgba(233, 30, 99, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    0 0 60px rgba(233, 30, 99, 0.3) !important;
}

/* Estilos para chips de progreso */
.progress-chip {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

/* Estilos para elementos de respuestas */
.answer-item {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}

.answer-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

.answer-item.current {
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.answer-item.selected {
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.5);
}

/* Estilos para emojis de respuestas */
.answer-emoji {
  font-size: 1.2rem;
}

.current-indicator {
  font-size: 1.2rem;
  margin-left: 0.5rem;
}

/* Estilos para la barra de progreso */
.progress-container {
  position: relative;
  margin-bottom: 2rem;
}

.progress-runner {
  position: absolute;
  top: -12px;
  transform: translateX(-50%);
  font-size: 1.5rem;
  z-index: 2;
  transition: left 0.3s ease;
}

.progress-runner.finished {
  animation: bounce 1s ease-in-out infinite alternate;
}

.progress-bar {
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* Animaciones */
@keyframes bounce {
  0% { transform: translateX(-50%) translateY(0px); }
  100% { transform: translateX(-50%) translateY(-10px); }
}

.slide-left {
  animation: slideLeft 0.3s ease-out;
}

.slide-right {
  animation: slideRight 0.3s ease-out;
}

.bounce-btn {
  animation: bounceIn 0.5s ease-out;
}

@keyframes slideLeft {
  from { transform: translateX(-20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes slideRight {
  from { transform: translateX(20px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes bounceIn {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

/* Efectos de texto */
.question-text {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 500;
  line-height: 1.6;
}

.text-content {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
}

/* Efectos de polvo para el cohete */
.progress-runner::after {
  content: '✨';
  position: absolute;
  right: -30px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  opacity: 0.7;
  animation: sparkle 1s ease-in-out infinite alternate;
}

@keyframes sparkle {
  0% { opacity: 0.3; transform: translateY(-50%) scale(0.8); }
  100% { opacity: 0.8; transform: translateY(-50%) scale(1.2); }
}

/* Responsive */
@media (max-width: 768px) {
  .glassmorphism-card {
    margin: 1rem;
  }
  
  .rating-card {
    min-height: 100px;
  }
  
  .progress-runner {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .glassmorphism-card {
    margin: 0.5rem;
  }
  
  .rating-card {
    min-height: 80px;
  }
  
  .progress-runner {
    font-size: 1rem;
  }
}
</style>
