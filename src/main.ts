// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/style.css'

// Pinia
import { createPinia } from 'pinia'

// FormKit
import { plugin, defaultConfig } from '@formkit/vue'
import '@formkit/themes/genesis'
// Si tienes un archivo de configuración personalizada de FormKit, puedes importarlo aquí:
// import formKitConfig from './formkit.config'

// Crear la app
const app = createApp(App)
const pinia = createPinia()

app
  .use(pinia)
  .use(router)
  .use(plugin, defaultConfig) // <-- Esto registra <FormKit /> globalmente

// Montar la app
app.mount('#app')


