import { ref, onMounted, onUnmounted } from 'vue'
import soundtrackUrl from '@/assets/soundtrack.mp3'

// Estado global del audio
const isPlaying = ref(false)
let audio: HTMLAudioElement | null = null

export function useAudio() {
  const initAudio = () => {
    if (audio) return // Ya está inicializado
    
    audio = new Audio(soundtrackUrl)
    audio.loop = true
    audio.volume = 0.5 // Volumen moderado
    
    // Event listeners para manejar el estado
    audio.addEventListener('play', () => {
      isPlaying.value = true
    })
    
    audio.addEventListener('pause', () => {
      isPlaying.value = false
    })
    
    audio.addEventListener('ended', () => {
      isPlaying.value = false
    })
  }

  const toggleSound = () => {
    if (!audio) {
      initAudio()
    }
    
    if (isPlaying.value) {
      audio?.pause()
    } else {
      audio?.play().catch(error => {
        console.error('Error playing audio:', error)
      })
    }
  }

  const playSound = () => {
    if (!audio) {
      initAudio()
    }
    
    audio?.play().catch(error => {
      console.error('Error playing audio:', error)
    })
  }

  const pauseSound = () => {
    audio?.pause()
  }

  const setVolume = (volume: number) => {
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, volume))
    }
  }

  // Inicializar audio cuando se monta el composable
  onMounted(() => {
    initAudio()
    
    // Intentar reproducir automáticamente
    setTimeout(() => {
      audio?.play().catch(error => {
        console.error('Error playing audio on mount:', error)
        // En algunos navegadores, la reproducción automática puede estar bloqueada
      })
    }, 1000) // Pequeño delay para asegurar que todo esté cargado
  })

  // Limpiar cuando se desmonta
  onUnmounted(() => {
    if (audio) {
      audio.pause()
      audio = null
    }
  })

  return {
    isPlaying,
    toggleSound,
    playSound,
    pauseSound,
    setVolume,
    initAudio
  }
}
