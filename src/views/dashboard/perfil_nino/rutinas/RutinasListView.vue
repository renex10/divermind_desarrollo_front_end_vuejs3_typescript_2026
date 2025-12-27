<template>
  <div class="rutinas-list-view">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="flex-1 max-w-md">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
            </div>
            <input
              v-model="search"
              type="text"
              placeholder="Buscar rutina por nombre..."
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
            />
            <button
              v-if="search"
              @click="search = ''"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <XMarkIcon class="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <Menu as="div" class="relative inline-block text-left">
            <MenuButton class="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all">
              <FunnelIcon class="h-4 w-4 mr-2 text-gray-500" />
              {{ getFilterLabel(filterStatus) }}
              <ChevronDownIcon class="ml-2 h-4 w-4 text-gray-500" />
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-for="status in ['all', 'active', 'paused', 'archived']" :key="status" v-slot="{ active }">
                    <button
                      @click="filterStatus = status"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        filterStatus === status ? 'bg-primary-50 text-primary-700 font-medium' : '',
                        'group flex items-center w-full px-4 py-2 text-sm'
                      ]"
                    >
                      <CheckCircleIcon v-if="filterStatus === status" class="mr-3 h-5 w-5 text-primary-600" />
                      <span class="ml-8" v-else></span>
                      {{ getFilterLabel(status).replace('Estado: ', '') }}
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button @click="viewMode = 'grid'" :class="['px-3 py-2 transition-colors', viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700 hover:bg-gray-50']">
              <Squares2X2Icon class="h-4 w-4" />
            </button>
            <button @click="viewMode = 'list'" :class="['px-3 py-2 transition-colors border-l border-gray-300', viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'bg-white text-gray-700 hover:bg-gray-50']">
              <ListBulletIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <div class="text-sm text-gray-600">
        <span class="font-medium text-gray-900">{{ filteredRoutines?.length || 0 }}</span>
        {{ (filteredRoutines?.length || 0) === 1 ? 'rutina encontrada' : 'rutinas encontradas' }}
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600 font-medium">Cargando rutinas...</p>
      </div>
    </div>

    <template v-else>
      <TransitionGroup
        v-if="viewMode === 'grid' && sortedRoutines?.length > 0"
        name="list" tag="div" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <RoutineCard 
          v-for="routine in sortedRoutines" :key="routine.id" :routine="routine"
          @view="openDetailDrawer(routine)" @edit="openEditModal(routine)"
          @duplicate="openCopyDialog(routine)" @toggle-status="handleToggleStatus(routine)"
          @delete="handleDelete(routine.id)"
        />
      </TransitionGroup>

      <div v-else-if="viewMode === 'list' && sortedRoutines?.length > 0" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rutina</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pasos</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Última vez</th>
              <th class="relative px-6 py-3"><span class="sr-only">Acciones</span></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="routine in sortedRoutines" :key="routine.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center font-medium text-gray-900">
                  <span class="mr-3 text-lg">{{ getRoutineIcon(routine.routine_type) }}</span>
                  {{ routine.name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap"><RoutineStatusBadge :status="routine.status" /></td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ routine.total_steps || 0 }} pasos</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(routine.created_at) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openDetailDrawer(routine)" class="text-primary-600 hover:text-primary-900 font-bold">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <EmptyState
        v-else-if="routines?.length > 0 && (filteredRoutines?.length || 0) === 0"
        :has-filters="true" @clear-filters="clearFilters" @create="$emit('create-routine')"
        title="Sin coincidencias" message="No hay rutinas que coincidan con tu búsqueda."
      />
      <EmptyState
        v-else @create="$emit('create-routine')"
        title="Aún no hay rutinas" message="Comienza creando la primera rutina para este niño."
      />
    </template>

    <Teleport to="body">
      <TransitionRoot as="template" :show="selectedRoutineId !== null">
        <Dialog as="div" class="relative z-50" @close="selectedRoutineId = null">
          <TransitionChild as="template" enter="ease-in-out duration-500" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-500" leave-from="opacity-100" leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
          </TransitionChild>
          <div class="fixed inset-0 overflow-hidden">
            <div class="absolute inset-0 overflow-hidden">
              <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <TransitionChild as="template" enter="transform transition duration-500" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition duration-500" leave-from="translate-x-0" leave-to="translate-x-full">
                  <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                    <RoutineDetailView v-if="selectedRoutineId" :id="selectedRoutineId" :routine-id="selectedRoutineId" :child-id="numericChildId" @close="selectedRoutineId = null" @updated="handleRoutineUpdated" @edit="openEditModalFromDetail" />
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>

    <RoutineCopyDialog v-if="copyingRoutineId" :routine-id="copyingRoutineId" :child-id="numericChildId" :original-routine-name="getRoutineName(copyingRoutineId)" @update:open="handleCopyDialogClose" @cloned="handleRoutineCopied" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { DailyRoutineList } from '@/type/rutinas/rutinas'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// UI
import { Menu, MenuButton, MenuItem, MenuItems, Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { MagnifyingGlassIcon, FunnelIcon, ChevronDownIcon, Squares2X2Icon, ListBulletIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'

// Componentes
import RoutineCard from '@/components/gestion/rutinas/core/RoutineCard.vue'
import RoutineStatusBadge from '@/components/gestion/rutinas/core/RoutineStatusBadge.vue'
import RoutineDetailView from '@/views/dashboard/perfil_nino/rutinas/RoutineDetailView.vue'
import RoutineCopyDialog from '@/components/gestion/rutinas/core/RoutineCopyDialog.vue'
import EmptyState from '@/components/gestion/rutinas/shared/EmptyState.vue'

// ========================================
// ✅ PROPS ACTUALIZADAS: withDefaults para evitar Errores de Undefined
// ========================================
const props = withDefaults(defineProps<{
  routines?: DailyRoutineList[]
  loading?: boolean
  childId: number | string
  listRefreshKey?: number
}>(), {
  routines: () => [],
  loading: false,
  listRefreshKey: 0
})

const emit = defineEmits<{
  (e: 'select-routine', routine: DailyRoutineList): void
  (e: 'edit-routine', routine: DailyRoutineList): void
  (e: 'delete-routine', id: number | string): void
  (e: 'toggle-status', routine: DailyRoutineList): void
  (e: 'create-routine'): void
  (e: 'refresh-list'): void
}>()

const search = ref('')
const filterStatus = ref('all')
const viewMode = ref('grid')
const selectedRoutineId = ref<number | string | null>(null)
const copyingRoutineId = ref<number | null>(null)

const routineTypes = [
  { value: 'morning', label: 'Mañana', icon: '🌅' },
  { value: 'bedtime', label: 'Noche', icon: '🌙' },
  { value: 'other', label: 'Otra', icon: '📋' }
]

// Filtrado seguro
const filteredRoutines = computed(() => {
  const list = props.routines || []
  return list.filter(r => {
    if (filterStatus.value !== 'all' && r.status !== filterStatus.value) return false
    if (search.value) return r.name?.toLowerCase().includes(search.value.toLowerCase())
    return true
  })
})

const sortedRoutines = computed(() => {
  const list = [...(filteredRoutines.value || [])]
  return list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
})



// Métodos
function openDetailDrawer(r: DailyRoutineList) { selectedRoutineId.value = r.id }
function openEditModal(r: DailyRoutineList) { emit('edit-routine', r) }
function openCopyDialog(r: DailyRoutineList) { copyingRoutineId.value = Number(r.id) }
function handleToggleStatus(r: DailyRoutineList) { emit('toggle-status', r) }
function handleDelete(id: number | string) { emit('delete-routine', id) }
function clearFilters() { search.value = ''; filterStatus.value = 'all' }
function handleRoutineUpdated() { selectedRoutineId.value = null; emit('refresh-list') }
function handleRoutineCopied() { copyingRoutineId.value = null; emit('refresh-list') }
function openEditModalFromDetail(r: DailyRoutineList) { selectedRoutineId.value = null; setTimeout(() => emit('edit-routine', r), 300) }

// Helpers
function getFilterLabel(s: string) {
  const labels: any = { all: 'Estado: Todos', active: 'Estado: Activas', paused: 'Estado: Pausadas', archived: 'Estado: Archivadas' }
  return labels[s] || 'Estado'
}
function getRoutineIcon(t: string) { return routineTypes.find(opt => opt.value === t)?.icon || '📋' }
function formatDate(d: string | null) { return d ? format(parseISO(d), 'dd MMM yyyy', { locale: es }) : 'Nunca' }
const numericChildId = computed(() => Number(props.childId))
function getRoutineName(id: number | null) { return props.routines.find(r => Number(r.id) === id)?.name || 'Rutina' }
function handleCopyDialogClose(open: boolean) { if (!open) copyingRoutineId.value = null }

watch(() => props.listRefreshKey, () => emit('refresh-list'))
</script>

<style scoped>
.list-move, .list-enter-active, .list-leave-active { transition: all 0.5s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(20px); }
.list-leave-active { position: absolute; }

.shadow-soft { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05); }
.text-error-600 { color: #DC2626; }
.hover\:bg-error-50:hover { background-color: #FEF2F2; }
</style>