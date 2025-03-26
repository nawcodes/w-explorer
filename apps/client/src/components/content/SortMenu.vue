<template>
  <div class="relative inline-block text-left">
    <button 
      type="button"
      @click.stop="toggleDropdown"
      class="flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
      </svg>
      Sort by: {{ sortOptions[currentSort].label }}
      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-show="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-[100]"
    >
      <div class="py-1">
        <button
          v-for="(option, key) in sortOptions"
          :key="key"
          @click.stop="handleSort(key as SortKey)"
          class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between group"
        >
          <span>{{ option.label }}</span>
          <svg 
            v-if="currentSort === key" 
            class="w-4 h-4 text-blue-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

export type SortKey = 'name' | 'type' | 'size' | 'date'

const sortOptions = {
  name: { label: 'Name', compareFn: (a: any, b: any) => a.name.localeCompare(b.name) },
  type: { label: 'Type', compareFn: (a: any, b: any) => a.type.localeCompare(b.type) },
  size: { label: 'Size', compareFn: (a: any, b: any) => (a.size || 0) - (b.size || 0) },
  date: { label: 'Date modified', compareFn: (a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime() }
}

const isOpen = ref(false)
const currentSort = ref<SortKey>('name')

const emit = defineEmits(['sort'])

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleSort = (key: SortKey) => {
  currentSort.value = key
  isOpen.value = false
  emit('sort', { key, compareFn: sortOptions[key].compareFn })
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const dropdown = document.querySelector('.relative.inline-block')
  
  if (dropdown && !dropdown.contains(target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.origin-top-right {
  transform-origin: top right;
}
</style> 