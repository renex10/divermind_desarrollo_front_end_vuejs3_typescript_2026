<script setup>
 /*  src\components\dashboard\padres\rutinas\ejecucion\ExecutionSummaryModal.vue */
import { ref, computed } from 'vue';

const emit = defineEmits(['submit', 'close']);

// --- ESTADO DEL FORMULARIO ---
const selectedMood = ref('');
const selectedSupport = ref('');
const generalNotes = ref('');

// ✅ CORRECCIÓN 1: Valores de MOOD válidos para emotional_state
const moods = [
  { id: 'happy', label: 'Feliz / Contento', emoji: '😊' },
  { id: 'calm', label: 'Tranquilo', emoji: '😌' },
  { id: 'tired', label: 'Cansado', emoji: '😴' },
  { id: 'frustrated', label: 'Frustrado', emoji: '😫' }
];

// ✅ CORRECCIÓN 2: Valores de SUPPORT válidos para support_level_needed
const supportLevels = [
  { id: 'none', label: 'Autónomo', desc: 'No necesité ayudarle' },
  { id: 'verbal', label: 'Bajo', desc: 'Solo recordatorios verbales' },
  { id: 'visual', label: 'Medio', desc: 'Ayuda visual constante' },
  { id: 'physical', label: 'Alto', desc: 'Apoyo físico' },
  { id: 'full', label: 'Total', desc: 'Asistencia completa' }
];

// --- VALIDACIÓN ---
const isValid = computed(() => {
  return selectedMood.value !== '' && selectedSupport.value !== '';
});

/**
 * Envía los datos finales al componente padre para procesar con el motor
 */
const handleSubmit = () => {
  if (!isValid.value) return;

  emit('submit', {
    mood: selectedMood.value,
    supportLevel: selectedSupport.value,
    notes: generalNotes.value
  });
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <header class="modal-header">
        <h2>¡Rutina Finalizada! 🎉</h2>
        <p>Completa este breve reporte para finalizar el registro.</p>
      </header>

      <div class="modal-body">
        <section class="summary-section">
          <h3>¿Cómo terminó el niño emocionalmente?</h3>
          <div class="mood-grid">
            <button 
              v-for="mood in moods" 
              :key="mood.id"
              :class="{ 'is-selected': selectedMood === mood.id }"
              @click="selectedMood = mood.id"
            >
              <span class="emoji">{{ mood.emoji }}</span>
              <span class="label">{{ mood.label }}</span>
            </button>
          </div>
        </section>

        <section class="summary-section">
          <h3>¿Qué tanto apoyo necesitó hoy en general?</h3>
          <div class="support-list">
            <button 
              v-for="level in supportLevels" 
              :key="level.id"
              :class="{ 'is-selected': selectedSupport === level.id }"
              @click="selectedSupport = level.id"
            >
              <div class="check-circle"></div>
              <div class="support-info">
                <strong>{{ level.label }}</strong>
                <span>{{ level.desc }}</span>
              </div>
            </button>
          </div>
        </section>

        <section class="summary-section">
          <h3>Observaciones adicionales (Opcional)</h3>
          <textarea 
            v-model="generalNotes" 
            placeholder="¿Algo importante que el terapeuta deba saber?"
            rows="3"
          ></textarea>
        </section>
      </div>

      <footer class="modal-footer">
        <button class="btn-cancel" @click="$emit('close')">Cancelar</button>
        <button 
          class="btn-submit" 
          :disabled="!isValid"
          @click="handleSubmit"
        >
          Enviar Reporte Final
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background: white;
  width: 100%;
  max-width: 500px;
  border-radius: 1.5rem;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h2 { margin: 0; color: #0f172a; }
.modal-header p { margin: 0.5rem 0 0; color: #64748b; }

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.summary-section h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #1e293b;
}

.mood-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.mood-grid button {
  padding: 1rem;
  border: 2px solid #f1f5f9;
  border-radius: 1rem;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.mood-grid button.is-selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.emoji { font-size: 1.5rem; }
.label { font-size: 0.875rem; font-weight: 600; }

.support-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.support-list button {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid #f1f5f9;
  border-radius: 1rem;
  background: white;
  text-align: left;
  cursor: pointer;
}

.support-list button.is-selected {
  border-color: #10b981;
  background: #f0fdf4;
}

.check-circle {
  width: 20px;
  height: 20px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
}

.is-selected .check-circle {
  background: #10b981;
  border-color: #10b981;
}

.support-info strong { display: block; font-size: 0.938rem; }
.support-info span { font-size: 0.813rem; color: #64748b; }

textarea {
  width: 100%;
  border: 2px solid #f1f5f9;
  border-radius: 1rem;
  padding: 1rem;
  resize: none;
}

.modal-footer {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  border-top: 1px solid #f1f5f9;
}

.btn-cancel {
  padding: 0.75rem;
  border: none;
  background: #f1f5f9;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-submit {
  padding: 0.75rem;
  border: none;
  background: #3b82f6;
  color: white;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}

.btn-submit:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
</style>