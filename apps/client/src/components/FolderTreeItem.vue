<template>
  <div class="folder-tree-item">
    <!-- Folder Item -->
    <div 
      :class="[
        'flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer',
        'hover:bg-gray-200 transition-colors duration-150',
        { 'bg-blue-100': isSelected },
        { 'pl-[calc(0.5rem*var(--level))]': level > 0 }
      ]"
      :style="{ '--level': level }"
      @click="selectFolder"
    >
      <!-- Expand/Collapse Icon -->
      <button 
        v-if="hasSubfolders"
        class="w-5 h-5 mr-1 flex items-center justify-center"
        @click.stop="toggleFolder"
      >
        <svg 
          class="w-4 h-4 transition-transform duration-200"
          :class="{ 'rotate-90': folder.isOpen }"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <span v-else class="w-5 mr-1"></span>

      <!-- Folder Icon -->
      <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>

      <!-- Folder Name -->
      <span class="truncate">{{ folder.name }}</span>
    </div>

    <!-- Subfolders -->
    <div v-if="hasSubfolders && folder.isOpen && level < maxDepth" class="ml-2">
      <FolderTreeItem
        v-for="subfolder in folder.subfolders"
        :key="subfolder.id"
        :folder="subfolder"
        :level="level + 1"
        :max-depth="maxDepth"
        @select="$emit('select', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Folder } from '../types/folder'

const props = defineProps<{
  folder: Folder
  level: number
  maxDepth: number
}>()

const emit = defineEmits(['select'])

const hasSubfolders = computed(() => 
  props.folder.subfolders && props.folder.subfolders.length > 0
)

const isSelected = computed(() => 
  false // TODO: Implement selection logic
)

const toggleFolder = () => {
  props.folder.isOpen = !props.folder.isOpen
}

const selectFolder = () => {
  emit('select', props.folder)
}
</script> 