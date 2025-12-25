<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
    <div class="text-center mb-8 space-y-3">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 mb-4 animate-bounce-soft">
        <LightBulbIcon class="w-8 h-8 text-primary-600" />
      </div>
      <h3 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Estrategias de Apoyo</h3>
      <p class="text-base text-gray-600 max-w-2xl mx-auto">
        Configura el nivel de flexibilidad y añade apoyos específicos para el éxito de la rutina.
      </p>
    </div>

    <div class="space-y-8">
      <section class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-primary-50 to-primary-100/50 border-b border-primary-200">
          <h4 class="text-base font-bold text-primary-900 flex items-center gap-2">
            <AdjustmentsHorizontalIcon class="w-5 h-5" /> Configuración de Adaptabilidad
          </h4>
        </div>
        <div class="p-6 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="select"
              label="Nivel de Flexibilidad"
              v-model="strategiesConfig.flexibility_level"
              :options="[
                { value: 'low', label: 'Baja (Estructura rígida)' },
                { value: 'medium', label: 'Media (Acepta cambios menores)' },
                { value: 'high', label: 'Alta (Muy adaptable)' }
              ]"
              help="¿Cómo reacciona el niño ante cambios en esta rutina?"
              input-class="form-select-enhanced"
              label-class="form-label-enhanced"
            />
            <FormKit
              type="select"
              label="Método de Aviso"
              v-model="strategiesConfig.warning_method"
              :options="[
                { value: 'verbal', label: '📢 Recordatorio Verbal' },
                { value: 'visual', label: '🖼️ Apoyo Visual' },
                { value: 'timer', label: '⏰ Temporizador/Alarma' },
                { value: 'none', label: 'Ninguno' }
              ]"
              help="Método preferido para anunciar transiciones."
              input-class="form-select-enhanced"
              label-class="form-label-enhanced"
            />
          </div>
          <FormKit
            type="textarea"
            label="Notas sobre tolerancia al cambio"
            v-model="strategiesConfig.change_tolerance_notes"
            placeholder="Ej: Le molesta si cambiamos el orden de la vestimenta..."
            input-class="form-textarea-enhanced"
            label-class="form-label-enhanced"
          />
        </div>
      </section>

      <section v-if="localStrategies.length > 0" class="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100/50 border-b border-purple-200">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-purple-900 flex items-center gap-2">
              <ListBulletIcon class="w-5 h-5" /> Estrategias Específicas
            </h4>
            <span class="px-3 py-1 text-xs font-black bg-purple-600 text-white rounded-full">
              {{ localStrategies.length }}
            </span>
          </div>
        </div>
        
        <div ref="strategiesContainer" class="divide-y divide-gray-100">
          <div 
            v-for="(strategy, index) in localStrategies" 
            :key="strategy.id"
            class="strategy-item p-5 hover:bg-gray-50 transition-all flex items-start gap-4"
            :data-id="strategy.id"
          >
            <div class="drag-handle cursor-move text-gray-400 p-1 hover:bg-purple-100 rounded">
              <Bars3Icon class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <component :is="getStrategyIcon(strategy.strategy_type)" class="w-4 h-4 text-purple-600" />
                <h5 class="font-bold text-gray-900 text-sm">{{ getStrategyTypeLabel(strategy.strategy_type) }}</h5>
              </div>
              <p class="text-xs text-gray-600 italic">{{ strategy.description }}</p>
              <div v-if="strategy.related_step_order" class="mt-2 flex items-center gap-1 text-[10px] font-bold text-gray-500 uppercase">
                <LinkIcon class="w-3 h-3" /> Paso vinculando: {{ strategy.related_step_order }}
              </div>
            </div>
            <button @click="removeStrategy(index)" class="text-gray-400 hover:text-red-600 p-2">
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      <div class="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
        <FormKit type="form" :actions="false" @submit="addStrategy" v-model="newStrategyData">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <FormKit
              type="select"
              name="strategy_type"
              label="Nueva Estrategia"
              validation="required"
              :options="strategyTypeOptions"
              input-class="form-select-enhanced"
            />
            <FormKit
              type="select"
              name="related_step_order"
              label="Vincular a Paso (Opcional)"
              :options="stepOptions"
              input-class="form-select-enhanced"
            />
          </div>
          <FormKit
            type="textarea"
            name="description"
            placeholder="Describe el apoyo específico..."
            validation="required|length:5"
            input-class="form-textarea-enhanced"
          />
          <div class="mt-4 flex justify-end">
            <button type="submit" class="btn-add-strategy">
              <PlusIcon class="w-5 h-5 mr-2" /> Añadir a la Lista
            </button>
          </div>
        </FormKit>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, onUnmounted } from 'vue'
import { useRoutineWizardStore } from '@/store/rutinas/routineWizardStore'
import { storeToRefs } from 'pinia'
import Sortable from 'sortablejs'
import { 
  TrashIcon, PlusIcon, Bars3Icon, LightBulbIcon, AdjustmentsHorizontalIcon,
  SparklesIcon, PhotoIcon, BellAlertIcon, 
  ListBulletIcon, LinkIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits(['update:validity'])
const wizardStore = useRoutineWizardStore()

// 🚩 CORRECCIÓN: Desestructuración segura para evitar "undefined"
const { strategies, steps, strategiesConfig } = storeToRefs(wizardStore)

const localStrategies = ref<any[]>([])
const strategiesContainer = ref<HTMLElement | null>(null)
let sortableInstance: Sortable | null = null
const newStrategyData = ref({ strategy_type: '', description: '', related_step_order: null })

const strategyTypeOptions = [
  { value: 'positive_reinforcement', label: '⭐ Refuerzo Positivo' },
  { value: 'visual_reminder', label: '🖼️ Recordatorio Visual' },
  { value: 'timer_alarm', label: '⏰ Temporizador/Alarma' },
  { value: 'verbal_prompt', label: '💬 Indicación Verbal' },
  { value: 'physical_assistance', label: '🤝 Asistencia Física' },
  { value: 'other', label: '➕ Otra' }
]

const stepOptions = computed(() => {
  const options: Array<{ value: number | null, label: string }> = [{ value: null, label: 'Toda la rutina' }]
  steps.value.forEach((s, i) => options.push({ value: i + 1, label: `Paso ${i + 1}: ${s.action.substring(0, 20)}...` }))
  return options
})

function initializeStrategyIds() {
  // 🚩 CORRECCIÓN: Si strategies es undefined, inicializarlo como array vacío
  const list = strategies.value || []
  const strategiesWithIds = list.map((s, i) => ({
    ...s,
    id: s.id || `strategy-${Date.now()}-${i}`
  }))
  wizardStore.$patch({ strategies: strategiesWithIds })
  localStrategies.value = [...strategiesWithIds]
}

function initSortable() {
  if (!strategiesContainer.value || sortableInstance) return
  sortableInstance = Sortable.create(strategiesContainer.value, {
    handle: '.drag-handle',
    animation: 150,
    onEnd: (evt) => {
      const movedItem = localStrategies.value.splice(evt.oldIndex!, 1)[0]
      localStrategies.value.splice(evt.newIndex!, 0, movedItem)
      wizardStore.$patch({ strategies: [...localStrategies.value] })
    }
  })
}

function addStrategy() {
  const id = `strategy-${Date.now()}`
  const newItem = { ...newStrategyData.value, id }
  localStrategies.value.push(newItem)
  wizardStore.$patch({ strategies: [...localStrategies.value] })
  newStrategyData.value = { strategy_type: '', description: '', related_step_order: null }
}

function removeStrategy(index: number) {
  localStrategies.value.splice(index, 1)
  wizardStore.$patch({ strategies: [...localStrategies.value] })
}

function getStrategyTypeLabel(val: string) {
  return strategyTypeOptions.find(o => o.value === val)?.label.split(' ')[1] || val
}

function getStrategyIcon(type: string) {
  const map: any = { positive_reinforcement: SparklesIcon, visual_reminder: PhotoIcon, timer_alarm: BellAlertIcon }
  return map[type] || SparklesIcon
}

onMounted(async () => {
  initializeStrategyIds()
  emit('update:validity', true) // Las estrategias suelen ser opcionales para la validez del paso
  await nextTick()
  initSortable()
})

onUnmounted(() => sortableInstance?.destroy())
</script>

<style scoped>
.form-select-enhanced, .form-textarea-enhanced {
  @apply w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-200 transition-all bg-white text-sm;
}
.form-label-enhanced { @apply block text-xs font-black text-gray-500 uppercase tracking-widest mb-2; }
.btn-add-strategy {
  @apply inline-flex items-center px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-100 active:scale-95;
}
.shadow-soft { box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
.animate-bounce-soft { animation: bounce 3s infinite; }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
</style>