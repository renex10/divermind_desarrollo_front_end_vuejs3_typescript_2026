<script setup>
/**
 * COMPONENTE: ExecutionStrategiesDrawer
 * Propósito: Mostrar las pautas de calma y flexibilidad clínica al padre.
 */

const props = defineProps({
  strategies: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

defineEmits(['close']);
</script>

<template>
  <div class="drawer-overlay" @click.self="$emit('close')">
    <div class="drawer-content">
      <header class="drawer-header">
        <div class="header-icon">💡</div>
        <div>
          <h2>Estrategias de Apoyo</h2>
          <p>Guía del terapeuta para esta rutina</p>
        </div>
        <button class="btn-close" @click="$emit('close')">&times;</button>
      </header>

      <div class="drawer-body">
        <section class="strategy-section">
          <div class="section-badge">Flexibilidad</div>
          <div class="flexibility-info">
            <strong>Nivel: {{ strategies.flexibility_level_display || 'No especificado' }}</strong>
            <p v-if="strategies.change_tolerance_notes">
              {{ strategies.change_tolerance_notes }}
            </p>
          </div>
        </section>

        <section v-if="strategies.transition_strategies" class="strategy-section">
          <h3>🚀 Para cambiar de actividad</h3>
          <div class="content-box">
            {{ strategies.transition_strategies }}
          </div>
        </section>

        <section v-if="strategies.calming_strategies" class="strategy-section">
          <h3>🧘 Si hay frustración o crisis</h3>
          <div class="content-box calming">
            {{ strategies.calming_strategies }}
          </div>
        </section>

        <section v-if="strategies.visual_supports_needed" class="strategy-section">
          <h3>🖼️ Apoyos Visuales Sugeridos</h3>
          <p class="support-type">
            Tipo: {{ strategies.visual_support_type_display || 'General' }}
          </p>
          <div v-if="strategies.visual_schedule_file" class="file-alert">
            📄 Hay un horario visual adjunto para esta rutina.
          </div>
        </section>
        
        <div v-if="!strategies.calming_strategies && !strategies.transition_strategies" class="empty-strategies">
            <p>El terapeuta no ha definido estrategias específicas adicionales para esta rutina.</p>
        </div>
      </div>

      <footer class="drawer-footer">
        <button class="btn-got-it" @click="$emit('close')">Entendido</button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  z-index: 2000;
}

.drawer-content {
  width: 100%;
  max-width: 400px;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.drawer-header {
  padding: 1.5rem;
  background: #f8fafc;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.header-icon {
  font-size: 2rem;
}

.drawer-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #0f172a;
}

.drawer-header p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #94a3b8;
  cursor: pointer;
}

.drawer-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.strategy-section {
  margin-bottom: 2rem;
}

.section-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #e0f2fe;
  color: #0369a1;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.strategy-section h3 {
  font-size: 1rem;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.content-box {
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 0.75rem;
  color: #334155;
  font-size: 0.938rem;
  line-height: 1.5;
  white-space: pre-wrap;
}

.calming {
  background: #fff7ed;
  border-left: 4px solid #f97316;
}

.file-alert {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f0fdf4;
  color: #166534;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.empty-strategies {
    text-align: center;
    color: #94a3b8;
    padding-top: 2rem;
}

.drawer-footer {
  padding: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-got-it {
  width: 100%;
  padding: 1rem;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
}
</style>