<template>
  <div 
    class="p-4 border rounded-lg hover:bg-gray-50 transition-colors relative group"
  >
    <!-- Action Menu Button -->
    <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button 
        @click.stop="toggleMenu"
        class="p-1 hover:bg-gray-200 rounded-full"
      >
        <svg class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      <!-- Dropdown Menu -->
      <div v-if="isMenuOpen" 
        class="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-50 py-1 text-sm"
      >
        <button 
          @click.stop="handleDelete"
          class="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
        >
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
            />
          </svg>
          Delete {{ item.type === 'folder' ? 'Folder' : 'File' }}
        </button>
      </div>
    </div>

    <!-- Main Content (clickable) -->
    <div 
      @click="$emit('click', item)"
      class="cursor-pointer"
    >
      <div class="flex items-center">
        <!-- Folder Icon -->
        <svg v-if="item.type === 'folder'" 
          class="w-6 h-6 text-yellow-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
        <!-- File Icon -->
        <svg v-else 
          class="w-6 h-6 text-blue-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span class="ml-2 truncate">{{ item.name }}</span>
      </div>
      <!-- File Content -->
      <div v-if="item.type === 'file'" class="mt-2 text-xs text-gray-500">
        <span>{{ formatFileSize(item.size) }}</span>
        <span class="mx-2">•</span>
        <span>{{ formatDate(item.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Folder } from '../../types/folder'
import type { File } from '../../types/file'

interface Props {
  item: Folder | File
}

const props = defineProps<Props>()
const emit = defineEmits(['click', 'delete'])

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleDelete = () => {
  emit('delete', props.item)
  isMenuOpen.value = false
}

// Close menu when clicking outside
const closeMenu = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeMenu)
})

onUnmounted(() => {
  document.removeEventListener('click', closeMenu)
})

// Utility functions for displaying file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

// Utility function for displaying date
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
/* Optional: Add fade animation for dropdown */
.group-hover\:opacity-100 {
  transition: opacity 0.15s ease-in-out;
}
</style> 