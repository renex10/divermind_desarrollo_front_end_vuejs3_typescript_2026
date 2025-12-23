<template>
  <!-- src/components/dashboard/NavigationItem.vue -->
  <div class="navigation-item-wrapper">
    <router-link 
      :to="item.to" 
      class="navigation-item"
      :class="{
        'item-collapsed': !isSidebarOpen,
        'item-expanded': isSidebarOpen
      }"
      active-class="item-active"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <!-- Icono -->
      <div class="item-icon-wrapper">
        <component 
          :is="resolveIcon(item.icon)" 
          class="item-icon"
        />
        
        <!-- Badge de notificaciones -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 scale-0"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-0"
        >
          <span v-if="item.badge" class="item-badge">
            {{ item.badge }}
          </span>
        </Transition>
      </div>
      
      <!-- Texto del item -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <span v-if="isSidebarOpen" class="item-text">
          {{ item.name }}
        </span>
      </Transition>

      <!-- Badge cuando está expandido -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-0"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-0"
      >
        <span v-if="item.badge && isSidebarOpen" class="item-badge-expanded">
          {{ item.badge }}
        </span>
      </Transition>
    </router-link>

    <!-- Tooltip cuando está colapsado -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-x-2"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-2"
    >
      <div 
        v-if="showTooltip && !isSidebarOpen && isHovering"
        class="item-tooltip"
        role="tooltip"
      >
        <span class="tooltip-text">{{ item.name }}</span>
        <span v-if="item.badge" class="tooltip-badge">{{ item.badge }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  HomeIcon, 
  SparklesIcon,  // ✅ NUEVO: Para Gestión NNA
  DocumentTextIcon, 
  ChartBarIcon, 
  Cog6ToothIcon, 
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/vue/24/outline'

// ==========================
// INTERFACES
// ==========================

interface NavigationItem {
  name: string
  to: object
  icon: string
  badge?: number | string | null
}

interface Props {
  item: NavigationItem
  isSidebarOpen: boolean
  showTooltip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true
})

// ==========================
// STATE
// ==========================

const isHovering = ref(false)

// ==========================
// METHODS
// ==========================

const resolveIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    HomeIcon,
    SparklesIcon,  // ✅ NUEVO
    DocumentTextIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    BuildingStorefrontIcon,
    ChatBubbleLeftRightIcon
  }
  return icons[iconName] || HomeIcon
}

const handleMouseEnter = () => {
  if (!props.isSidebarOpen && props.showTooltip) {
    isHovering.value = true
  }
}

const handleMouseLeave = () => {
  isHovering.value = false
}
</script>

<style scoped>
/* ==========================
   WRAPPER
   ========================== */

.navigation-item-wrapper {
  position: relative;
}

/* ==========================
   ITEM BASE
   ========================== */

.navigation-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin: 0.125rem 0;
  border-radius: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.navigation-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
  transform: scaleY(0);
  transition: transform 0.2s ease;
}

.navigation-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.navigation-item:focus-visible {
  outline: 2px solid #60a5fa;
  outline-offset: 2px;
}

/* Item activo */
.item-active {
  background: rgba(59, 130, 246, 0.2);
  color: white;
}

.item-active::before {
  transform: scaleY(1);
}

.item-active .item-icon {
  color: #60a5fa;
}

/* ==========================
   COLLAPSED / EXPANDED
   ========================== */

.item-collapsed {
  justify-content: center;
  padding: 0.75rem;
}

.item-expanded {
  justify-content: flex-start;
}

/* ==========================
   ICON
   ========================== */

.item-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: all 0.2s ease;
}

.item-expanded .item-icon {
  margin-right: 0.75rem;
}

/* ==========================
   TEXT
   ========================== */

.item-text {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  flex: 1;
}

/* ==========================
   BADGES
   ========================== */

.item-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  min-width: 1.125rem;
  height: 1.125rem;
  padding: 0 0.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: 2px solid #132441;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.item-badge-expanded {
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: white;
  margin-left: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* ==========================
   TOOLTIP
   ========================== */

.item-tooltip {
  position: absolute;
  left: calc(100% + 0.75rem);
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 100;
  pointer-events: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3),
              0 4px 6px -2px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-tooltip::before {
  content: '';
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-right-color: #1e293b;
}

.tooltip-text {
  color: white;
}

.tooltip-badge {
  min-width: 1.125rem;
  height: 1.125rem;
  padding: 0 0.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  color: white;
}

/* ==========================
   HOVER EFFECTS
   ========================== */

.navigation-item:hover .item-icon {
  transform: scale(1.1);
}

.item-active:hover .item-icon {
  transform: scale(1.1) rotate(5deg);
}

/* ==========================
   ANIMATIONS
   ========================== */

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.item-badge {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* ==========================
   ACCESSIBILITY
   ========================== */

@media (prefers-reduced-motion: reduce) {
  .navigation-item,
  .item-icon,
  .item-badge {
    transition: none;
    animation: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .navigation-item {
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  .item-active {
    border-color: #60a5fa;
  }
}
</style>