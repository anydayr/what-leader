<template>
  <v-container class="fill-height" max-width="900">
    <v-card class="mx-auto glassmorphism-card" elevation="0" rounded="xl">
      <v-card-title class="text-center py-6">
        <div class="text-h4 font-weight-bold text-white">
          Test de Liderazgo
        </div>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="pa-6">
        <!-- Instrucciones -->
        <v-alert
          v-if="!testStarted"
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

        <!-- Botón para iniciar test -->
        <div v-if="!testStarted" class="text-center">
          <v-btn
            color="primary"
            size="large"
            variant="elevated"
            @click="startTest"
            prepend-icon="mdi-play"
            class="animated-btn pulse-btn"
          >
            Iniciar Test
          </v-btn>
        </div>

        <!-- Preguntas del test -->
        <div v-if="testStarted && !showResults">
          <!-- Indicador de progreso -->
          <v-progress-linear
            :model-value="progress"
            color="primary"
            height="6"
            rounded
            class="mb-6"
          ></v-progress-linear>

          <div class="text-center mb-4">
            <v-chip color="primary" variant="tonal">
              Pregunta {{ currentQuestion + 1 }} de {{ questions.length }}
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
              color="primary"
              variant="elevated"
              @click="nextQuestion"
              append-icon="mdi-chevron-right"
              class="animated-btn slide-right"
            >
              Siguiente
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
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Estado del test
const testStarted = ref(false)
const showResults = ref(false)
const currentQuestion = ref(0)
const answers = ref<(number | null)[]>(Array(18).fill(null))

// Generar opciones especiales aleatorias para cada pregunta
const specialOptions = ref<number[]>([])

// Inicializar opciones especiales al cargar el componente
const initializeSpecialOptions = () => {
  specialOptions.value = Array(18).fill(0).map(() => Math.floor(Math.random() * 5) + 1)
  console.log('🎲 Opciones especiales generadas:', specialOptions.value)
}

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

// Métodos
const startTest = () => {
  testStarted.value = true
  
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

const nextQuestion = () => {
  if (currentQuestion.value < questions.length - 1) {
    currentQuestion.value++
    
    // Ya no necesitamos alertas automáticas de mitad y final
    // Los efectos especiales ahora son aleatorios por pregunta
  }
}

const previousQuestion = () => {
  if (currentQuestion.value > 0) {
    currentQuestion.value--
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
  results.value = {
    peopleLeadership: 0,
    taskLeadership: 0,
    totalScore: 0
  }
  
  // Reinicializar opciones especiales para un nuevo test
  specialOptions.value = []
}
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-progress-linear {
  transition: all 0.5s ease;
}

/* Estilos de texto que se adaptan correctamente al tema */
.theme--light .text-content {
  color: #000000 !important;
}

.theme--dark .text-content {
  color: #ffffff !important;
}

/* Para el nuevo sistema de temas de Vuetify 3 */
.v-theme--light .text-content {
  color: #000000 !important;
}

.v-theme--dark .text-content {
  color: #ffffff !important;
}

/* Estilos específicos para diferentes elementos */
.v-theme--light .question-text {
  color: #212121 !important;
}

.v-theme--dark .question-text {
  color: #ffffff !important;
}

.v-theme--light .option-number {
  color: #000000 !important;
}

.v-theme--dark .option-number {
  color: #ffffff !important;
}

.v-theme--light .option-label {
  color: #424242 !important;
}

.v-theme--dark .option-label {
  color: #e0e0e0 !important;
}

.rating-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 2px solid transparent;
}

.rating-card:hover {
  transform: translateY(-2px);
}

.rating-card.selected {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(var(--v-theme-primary), 0.3) !important;
  border: 2px solid rgb(var(--v-theme-primary)) !important;
}

.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.3s ease;
}

.rating-cards .v-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
}

.question-card {
  max-width: 800px;
}

.rating-cards .v-col {
  flex: 1 1 auto;
  max-width: calc(20% - 8px);
  min-width: 0;
}

.rating-card {
  min-height: 120px;
  width: 100%;
}

@media (max-width: 960px) {
  .question-card {
    max-width: 700px;
  }
  
  .rating-card {
    min-height: 100px;
    width: 100%;
  }
  
  .rating-card .text-h5 {
    font-size: 1.25rem !important;
  }
  
  .rating-card .text-h6 {
    font-size: 1rem !important;
  }
  
  .rating-card .text-caption {
    font-size: 0.7rem !important;
    line-height: 1.2;
  }
}

@media (max-width: 600px) {
  .question-card {
    max-width: 100%;
    margin: 0 8px;
  }
  
  .rating-card {
    min-height: 80px;
    width: 100%;
    padding: 4px !important;
  }
  
  .rating-card .text-h5 {
    font-size: 1rem !important;
  }
  
  .rating-card .text-h6 {
    font-size: 0.875rem !important;
  }
  
  .rating-card .text-caption {
    font-size: 0.6rem !important;
    line-height: 1.1;
  }
}

/* Glassmorphism para la tarjeta principal - Rosa */
.glassmorphism-card {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 182, 193, 0.3);
  box-shadow: 0 8px 32px 0 rgba(233, 30, 99, 0.2);
}

.v-theme--dark .glassmorphism-card {
  background: rgba(233, 30, 99, 0.1) !important;
  border: 1px solid rgba(233, 30, 99, 0.3);
  box-shadow: 0 8px 32px 0 rgba(233, 30, 99, 0.2);
}

/* Glassmorphism para tarjetas de preguntas - Rosa */
.glassmorphism-question {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 182, 193, 0.4);
  box-shadow: 0 4px 16px 0 rgba(233, 30, 99, 0.15);
}

.v-theme--dark .glassmorphism-question {
  background: rgba(233, 30, 99, 0.08) !important;
  border: 1px solid rgba(233, 30, 99, 0.25);
  box-shadow: 0 4px 16px 0 rgba(233, 30, 99, 0.15);
}

/* Glassmorphism para tarjetas de resultados - Rosa */
.glassmorphism-result {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 182, 193, 0.4);
  box-shadow: 0 4px 16px 0 rgba(233, 30, 99, 0.2);
  transition: all 0.3s ease;
}

.glassmorphism-result:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px 0 rgba(233, 30, 99, 0.3);
  border: 1px solid rgba(255, 64, 129, 0.5);
}

.v-theme--dark .glassmorphism-result {
  background: rgba(233, 30, 99, 0.1) !important;
  border: 1px solid rgba(233, 30, 99, 0.3);
}

.v-theme--dark .glassmorphism-result:hover {
  box-shadow: 0 8px 25px 0 rgba(233, 30, 99, 0.3);
  border: 1px solid rgba(233, 30, 99, 0.5);
}

/* Glassmorphism para interpretación - Rosa */
.glassmorphism-interpretation {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 182, 193, 0.4);
  box-shadow: 0 4px 16px 0 rgba(233, 30, 99, 0.2);
}

.v-theme--dark .glassmorphism-interpretation {
  background: rgba(233, 30, 99, 0.08) !important;
  border: 1px solid rgba(233, 30, 99, 0.25);
  box-shadow: 0 4px 16px 0 rgba(233, 30, 99, 0.15);
}

/* Actualizar estilos de rating-card para glassmorphism - Rosa */
.rating-card {
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(255, 182, 193, 0.3) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  min-height: 120px;
  width: 100%;
}

.rating-card:hover:not(.selected) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(233, 30, 99, 0.1);
  background: rgba(255, 192, 203, 0.2) !important;
  border: 1px solid rgba(255, 64, 129, 0.4) !important;
}

.rating-card.selected {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 30px rgba(var(--v-theme-primary), 0.4) !important;
  border: 2px solid rgb(var(--v-theme-primary)) !important;
  z-index: 2;
  background: rgba(var(--v-theme-primary), 0.2) !important;
}

.v-theme--dark .rating-card {
  border: 1px solid rgba(233, 30, 99, 0.3) !important;
}

.v-theme--dark .rating-card:hover:not(.selected) {
  box-shadow: 0 8px 25px rgba(233, 30, 99, 0.2);
  background: rgba(233, 30, 99, 0.1) !important;
  border: 1px solid rgba(233, 30, 99, 0.4) !important;
}

/* Gradientes rosa para elementos especiales */
.pink-gradient {
  background: linear-gradient(135deg, #E91E63 0%, #F06292 100%);
}

.v-theme--dark .pink-gradient {
  background: linear-gradient(135deg, #F48FB1 0%, #F8BBD9 100%);
}

/* Efectos de brillo rosa */
.pink-glow {
  box-shadow: 0 0 20px rgba(233, 30, 99, 0.3);
  transition: all 0.3s ease;
}

.pink-glow:hover {
  box-shadow: 0 0 30px rgba(233, 30, 99, 0.5);
}

/* Animaciones para botones */
.animated-btn {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.animated-btn:hover::before {
  width: 300px;
  height: 300px;
}

/* Animación de pulso para botón inicial */
.pulse-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(233, 30, 99, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(233, 30, 99, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(233, 30, 99, 0);
  }
}

/* Animación de deslizamiento izquierda */
.slide-left:hover {
  transform: translateX(-5px);
  box-shadow: 5px 5px 15px rgba(233, 30, 99, 0.3);
}

/* Animación de deslizamiento derecha */
.slide-right:hover {
  transform: translateX(5px);
  box-shadow: -5px 5px 15px rgba(233, 30, 99, 0.3);
}

/* Animación de rebote para finalizar */
.bounce-btn:hover {
  animation: bounce 0.6s;
}

@keyframes bounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(-5px);
  }
}

/* Animación de rotación para reiniciar */
.rotate-btn:hover {
  transform: rotate(360deg);
  transition: transform 0.8s ease-in-out;
}

.rotate-btn .v-icon {
  transition: transform 0.8s ease-in-out;
}

.rotate-btn:hover .v-icon {
  transform: rotate(360deg);
}

/* Efectos adicionales para botones */
.animated-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(233, 30, 99, 0.3);
}

.animated-btn:active {
  transform: translateY(0);
  transition: all 0.1s;
}

/* Efectos para botones deshabilitados */
.animated-btn:disabled {
  opacity: 0.5;
  transform: none !important;
  animation: none !important;
}

.animated-btn:disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* Animación de carga para botones */
.animated-btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.3);
}

/* Efectos especiales para modo dark */
.v-theme--dark .animated-btn:hover {
  box-shadow: 0 8px 25px rgba(233, 30, 99, 0.3);
}

.v-theme--dark .pulse-btn {
  animation: pulseDark 2s infinite;
}

@keyframes pulseDark {
  0% {
    box-shadow: 0 0 0 0 rgba(233, 30, 99, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(233, 30, 99, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(233, 30, 99, 0);
  }
}

/* Alertas de progreso y emojis gigantes se manejan via JavaScript */

/* Explosión de emojis */
.rating-cards {
  position: relative;
  overflow: visible !important;
}

.rating-cards .v-row {
  position: relative;
  overflow: visible !important;
}

.rating-cards .v-col {
  position: relative;
  overflow: visible !important;
}

.emoji-explosion {
  position: fixed;
  font-size: 24px;
  pointer-events: none;
  z-index: 9999;
  animation: emojiExplosion var(--duration, 3s) ease-out forwards;
  user-select: none;
  transform: translate(-50%, -50%);
}

@keyframes emojiExplosion {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(var(--scale, 1)) rotate(var(--rotation, 0deg));
  }
  5% {
    opacity: 1;
    transform: translate(calc(-50% + var(--vx) * 0.1), calc(-50% + var(--vy) * 0.1)) scale(calc(var(--scale, 1) * 1.8)) rotate(calc(var(--rotation, 0deg) + 45deg));
  }
  15% {
    opacity: 1;
    transform: translate(calc(-50% + var(--vx) * 0.3), calc(-50% + var(--vy) * 0.3)) scale(calc(var(--scale, 1) * 1.4)) rotate(calc(var(--rotation, 0deg) + 120deg));
  }
  40% {
    opacity: 1;
    transform: translate(calc(-50% + var(--vx) * 0.6), calc(-50% + var(--vy) * 0.6)) scale(calc(var(--scale, 1) * 1.2)) rotate(calc(var(--rotation, 0deg) + 240deg));
  }
  70% {
    opacity: 0.9;
    transform: translate(calc(-50% + var(--vx) * 0.85), calc(-50% + var(--vy) * 0.85)) scale(calc(var(--scale, 1) * 1)) rotate(calc(var(--rotation, 0deg) + 300deg));
  }
  90% {
    opacity: 0.5;
    transform: translate(calc(-50% + var(--vx) * 1), calc(-50% + var(--vy) * 1 + 100px)) scale(calc(var(--scale, 1) * 0.8)) rotate(calc(var(--rotation, 0deg) + 360deg));
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--vx) * 1.1), calc(-50% + var(--vy) * 1.1 + 200px)) scale(calc(var(--scale, 1) * 0.2)) rotate(calc(var(--rotation, 0deg) + 420deg));
  }
}

/* Efecto adicional de brillo para emojis */
.emoji-explosion::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background: radial-gradient(circle, rgba(233, 30, 99, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: emojiGlow 2s ease-out;
  z-index: -1;
}

@keyframes emojiGlow {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0.5;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

/* Variaciones de explosión por tipo de emoji */
.emoji-explosion:nth-child(odd) {
  animation-duration: 1.8s;
}

.emoji-explosion:nth-child(even) {
  animation-duration: 2.2s;
}

.emoji-explosion:nth-child(3n) {
  animation-delay: 0.1s;
}

.emoji-explosion:nth-child(4n) {
  animation-delay: 0.2s;
}

/* Efectos especiales para diferentes emojis */
.emoji-explosion:contains('😍') {
  animation-duration: 2.5s;
  filter: drop-shadow(0 0 10px rgba(255, 105, 180, 0.8));
}

.emoji-explosion:contains('😊') {
  animation-duration: 2.3s;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
}

.emoji-explosion:contains('😐') {
  animation-duration: 2.0s;
  filter: drop-shadow(0 0 6px rgba(128, 128, 128, 0.4));
}

.emoji-explosion:contains('😕') {
  animation-duration: 1.9s;
  filter: drop-shadow(0 0 8px rgba(255, 140, 0, 0.6));
}

.emoji-explosion:contains('😡') {
  animation-duration: 1.7s;
  filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.8));
}

/* Onda de choque */
.shock-wave {
  position: fixed;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(233, 30, 99, 0.6);
  border-radius: 50%;
  pointer-events: none;
  animation: shockWave 1s ease-out forwards;
  transform: translate(-50%, -50%);
  z-index: 9998;
}

@keyframes shockWave {
  0% {
    width: 20px;
    height: 20px;
    opacity: 1;
    border-width: 4px;
    border-color: rgba(233, 30, 99, 0.8);
  }
  25% {
    width: 300px;
    height: 300px;
    opacity: 0.8;
    border-width: 3px;
    border-color: rgba(233, 30, 99, 0.6);
  }
  50% {
    width: 800px;
    height: 800px;
    opacity: 0.5;
    border-width: 2px;
    border-color: rgba(233, 30, 99, 0.4);
  }
  75% {
    width: 1200px;
    height: 1200px;
    opacity: 0.2;
    border-width: 1px;
    border-color: rgba(233, 30, 99, 0.2);
  }
  100% {
    width: 1600px;
    height: 1600px;
    opacity: 0;
    border-width: 1px;
    border-color: rgba(233, 30, 99, 0.1);
  }
}

/* Efectos adicionales para diferentes valores */
.rating-card.selected::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(233, 30, 99, 0.2) 0%, transparent 70%);
  border-radius: inherit;
  transform: translate(-50%, -50%);
  animation: cardGlow 0.6s ease-out;
  pointer-events: none;
  z-index: -1;
}

@keyframes cardGlow {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
  }
}

/* Vibración para la tarjeta seleccionada */
.rating-card.selected {
  animation: cardVibrate 0.3s ease-in-out;
}

@keyframes cardVibrate {
  0%, 100% {
    transform: translateY(-4px);
  }
  25% {
    transform: translateY(-4px) translateX(-2px);
  }
  50% {
    transform: translateY(-4px) translateX(2px);
  }
  75% {
    transform: translateY(-4px) translateX(-1px);
  }
}
</style>
