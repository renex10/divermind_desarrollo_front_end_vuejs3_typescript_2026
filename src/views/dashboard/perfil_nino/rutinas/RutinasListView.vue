<template>
 <!--  src\views\dashboard\perfil_nino\rutinas\RutinasListView.vue -->
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
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="filterStatus = 'all'"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        filterStatus === 'all' ? 'bg-primary-50 text-primary-700 font-medium' : '',
                        'group flex items-center w-full px-4 py-2 text-sm'
                      ]"
                    >
                      <CheckCircleIcon v-if="filterStatus === 'all'" class="mr-3 h-5 w-5 text-primary-600" />
                      <span class="ml-8" v-else></span>
                      Todas las rutinas
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="filterStatus = 'active'"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        filterStatus === 'active' ? 'bg-primary-50 text-primary-700 font-medium' : '',
                        'group flex items-center w-full px-4 py-2 text-sm'
                      ]"
                    >
                      <CheckCircleIcon v-if="filterStatus === 'active'" class="mr-3 h-5 w-5 text-primary-600" />
                      <span class="ml-8" v-else></span>
                      Activas
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="filterStatus = 'paused'"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        filterStatus === 'paused' ? 'bg-primary-50 text-primary-700 font-medium' : '',
                        'group flex items-center w-full px-4 py-2 text-sm'
                      ]"
                    >
                      <CheckCircleIcon v-if="filterStatus === 'paused'" class="mr-3 h-5 w-5 text-primary-600" />
                      <span class="ml-8" v-else></span>
                      Pausadas
                    </button>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="filterStatus = 'archived'"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        filterStatus === 'archived' ? 'bg-primary-50 text-primary-700 font-medium' : '',
                        'group flex items-center w-full px-4 py-2 text-sm'
                      ]"
                    >
                      <CheckCircleIcon v-if="filterStatus === 'archived'" class="mr-3 h-5 w-5 text-primary-600" />
                      <span class="ml-8" v-else></span>
                      Archivadas
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <Menu as="div" class="relative inline-block text-left">
            <MenuButton class="inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all">
              <AdjustmentsHorizontalIcon class="h-4 w-4 mr-2 text-gray-500" />
              Tipo
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
                  <MenuItem v-slot="{ active }">
                    <button
                      @click="filterType = null"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        filterType === null ? 'bg-primary-50 text-primary-700 font-medium' : '',
                        'group flex items-center w-full px-4 py-2 text-sm'
                      ]"
                    >
                      <CheckCircleIcon v-if="filterType === null" class="mr-3 h-5 w-5 text-primary-600" />
                      <span class="ml-8" v-else></span>
                      Todos los tipos
                    </button>
                  </MenuItem>
                  <MenuItem v-for="type in routineTypes" :key="type.value" v-slot="{ active }">
                    <button
                      @click="filterType = type.value"
                      :class="[
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        filterType === type.value ? 'bg-primary-50 text-primary-700 font-medium' : '',
                        'group flex items-center w-full px-4 py-2 text-sm'
                      ]"
                    >
                      <CheckCircleIcon v-if="filterType === type.value" class="mr-3 h-5 w-5 text-primary-600" />
                      <span class="ml-8" v-else></span>
                      {{ type.icon }} {{ type.label }}
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-3 py-2 text-sm font-medium transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              <Squares2X2Icon class="h-4 w-4" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-3 py-2 text-sm font-medium transition-colors border-l border-gray-300',
                viewMode === 'list'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              ]"
            >
              <ListBulletIcon class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="hasActiveFilters" class="mt-4 flex items-center gap-2">
        <span class="text-sm text-gray-600">Filtros activos:</span>
        <span
          v-if="search"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
        >
          Búsqueda: "{{ search }}"
          <button @click="search = ''" class="ml-2">
            <XMarkIcon class="h-3 w-3" />
          </button>
        </span>
        <span
          v-if="filterStatus !== 'all'"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
        >
          Estado: {{ getFilterLabel(filterStatus) }}
          <button @click="filterStatus = 'all'" class="ml-2">
            <XMarkIcon class="h-3 w-3" />
          </button>
        </span>
        <span
          v-if="filterType"
          class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
        >
          Tipo: {{ getTypeLabel(filterType) }}
          <button @click="filterType = null" class="ml-2">
            <XMarkIcon class="h-3 w-3" />
          </button>
        </span>
        <button
          @click="clearFilters"
          class="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Limpiar todos
        </button>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <div class="text-sm text-gray-600">
        <span class="font-medium text-gray-900">{{ filteredRoutines.length }}</span>
        {{ filteredRoutines.length === 1 ? 'rutina encontrada' : 'rutinas encontradas' }}
      </div>

      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-600">Ordenar por:</span>
        <Menu as="div" class="relative inline-block text-left">
          <MenuButton class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            {{ getSortLabel(sortBy) }}
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
            <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div class="py-1">
                <MenuItem v-for="option in sortOptions" :key="option.value" v-slot="{ active }">
                  <button
                    @click="sortBy = option.value"
                    :class="[
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      sortBy === option.value ? 'bg-primary-50 text-primary-700 font-medium' : '',
                      'group flex items-center w-full px-4 py-2 text-sm'
                    ]"
                  >
                    {{ option.label }}
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
        <p class="mt-4 text-gray-600">Cargando rutinas...</p>
      </div>
    </div>

    <TransitionGroup
      v-else-if="viewMode === 'grid' && sortedRoutines.length > 0"
      name="list"
      tag="div"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <RoutineCard 
        v-for="routine in sortedRoutines"
        :key="routine.id"
        :routine="routine"
        @view="openDetailDrawer(routine)"
        @edit="openEditModal(routine)"
        @duplicate="openCopyDialog(routine)"
        @toggle-status="handleToggleStatus(routine)"
        @delete="handleDelete(routine.id)"
      />
    </TransitionGroup>

    <div
      v-else-if="viewMode === 'list' && sortedRoutines.length > 0"
      class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rutina
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pasos
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Última vez
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="routine in sortedRoutines"
            :key="routine.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span class="text-white text-lg">{{ getRoutineIcon(routine.routine_type) }}</span>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">
                    {{ routine.name }}
                  </div>
                  <div class="text-sm text-gray-500">
                    Sin descripción
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary-100 text-primary-800">
                {{ routine.routine_type_display || getTypeLabel(routine.routine_type) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <RoutineStatusBadge :status="routine.status" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ routine.total_steps || 0 }} pasos
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(routine.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <Menu as="div" class="relative inline-block text-left">
                <MenuButton class="inline-flex items-center p-2 border border-transparent rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  <EllipsisVerticalIcon class="h-5 w-5 text-gray-400" />
                </MenuButton>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="openDetailDrawer(routine)"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'group flex items-center w-full px-4 py-2 text-sm'
                          ]"
                        >
                          <EyeIcon class="mr-3 h-5 w-5 text-gray-400" />
                          Ver detalles
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="openEditModal(routine)"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'group flex items-center w-full px-4 py-2 text-sm'
                          ]"
                        >
                          <PencilIcon class="mr-3 h-5 w-5 text-gray-400" />
                          Editar
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="openCopyDialog(routine)"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'group flex items-center w-full px-4 py-2 text-sm'
                          ]"
                        >
                          <DocumentDuplicateIcon class="mr-3 h-5 w-5 text-gray-400" />
                          Duplicar
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="handleToggleStatus(routine)"
                          :class="[
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'group flex items-center w-full px-4 py-2 text-sm'
                          ]"
                        >
                          <ArrowPathIcon class="mr-3 h-5 w-5 text-gray-400" />
                          {{ routine.status === 'active' ? 'Pausar' : 'Activar' }}
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="handleDelete(routine.id)"
                          :class="[
                            active ? 'bg-red-100 text-red-900' : 'text-red-700',
                            'group flex items-center w-full px-4 py-2 text-sm'
                          ]"
                        >
                          <TrashIcon class="mr-3 h-5 w-5 text-red-400" />
                          Archivar
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <EmptyState
      v-else-if="!loading && (routines.length > 0 && filteredRoutines.length === 0)"
      :has-filters="hasActiveFilters"
      @clear-filters="clearFilters"
      @create="$emit('create-routine')"
      title="No se encontraron rutinas"
      message="No hay rutinas que coincidan con tus filtros. Intenta ajustar la búsqueda."
    />
    
    <EmptyState
      v-else-if="!loading && routines.length === 0"
      :has-filters="false"
      @clear-filters="clearFilters"
      @create="$emit('create-routine')"
      title="Aún no hay rutinas"
      message="Comienza creando la primera plantilla de rutina para este niño."
    />

    <Teleport to="body">
      <TransitionRoot as="template" :show="selectedRoutineId !== null">
        <Dialog as="div" class="relative z-50" @close="selectedRoutineId = null">
          <TransitionChild
            as="template"
            enter="ease-in-out duration-500"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in-out duration-500"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-hidden">
            <div class="absolute inset-0 overflow-hidden">
              <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <TransitionChild
                  as="template"
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enter-from="translate-x-full"
                  enter-to="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leave-from="translate-x-0"
                  leave-to="translate-x-full"
                >
                  <DialogPanel class="pointer-events-auto w-screen max-w-2xl">
                    <RoutineDetailView
                      v-if="selectedRoutineId"
                      :routine-id="selectedRoutineId"
                      :child-id="childId"
                      @close="selectedRoutineId = null"
                      @updated="handleRoutineUpdated"
                      @edit="openEditModalFromDetail"
                    />
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Teleport>

    <RoutineCopyDialog
      v-if="copyingRoutineId"
      :routine-id="copyingRoutineId"
      :child-id="numericChildId"
      :original-routine-name="getRoutineName(copyingRoutineId)"
      @update:open="handleCopyDialogClose"
      @cloned="handleRoutineCopied"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
// Importar el tipo correcto desde el archivo de tipos
import type { DailyRoutineList } from '@/type/rutinas/rutinas'
import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

// Headless UI
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Dialog,
  DialogPanel,
  TransitionRoot,
  TransitionChild
} from '@headlessui/vue'

// Heroicons
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  Squares2X2Icon,
  ListBulletIcon,
  CheckCircleIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  ArrowPathIcon,
  TrashIcon,
  EllipsisVerticalIcon
} from '@heroicons/vue/24/outline'

// Componentes
import RoutineCard from '@/components/gestion/rutinas/core/RoutineCard.vue'
import RoutineStatusBadge from '@/components/gestion/rutinas/core/RoutineStatusBadge.vue'
import RoutineDetailView from '@/views/dashboard/perfil_nino/rutinas/RoutineDetailView.vue'
import RoutineCopyDialog from '@/components/gestion/rutinas/core/RoutineCopyDialog.vue'
import EmptyState from '@/components/gestion/rutinas/shared/EmptyState.vue'

// ========================================
// PROPS & EMITS
// ========================================

// Este componente recibe la lista de rutinas desde su padre (RutinasView.vue)
const props = defineProps<{
  routines: DailyRoutineList[]
  loading: boolean
  childId: number | string
  listRefreshKey: number // Prop para forzar recarga
}>()

// Emite eventos al padre (RutinasView.vue) para que este maneje la lógica
const emit = defineEmits<{
  (e: 'select-routine', routine: DailyRoutineList): void
  (e: 'edit-routine', routine: DailyRoutineList): void
  (e: 'delete-routine', id: number | string): void
  (e: 'toggle-status', routine: DailyRoutineList): void
  (e: 'create-routine'): void
  (e: 'refresh-list'): void
}>()

// ========================================
// STATE (Estado Local)
// ========================================
const search = ref('')
const filterStatus = ref('all') // 'all', 'active', 'paused', 'archived'
const filterType = ref<string | null>(null)
const viewMode = ref('grid') // 'grid' | 'list'
const sortBy = ref('updated_at') // 'name', 'created_at', 'updated_at', 'routine_type'
const selectedRoutineId = ref<number | string | null>(null) // Para el drawer de detalle
const copyingRoutineId = ref<number | null>(null) // Para el modal de clonar

// ========================================
// DATOS ESTÁTICOS (Opciones de Filtros)
// ========================================
const routineTypes = [
  { value: 'morning', label: 'Mañana', icon: '🌅' },
  { value: 'bedtime', label: 'Noche', icon: '🌙' },
  { value: 'mealtime', label: 'Comida', icon: '🍽️' },
  { value: 'homework', label: 'Tareas', icon: '✏️' },
  { value: 'school_prep', label: 'Preparación escuela', icon: '🎒' },
  { value: 'therapy_session', label: 'Terapia', icon: '🧠' },
  { value: 'other', label: 'Otra', icon: '📋' }
]

const sortOptions = [
  { value: 'name', label: 'Nombre (A-Z)' },
  { value: 'updated_at', label: 'Recién actualizada' },
  { value: 'created_at', label: 'Recién creada' },
  { value: 'routine_type', label: 'Tipo de rutina' }
]

// ========================================
// COMPUTED (Propiedades Calculadas)
// ========================================

// Devuelve 'true' si algún filtro (búsqueda, estado, tipo) está activo
const hasActiveFilters = computed(() => {
  return search.value !== '' || filterStatus.value !== 'all' || filterType.value !== null
})

// 1. Filtra las rutinas basado en el estado local (search, filterStatus, filterType)
const filteredRoutines = computed(() => {
  if (!props.routines) return []
  
  return props.routines.filter(routine => {
    // Filtro por estado
    if (filterStatus.value !== 'all' && routine.status !== filterStatus.value) {
      return false
    }

    // Filtro por tipo
    if (filterType.value && routine.routine_type !== filterType.value) {
      return false
    }

    // Filtro por búsqueda
    if (search.value) {
      const searchTerm = search.value.toLowerCase()
      const nameMatch = routine.name?.toLowerCase().includes(searchTerm)
      const typeMatch = routine.routine_type.toLowerCase().includes(searchTerm)
      // Nota: DailyRoutineList no tiene description, por eso se elimina esta línea
      // const descMatch = routine.description?.toLowerCase().includes(searchTerm)
      return nameMatch || typeMatch
    }

    // Si pasa todos los filtros, se incluye
    return true
  })
})

// 2. Ordena las rutinas ya filtradas
const sortedRoutines = computed(() => {
  const routines = [...filteredRoutines.value] // Copia para no mutar la computada anterior
  
  switch (sortBy.value) {
    case 'name':
      return routines.sort((a, b) => a.name.localeCompare(b.name))
    case 'created_at':
      return routines.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    case 'routine_type':
      return routines.sort((a, b) => a.routine_type.localeCompare(b.routine_type))
    case 'updated_at': // Por defecto
    default:
      return routines.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }
})

// ========================================
// WATCHERS (Observadores)
// ========================================
// Observa la prop 'listRefreshKey'. Si el padre la incrementa,
// significa que se creó/editó algo y debemos recargar.
watch(() => props.listRefreshKey, () => {
  console.log("RutinaList: 'listRefreshKey' cambió, emitiendo 'refresh-list'")
  // Emite el evento refresh-list que el padre (RutinasView) debe escuchar
  // para llamar a su propia función `loadRoutines`
  emit('refresh-list')
})

// ========================================
// MÉTODOS (Manejadores de Eventos)
// ========================================

// --- Acciones del Template ---
function openDetailDrawer(routine: DailyRoutineList) {
  console.log('Abriendo detalle para:', routine.id)
  selectedRoutineId.value = routine.id
  // ⛔️ NO emitimos, este componente maneja su propio drawer de detalle
}

function openEditModal(routine: DailyRoutineList) {
  console.log('Solicitando edición para:', routine.id)
  // ✅ EMITIMOS al padre (RutinasView) para que él abra el Wizard/Editor
  emit('edit-routine', routine)
}

function openCopyDialog(routine: DailyRoutineList) {
  console.log('Abriendo diálogo de clonar para:', routine.id)
  copyingRoutineId.value = typeof routine.id === 'string' ? parseInt(routine.id, 10) : routine.id
  // ⛔️ NO emitimos, este componente maneja su propio modal de clonar
}

function handleToggleStatus(routine: DailyRoutineList) {
  console.log('Solicitando cambio de estado para:', routine.id)
  // ✅ EMITIMOS al padre para que maneje la lógica API
  emit('toggle-status', routine)
}

function handleDelete(routineId: number | string) {
  console.log('Solicitando borrado para:', routineId)
  // ✅ EMITIMOS al padre para que muestre ConfirmModal
  emit('delete-routine', routineId)
}

function clearFilters() {
  search.value = ''
  filterStatus.value = 'all'
  filterType.value = null
}

// --- Callbacks de Modales Locales ---
function handleRoutineUpdated() {
  console.log('Rutina actualizada (recibido desde DetailView)')
  selectedRoutineId.value = null // Cierra el drawer
  emit('refresh-list') // Emite al padre para recargar la lista
}

function handleRoutineCopied() {
  console.log('Rutina clonada exitosamente')
  copyingRoutineId.value = null // Cierra el modal
  emit('refresh-list') // Emite al padre para recargar la lista
}

function openEditModalFromDetail(routine: DailyRoutineList) {
  selectedRoutineId.value = null // Cierra el drawer de detalle
  // Espera un poco para que la animación del drawer termine
  setTimeout(() => {
    emit('edit-routine', routine) // Emite al padre para abrir el editor
  }, 300)
}

// --- Helpers de Template ---
function getFilterLabel(status: string) {
  const labels: Record<string, string> = {
    all: 'Estado: Todos',
    active: 'Estado: Activas',
    paused: 'Estado: Pausadas',
    archived: 'Estado: Archivadas'
  }
  return labels[status] || 'Estado'
}

function getTypeLabel(type: string | null) {
  if (!type) return 'Todos los tipos'
  return routineTypes.find(t => t.value === type)?.label || type
}

function getSortLabel(sortKey: string) {
  return sortOptions.find(o => o.value === sortKey)?.label || 'Ordenar por'
}

function getRoutineIcon(type: string) {
  return routineTypes.find(t => t.value === type)?.icon || '📋'
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Nunca'
  try {
    // Muestra "hace X tiempo" para fechas recientes, o fecha normal para antiguas
    const date = parseISO(dateString)
    const now = new Date()
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) { // 7 días
      return formatDistanceToNow(date, { addSuffix: true, locale: es })
    }
    return format(date, 'dd MMM yyyy', { locale: es })
  } catch (e) {
    console.error("Error formateando fecha:", dateString, e)
    return 'Fecha inválida'
  }
}

const numericChildId = computed<number>(() => {
  // Asegura que siempre pasamos un número al componente hijo (RoutineDetailView)
  return typeof props.childId === 'string' ? Number(props.childId) : props.childId
})

function getRoutineName(routineId: number | null): string {
  if (!routineId) return ''
  const routine = props.routines.find(r => {
    const id = typeof r.id === 'string' ? parseInt(r.id, 10) : r.id
    return id === routineId
  })
  return routine?.name || 'Rutina'
}

function handleCopyDialogClose(open: boolean) {
  if (!open) {
    copyingRoutineId.value = null
  }
}
</script>

<style scoped>
/* Estilos para la animación de la lista */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
/* Asegura que los elementos que se van no rompan el layout */
.list-leave-active {
  position: absolute;
}

/* Estilos de botones */
.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200;
}
.btn-secondary {
   @apply px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors;
}

/* Estilos de Card y Tabla (ya presentes en tus otros archivos) */
.shadow-soft {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
}
.shadow-medium {
   box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07);
}
.text-error-600 { color: #DC2626; } /* Tailwind red-600 */
.hover\:bg-error-50:hover { background-color: #FEF2F2; } /* Tailwind red-50 */
</style>