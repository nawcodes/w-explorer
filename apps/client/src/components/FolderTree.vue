<template>
  <div class="folder-tree">
    <ul class="space-y-1">
      <li v-for="folder in folders" :key="folder.id">
        <div
          class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
          :class="{ 'bg-blue-50': selectedFolder?.id === folder.id }"
          @click="selectFolder(folder)"
        >
          <button
            v-if="folder.subfolders?.length"
            class="mr-1 w-4 h-4 text-gray-500"
            @click.stop="toggleFolder(folder)"
          >
            <i class="fas" :class="folder.isOpen ? 'fa-chevron-down' : 'fa-chevron-right'"></i>
          </button>
          <span class="w-4 h-4 mr-2">
            <i class="fas fa-folder text-yellow-400"></i>
          </span>
          <span class="text-sm">{{ folder.name }}</span>
        </div>
        
        <div v-if="folder.isOpen && folder.subfolders?.length" class="ml-6">
          <FolderTree
            :folders="folder.subfolders"
            :selected-folder="selectedFolder"
            @select-folder="selectFolder"
          />
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// import { ref } from 'vue'
import type { Folder } from '../types/folder'

const props = defineProps<{
  folders: Folder[]
  selectedFolder: Folder | null
}>()

console.log(props.folders)

const emit = defineEmits(['select-folder'])

const toggleFolder = (folder: Folder) => {
  folder.isOpen = !folder.isOpen
}

const selectFolder = (folder: Folder) => {
  emit('select-folder', folder)
}
</script> 