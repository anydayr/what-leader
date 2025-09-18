/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#E91E63', // Rosa principal
          secondary: '#F06292', // Rosa secundario
          accent: '#FF4081', // Rosa accent vibrante
          error: '#F44336',
          warning: '#FF9800',
          info: '#2196F3',
          success: '#4CAF50',
          background: 'transparent',
          surface: 'rgba(255, 255, 255, 0.1)',
        },
      },
      dark: {
        colors: {
          primary: '#E91E63', // Rosa principal igual que light
          secondary: '#F06292', // Rosa secundario igual que light
          accent: '#FF4081', // Rosa accent igual que light
          error: '#EF5350',
          warning: '#FFA726',
          info: '#42A5F5',
          success: '#81C784',
          background: 'transparent',
          surface: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
})
