<template>
  <div class="routines-list-padre p-4">
    <div v-if="loading" class="flex justify-center py-10">
      <div class="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="rutina in routines" :key="rutina.id" class="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div class="flex justify-between items-start mb-4">
          <span class="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full">
            {{ rutina.routine_type_display }}
          </span>
          <span :class="['text-[10px] font-bold px-2 py-1 rounded-lg', rutina.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400']">
            {{ rutina.is_active ? 'ACTIVA' : 'PAUSADA' }}
          </span>
        </div>
        
        <h3 class="text-lg font-black text-gray-900 mb-2">{{ rutina.name }}</h3>
        <p class="text-gray-500 text-xs line-clamp-2 mb-6">{{ rutina.description }}</p>

        <div class="flex items-center justify-between border-t border-gray-50 pt-4">
          <span class="text-[10px] text-gray-400 font-bold uppercase">{{ rutina.total_steps }} Pasos</span>
          <router-link 
            :to="{ name: 'parent-rutina-ejecutar', params: { routineId: rutina.id } }"
            class="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <PlayIcon class="w-4 h-4" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PlayIcon } from '@heroicons/vue/24/solid'

defineProps<{
  routines: any[],
  loading: boolean
}>()
</script>