import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#3f51b5',
          secondary: '#b0bec5',
          accent: '#8c9eff',
          background: '#f5f5f5'
        },
      },
      dark: {
        colors: {
          primary: '#7986cb',
          secondary: '#546e7a',
          accent: '#82b1ff',
          surface: '#212121'
        },
      },
    },
  },
})

const app = createApp(App)
app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
