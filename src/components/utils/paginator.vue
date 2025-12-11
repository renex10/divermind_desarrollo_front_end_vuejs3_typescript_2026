<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
    <div class="flex items-center gap-2 text-sm text-gray-700">
      <span>Mostrando</span>
      <span class="font-medium">{{ paginationInfo.startIndex + 1 }}</span>
      <span>a</span>
      <span class="font-medium">{{ paginationInfo.endIndex }}</span>
      <span>de</span>
      <span class="font-medium">{{ paginationInfo.totalItems }}</span>
      <span>resultados</span>
    </div>

    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 mr-4">
        <label for="pageSize" class="text-sm text-gray-700">Mostrar:</label>
        <select
          id="pageSize"
          :value="paginationInfo.pageSize"
          @change="handlePageSizeChange($event)"
          class="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <nav class="flex items-center gap-1">
        <button
          @click="goToFirst"
          :disabled="paginationInfo.isFirstPage"
          class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Primera página"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>

        <button
          @click="goToPrevious"
          :disabled="!paginationInfo.hasPrevious"
          class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Página anterior"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>

        <div class="hidden sm:flex items-center gap-1">
          <button
            v-for="(page, index) in pageRange"
            :key="index"
            @click="page !== '...' ? goToPage(page as number) : null"
            :class="[
              'min-w-8 h-8 px-2 text-sm font-medium rounded-md transition-colors',
              page === '...' 
                ? 'text-gray-500 cursor-default' 
                : page === paginationInfo.currentPage
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100 border border-gray-300'
            ]"
            :disabled="page === '...'"
          >
            {{ page }}
          </button>
        </div>

        <button
          @click="goToNext"
          :disabled="!paginationInfo.hasNext"
          class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Página siguiente"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>

        <button
          @click="goToLast"
          :disabled="paginationInfo.isLastPage"
          class="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Última página"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePaginator, type UsePaginatorReturn } from '@/composables/usePaginator'
import { watch } from 'vue'

interface Props {
  currentPage?: number
  pageSize?: number
  totalItems: number
  // ✅ Nueva prop para opciones personalizadas (Default: [10, 25, 50, 100])
  pageSizeOptions?: number[] 
  onPageChange?: (page: number) => void
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  pageSize: 10,
  pageSizeOptions: () => [10, 25, 50, 100] // Valor por defecto estándar
})

const emit = defineEmits<{
  'page-change': [page: number]
  'page-size-change': [size: number]
}>()

const {
  paginationInfo,
  pageRange,
  goToPage,
  goToNext,
  goToPrevious,
  goToFirst,
  goToLast,
  setPageSize,
  setTotalItems
}: UsePaginatorReturn = usePaginator({
  initialPage: props.currentPage,
  initialPageSize: props.pageSize,
  totalItems: props.totalItems,
  onPageChange: (page: number) => {
    emit('page-change', page)
    props.onPageChange?.(page)
  }
})

const handlePageSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newSize = parseInt(target.value, 10)
  setPageSize(newSize)
  emit('page-size-change', newSize)
}

watch(() => props.totalItems, (newTotal: number) => setTotalItems(newTotal))
watch(() => props.currentPage, (newPage: number) => {
  if (newPage !== paginationInfo.value.currentPage) goToPage(newPage)
})
watch(() => props.pageSize, (newSize: number) => {
  if (newSize !== paginationInfo.value.pageSize) setPageSize(newSize)
})
</script>