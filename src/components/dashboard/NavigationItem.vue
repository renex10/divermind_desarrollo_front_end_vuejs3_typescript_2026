<template>
<!--   ruta de este archivo es src\components\dashboard\NavigationItem.vue -->
  <router-link 
    :to="item.to" 
    class="flex items-center px-4 py-3 text-gray-300 hover:bg-[#3c5690] hover:text-white transition-colors duration-200"
    :class="{'justify-center': !isSidebarOpen}"
    active-class="bg-[#3c5690] text-white"
  >
    <component 
      :is="resolveIcon(item.icon)" 
      class="h-5 w-5" 
      :class="{'mr-3': isSidebarOpen}"
    />
    <span v-if="isSidebarOpen" class="text-sm">{{ item.name }}</span>
  </router-link>
</template>

<script setup lang="ts">
import { 
  HomeIcon, 
  UserPlusIcon, 
  DocumentTextIcon, 
  ChartBarIcon, 
  Cog6ToothIcon, 
  BuildingStorefrontIcon,
  ChatBubbleLeftRightIcon 
} from '@heroicons/vue/24/outline'

defineProps<{
  item: {
    name: string
    to: object
    icon: string
  }
  isSidebarOpen: boolean
}>()

const resolveIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    HomeIcon,
    UserPlusIcon,
    DocumentTextIcon,
    ChartBarIcon,
    Cog6ToothIcon,
    BuildingStorefrontIcon,
    ChatBubbleLeftRightIcon
  }
  return icons[iconName] || HomeIcon
}
</script>