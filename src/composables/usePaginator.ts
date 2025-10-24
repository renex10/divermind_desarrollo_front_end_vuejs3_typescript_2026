// src/composables/usePaginator.ts
import { ref, computed, watch, readonly } from 'vue'

interface PaginationState {
  currentPage: number
  pageSize: number
  totalItems: number
}

interface PaginationOptions {
  initialPage?: number
  initialPageSize?: number
  totalItems?: number
  onPageChange?: (page: number) => void
}

export function usePaginator(options: PaginationOptions = {}) {
  const {
    initialPage = 1,
    initialPageSize = 10,
    totalItems = 0,
    onPageChange
  } = options

  // Estado reactivo (sin totalPages aquí)
  const state = ref<PaginationState>({
    currentPage: initialPage,
    pageSize: initialPageSize,
    totalItems
  })

  // totalPages como computed separado
  const totalPages = computed(() => 
    Math.ceil(state.value.totalItems / state.value.pageSize) || 1
  )

  // Computed properties
  const paginationInfo = computed(() => ({
    currentPage: state.value.currentPage,
    pageSize: state.value.pageSize,
    totalItems: state.value.totalItems,
    totalPages: totalPages.value,
    startIndex: (state.value.currentPage - 1) * state.value.pageSize,
    endIndex: Math.min(state.value.currentPage * state.value.pageSize, state.value.totalItems),
    hasPrevious: state.value.currentPage > 1,
    hasNext: state.value.currentPage < totalPages.value,
    isFirstPage: state.value.currentPage === 1,
    isLastPage: state.value.currentPage === totalPages.value
  }))

  const pageRange = computed(() => {
    const delta = 2
    const range: (number | string)[] = []
    const total = totalPages.value
    const current = state.value.currentPage

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i)
    }

    if (current - delta > 2) {
      range.unshift('...')
    }
    if (current + delta < total - 1) {
      range.push('...')
    }

    range.unshift(1)
    if (total !== 1) {
      range.push(total)
    }

    return range
  })

  // Métodos
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value && page !== state.value.currentPage) {
      state.value.currentPage = page
      onPageChange?.(page)
    }
  }

  const goToNext = () => {
    if (paginationInfo.value.hasNext) {
      goToPage(state.value.currentPage + 1)
    }
  }

  const goToPrevious = () => {
    if (paginationInfo.value.hasPrevious) {
      goToPage(state.value.currentPage - 1)
    }
  }

  const goToFirst = () => {
    goToPage(1)
  }

  const goToLast = () => {
    goToPage(totalPages.value)
  }

  const setPageSize = (size: number) => {
    state.value.pageSize = Math.max(1, size)
    state.value.currentPage = 1
    onPageChange?.(1)
  }

  const setTotalItems = (total: number) => {
    state.value.totalItems = Math.max(0, total)
    // Adjust current page if it's beyond the new total
    if (state.value.currentPage > totalPages.value && totalPages.value > 0) {
      state.value.currentPage = totalPages.value
      onPageChange?.(state.value.currentPage)
    }
  }

  const reset = (newOptions?: Partial<PaginationOptions>) => {
    state.value.currentPage = newOptions?.initialPage || initialPage
    state.value.pageSize = newOptions?.initialPageSize || initialPageSize
    state.value.totalItems = newOptions?.totalItems || totalItems
  }

  // Watch for external totalItems changes
  watch(
    () => totalItems,
    (newTotal) => {
      setTotalItems(newTotal)
    }
  )

  return {
    // State
    state: readonly(state),
    
    // Computed
    paginationInfo,
    pageRange,
    totalPages,
    
    // Methods
    goToPage,
    goToNext,
    goToPrevious,
    goToFirst,
    goToLast,
    setPageSize,
    setTotalItems,
    reset
  }
}

// Tipo de retorno para TypeScript
export type UsePaginatorReturn = ReturnType<typeof usePaginator>