<!-- src/components/profile/tabcontent/card/informaciongeneral/RegistroDiagnostico.vue -->
<template>
  <div class="info-card">
    <!-- Cabecera de la tarjeta -->
    <div class="card-header">
      <ClipboardDocumentListIcon class="icon-md" />
      <h3>Diagnósticos</h3>
      <!-- 
        BOTÓN AGREGAR: 
        - Se muestra al lado derecho gracias a 'ml-auto'.
        - Al hacer clic, emite el evento 'add-diagnosis'.
        - El componente padre (PerfilSeguimientoPersonal via TabContent) escuchará este evento
          para abrir el modal del formulario de nuevo diagnóstico.
      -->
      <button
        @click="$emit('add-diagnosis')"
        class="ml-auto btn btn-sm btn-outline-primary"
      >
        <PlusIcon class="icon-xs mr-1" />
        Agregar
      </button>
    </div>
    <!-- Cuerpo de la tarjeta -->
    <div class="card-body">
      <div class="diagnosticos-list">
        <!-- Estado Vacío: Se muestra si no hay diagnósticos -->
        <div v-if="diagnosticos.length === 0" class="empty-state">
          <ExclamationTriangleIcon class="icon-lg" />
          <p>No hay diagnósticos registrados</p>
        </div>
        <!-- Lista de Diagnósticos: Se itera sobre la prop 'diagnosticos' -->
        <div v-else class="diagnostico-item" v-for="diagnostico in diagnosticos" :key="diagnostico.id">
          <!-- Tipo de Diagnóstico (ej. Primario, Secundario) -->
          <div class="diagnostico-type" :class="diagnostico.diagnosis_type || 'default'">
            {{ diagnostico.diagnosis_type || 'No especificado' }}
          </div>
          <!-- Descripción del Diagnóstico -->
          <div class="diagnostico-desc">{{ diagnostico.description }}</div>
          <!-- Fecha del Diagnóstico (formateada) -->
          <div v-if="diagnostico.diagnosis_date" class="diagnostico-date text-xs text-gray-500 mt-1">
             {{ formatDate(diagnostico.diagnosis_date) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Importación de íconos desde Heroicons
import {
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  PlusIcon // Ícono para el botón "Agregar"
} from '@heroicons/vue/24/outline'

// Importación de la interfaz Diagnosis desde el servicio (¡Asegúrate de que la ruta sea correcta!)
// Esto mejora la seguridad de tipos comparado con usar 'any[]'
import type { Diagnosis } from '@/services/sessionService'; // O diagnosisService si lo creaste

// DEFINICIÓN DE PROPS:
// - 'diagnosticos': Un array de objetos Diagnosis que este componente recibe del padre.
//   El padre (PerfilSeguimientoPersonal) es responsable de cargar estos datos usando getDiagnosesForChild.
defineProps<{
  // Es mejor usar el tipo específico en lugar de any[]
  diagnosticos: Diagnosis[]
}>()

// DEFINICIÓN DE EMITS:
// - 'add-diagnosis': Evento que se emitirá cuando el usuario haga clic en el botón "Agregar".
//   No lleva datos adicionales. El padre lo escuchará para saber que debe abrir el modal.
defineEmits<{
  'add-diagnosis': []
}>()

// FUNCIÓN HELPER: Formatear Fecha
// - Toma una fecha en formato string (ej. "YYYY-MM-DD")
// - La convierte a un formato más legible para el usuario (ej. "Oct 22, 2025")
// - Incluye manejo básico de errores por si la fecha es inválida.
const formatDate = (dateString: string) => {
  if (!dateString) return ''; // Si no hay fecha, no mostrar nada
  try {
    // Usa la configuración regional 'es-CL' para el formato chileno
    return new Date(dateString).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' });
  } catch (e) {
    console.error("Error formateando fecha:", e);
    return dateString; // Si hay error, devuelve la fecha original
  }
}

</script>

<style scoped>
/* Estilos generales de la tarjeta (sin cambios) */
.info-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background-color: white; /* Asegura fondo blanco */
}

.card-header {
  background: #f8fafc;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.125rem; /* 18px */
  color: #1f2937;
}

.card-body {
  padding: 1.5rem;
}

/* Estilos para la lista de diagnósticos (sin cambios) */
.diagnostico-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.diagnostico-item:last-child {
  border-bottom: none;
}

/* Estilos para la etiqueta del tipo de diagnóstico */
.diagnostico-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px; /* Píldora redondeada */
  font-size: 0.75rem; /* 12px */
  font-weight: 500;
  text-transform: capitalize;
  margin-bottom: 0.5rem;
}

/* Colores según el tipo (ajusta según los valores de tu modelo) */
.diagnostico-type.primary {
  background: #fef3c7; /* Amarillo claro */
  color: #92400e; /* Amarillo oscuro */
}

.diagnostico-type.secondary {
  background: #dbeafe; /* Azul claro */
  color: #1e40af; /* Azul oscuro */
}

.diagnostico-type.comorbidity {
  background: #fee2e2; /* Rojo claro */
  color: #991b1b; /* Rojo oscuro */
}

.diagnostico-type.default {
  background: #e5e7eb; /* Gris claro */
  color: #4b5563; /* Gris oscuro */
}


.diagnostico-desc {
  color: #374151; /* Gris medio-oscuro */
  font-size: 0.875rem; /* 14px */
}

/* Estilos para el estado vacío (sin cambios) */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280; /* Gris medio */
}
.empty-state .icon-lg {
  margin: 0 auto 0.5rem; /* Centra el ícono */
}

/* Tamaños de íconos */
.icon-xs {
  width: 0.75rem; /* 12px */
  height: 0.75rem;
}
.icon-md {
  width: 1.5rem; /* 24px */
  height: 1.5rem;
}
.icon-lg {
  width: 2rem; /* 32px */
  height: 2rem;
}

/* Estilos básicos para botones (NUEVO) */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.2s;
  white-space: nowrap; /* Evita que el texto del botón se parta */
}
.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem; /* 12px */
}
.btn-outline-primary {
  border: 1px solid #3b82f6; /* Azul */
  color: #3b82f6;
  background-color: transparent;
}
.btn-outline-primary:hover {
  background-color: #eff6ff; /* Azul muy claro al pasar el mouse */
}

/* Utilidades (NUEVO) */
.ml-auto {
  margin-left: auto; /* Empuja el botón a la derecha en el header */
}
.mr-1 {
  margin-right: 0.25rem; /* Espacio entre ícono y texto */
}
.text-xs {
  font-size: 0.75rem; /* 12px */
  line-height: 1rem; /* 16px */
}
.text-gray-500 {
  color: rgb(107 114 128); /* Gris medio */
}
.mt-1 {
  margin-top: 0.25rem; /* 4px */
}

</style>