<template>
  <div 
    class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    @click="$emit('click', item)"
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
  </div>
</template>

<script setup lang="ts">
import type { Folder } from '../../types/folder'

interface Props {
  item: Folder
}

const props = defineProps<Props>()

defineEmits(['click'])
</script> 