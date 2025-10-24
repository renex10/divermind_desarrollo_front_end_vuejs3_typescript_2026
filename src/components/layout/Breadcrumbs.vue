<template>
  <nav class="text-sm font-medium" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2 text-gray-500">
      
      <li v-for="(crumb, index) in crumbs" :key="index">
        <div class="flex items-center">
          
          <svg
            v-if="index > 0"
            class="h-5 w-5 flex-shrink-0 text-gray-300 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
          </svg>
          
          <router-link
            v-if="index < crumbs.length - 1"
            :to="crumb.to"
            class="hover:text-gray-700 hover:underline"
          >
            {{ crumb.label }}
          </router-link>

          <span
            v-else
            class="font-semibold text-gray-700"
            aria-current="page"
          >
            {{ crumb.label }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, type RouteLocationNormalized } from 'vue-router'
// Opcional: Importa tu store si necesitas nombres dinámicos
// import { useChildStore } from '@/store/childStore'

const route = useRoute()
// const childStore = useChildStore() // Descomenta si usas el store

interface Crumb {
  label: string;
  to: { name: string; params?: Record<string, any> };
}

// La lógica principal está en esta propiedad computada
const crumbs = computed(() => {
  
  // 1. Obtenemos todas las rutas "padre" e "hija" activas
  const matchedRoutes = route.matched

  const processedCrumbs: Crumb[] = matchedRoutes
    // 2. Filtramos solo las que tengan la propiedad 'meta.breadcrumb'
    .filter(r => r.meta && r.meta.breadcrumb)
    // 3. Mapeamos cada ruta a un objeto Crumb
    .map(r => {
      // 4. Resolvemos el texto de la miga
      const label = typeof r.meta.breadcrumb === 'function'
        ? (r.meta.breadcrumb as (route: RouteLocationNormalized) => string)(route) // Resuelve breadcrumb dinámico (ej. Perfil Niño #123)
        : r.meta.breadcrumb as string

      return {
        label: label,
        to: { 
          name: r.name as string, 
          params: route.params // Pasamos los params de la ruta actual
        }
      }
    })

  // 5. (Opcional) Lógica para nombres dinámicos desde un store
  //    Esto reemplaza etiquetas genéricas como "Perfil Niño #123"
  //    por nombres reales como "Perfil de Juan Pérez"
  
  // return processedCrumbs.map(crumb => {
  //   if (crumb.to.name === 'perfil-nino-layout' && childStore.currentChildName) {
  //     return {
  //       ...crumb,
  //       label: `Perfil de ${childStore.currentChildName}`
  //     }
  //   }
  //   return crumb
  // })
  
  // Devuelve las migas procesadas (sin el paso 5 opcional por ahora)
  return processedCrumbs
})
</script>