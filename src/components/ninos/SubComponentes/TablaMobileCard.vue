<template>
  <div class="nna-card">
    <div class="card-header">
      <div class="card-avatar-section">
        <div class="avatar-large">{{ getInitials(nna.first_name, nna.last_name) }}</div>
        <div class="card-info">
          <h3
            class="card-name clickable-name"
            @click="verPerfilNino"
            :title="`Ver perfil de ${nna.first_name} ${nna.last_name}`"
          >
            {{ nna.first_name }} {{ nna.last_name }}
          </h3>
          <p class="card-age">{{ calculateAge(nna.birth_date) }} años</p>
        </div>
      </div>
      <div class="card-status">
        <label
          :class="[
            'toggle-switch',
            nna.status === 'active' ? 'toggle-active' : 'toggle-inactive'
          ]"
        >
          <input
            type="checkbox"
            :checked="nna.status === 'active'"
            @change="handleToggleStatus"
            class="toggle-input"
          />
          <span class="toggle-slider"></span>
        </label>
        <span class="status-text" :class="nna.status">
          {{ nna.status === 'active' ? 'Activo' : 'Suspendido' }}
        </span>
      </div>
    </div>

    <div class="card-body">
      <div class="card-detail">
        <span class="detail-label">Última Sesión:</span>
        <span class="detail-value">{{ formatLastSession(nna.last_session) }}</span>
      </div>
      <div class="card-detail">
        <span class="detail-label">Grado:</span>
        <span class="detail-value">
          <span class="grade-badge">{{ nna.current_grade }}</span>
        </span>
      </div>
       <div class="card-detail" v-if="nna.rut">
        <span class="detail-label">RUT:</span>
        <span class="detail-value">{{ nna.rut }}</span>
      </div>
       <div class="card-detail" v-if="nna.commune_name">
        <span class="detail-label">Comuna:</span>
        <span class="detail-value">{{ nna.commune_name }}</span>
      </div>
    </div>

    <div class="card-actions">
      <button @click="verPerfilNino" class="card-action-btn view">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        </svg>
        Ver Perfil
      </button>
      <button @click="handleEdit" class="card-action-btn edit">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
        </svg>
        Editar
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router'; // ✅ Import useRouter

// ✅ Initialize router
const router = useRouter();

// Interface defines the data expected for each child card
interface NnaData {
  id: number | string;
  first_name: string;
  last_name: string;
  birth_date: string;
  current_grade: string;
  status: 'active' | 'suspended';
  last_session: string;
  rut?: string; // Optional field
  commune_name?: string; // Optional field
}

// Define component props
const props = defineProps<{
  nna: NnaData; // Expects an 'nna' object matching the NnaData interface
}>();

// Define events the component can emit
const emit = defineEmits<{
  (e: 'view', nna: NnaData): void;       // Emitted when view profile is triggered
  (e: 'edit', nna: NnaData): void;       // Emitted when edit button is clicked
  (e: 'toggle', nna: NnaData, newStatus: 'active' | 'suspended'): void; // Emitted when status toggle changes
}>();

// --- Helper Functions ---

// Get initials from first and last name
const getInitials = (firstName: string = '', lastName: string = ''): string => {
  const firstInitial = firstName ? firstName.charAt(0) : '';
  const lastInitial = lastName ? lastName.charAt(0) : '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

// Calculate age based on birth date
const calculateAge = (birthDate: string): number | string => {
  if (!birthDate) return '?'; // Return placeholder if no date
  try {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : '?'; // Ensure age is not negative
  } catch (e) {
    console.error("Error calculating age:", e);
    return '?'; // Return placeholder on error
  }
};

// Format the date of the last session
const formatLastSession = (date: string | null | undefined): string => {
  if (!date) return 'Nunca';

  try {
    const sessionDate = new Date(date);
    // Check if the date is valid
    if (isNaN(sessionDate.getTime())) return 'Fecha inválida';

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Clear time part for accurate date comparison
    sessionDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    yesterday.setHours(0, 0, 0, 0);


    if (sessionDate.getTime() === today.getTime()) {
      return 'Hoy';
    } else if (sessionDate.getTime() === yesterday.getTime()) {
      return 'Ayer';
    } else {
      // Format as DD/MM/YYYY for es-CL locale
      return sessionDate.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  } catch (e) {
     console.error("Error formatting last session date:", e);
     return 'Fecha inválida';
  }
};

// --- Event Handlers ---

// Handles the toggle switch change event
const handleToggleStatus = () => {
  const newStatus = props.nna.status === 'active' ? 'suspended' : 'active';
  console.log(`📱 Toggling status for ${props.nna.id} to ${newStatus}`);
  emit('toggle', props.nna, newStatus); // Emit event to parent
};

// ✅ UPDATED: Navigates to the child's profile page
const verPerfilNino = () => {
  console.log(`📱 Navigating to profile for child ID: ${props.nna.id} from mobile card`);
  // Use Vue Router to navigate to the child's profile summary page
  router.push({
    name: 'perfil-nino-resumen', // Ensure this route name matches your router config
    params: { id: props.nna.id.toString() } // Pass child ID as parameter
  });
  // Optionally emit 'view' event if the parent component needs to know
  emit('view', props.nna);
};

// Handles the edit button click event
const handleEdit = () => {
  console.log(`📱 Edit requested for child ID: ${props.nna.id}`);
  emit('edit', props.nna); // Emit event to parent
};
</script>

<style scoped>
/* Scoped styles for the mobile card component */
.nna-card {
  background: white;
  border: 1px solid #e5e7eb; /* gray-200 */
  border-radius: 8px;
  padding: 1.25rem; /* p-5 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* shadow-sm */
  transition: box-shadow 0.2s ease-in-out;
}
.nna-card:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* Align items to the top */
  margin-bottom: 1rem; /* mb-4 */
}

.card-avatar-section {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* gap-3 */
}

.avatar-large {
  width: 48px; /* w-12 */
  height: 48px; /* h-12 */
  border-radius: 9999px; /* rounded-full */
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Example gradient */
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem; /* text-sm */
  font-weight: 600; /* font-semibold */
  flex-shrink: 0;
}

.card-info {
  display: flex;
  flex-direction: column;
}

.card-name {
  font-weight: 600; /* font-semibold */
  color: #1f2937; /* gray-800 */
  margin: 0;
  line-height: 1.25; /* Add line-height for better spacing */
}

/* Style for clickable name */
.clickable-name {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.125rem 0.25rem;
  margin: -0.125rem -0.25rem; /* Negative margin to maintain layout */
  border-radius: 4px;
  display: inline-block; /* Make it behave like inline text */
}
.clickable-name:hover {
  color: #3b82f6; /* blue-600 */
  background-color: #eff6ff; /* blue-50 */
  text-decoration: underline;
}


.card-age {
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* gray-500 */
  margin: 0;
  margin-top: 0.125rem; /* Add small top margin */
}

.card-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align toggle and text to the right */
  gap: 0.25rem; /* gap-1 */
  flex-shrink: 0; /* Prevent status section from shrinking */
  padding-left: 0.5rem; /* Add some space from info */
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem; /* gap-3 */
  margin-bottom: 1rem; /* mb-4 */
  border-top: 1px solid #f3f4f6; /* gray-100 */
  padding-top: 1rem; /* pt-4 */
}

.card-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.875rem; /* text-sm */
  color: #6b7280; /* gray-500 */
}

.detail-value {
  font-size: 0.875rem; /* text-sm */
  color: #1f2937; /* gray-800 */
  font-weight: 500; /* font-medium */
  text-align: right;
}

.grade-badge {
  display: inline-block;
  padding: 0.25rem 0.625rem; /* px-2.5 py-1 */
  background: #e0e7ff; /* indigo-100 */
  color: #4338ca;    /* indigo-800 */
  border-radius: 6px; /* rounded-md */
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
}

.card-actions {
  display: flex;
  gap: 0.5rem; /* gap-2 */
  justify-content: space-between; /* Space buttons evenly */
  border-top: 1px solid #f3f4f6; /* gray-100 */
  padding-top: 1rem; /* pt-4 */
}

.card-action-btn {
  flex: 1; /* Make buttons take equal width */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem; /* gap-2 */
  padding: 0.5rem 0.75rem; /* py-2 px-3 */
  border: 1px solid transparent;
  border-radius: 6px; /* rounded-md */
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.card-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}
.card-action-btn:active {
    transform: translateY(0);
}

.card-action-btn.view {
  background: #dbeafe; /* blue-100 */
  color: #1e40af;    /* blue-800 */
  border-color: #bfdbfe; /* blue-200 */
}
.card-action-btn.view:hover {
    background-color: #bfdbfe; /* blue-200 */
}


.card-action-btn.edit {
  background: #fef3c7; /* amber-100 */
  color: #b45309;    /* amber-700 */
   border-color: #fde68a; /* amber-200 */
}
.card-action-btn.edit:hover {
     background-color: #fde68a; /* amber-200 */
}


/* --- Toggle Switch Styles --- */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px; /* Slightly smaller */
  height: 24px;
  vertical-align: middle;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #d1d5db; /* gray-300 */
  transition: .4s;
  border-radius: 34px; /* rounded-full */
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px; /* Slightly smaller */
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%; /* rounded-full */
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.toggle-input:checked + .toggle-slider {
  background-color: #10b981; /* green-500 */
}

.toggle-input:checked + .toggle-slider:before {
  transform: translateX(20px); /* Adjust translation distance */
}

/* Focus styles for accessibility */
.toggle-input:focus-visible + .toggle-slider {
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #3b82f6; /* blue-500 ring */
}

.toggle-active .toggle-slider { background-color: #10b981; } /* green-500 */
.toggle-inactive .toggle-slider { background-color: #d1d5db; } /* gray-300 */

.status-text {
  font-size: 0.75rem; /* text-xs */
  font-weight: 500; /* font-medium */
}

.status-text.active { color: #059669; } /* green-600 */
.status-text.suspended { color: #6b7280; } /* gray-500 */
</style>