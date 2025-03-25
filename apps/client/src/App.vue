<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FolderTree from './components/FolderTree.vue'
import FolderItem from './components/FolderItem.vue'
import type { Folder } from './types/folder'

const folders = ref<Folder[]>([])
const selectedFolder = ref<Folder | null>(null)
const subfolders = ref<Folder[]>([])

const handleFolderSelect = async (folder: Folder) => {
  selectedFolder.value = folder
  try {
    const response = await fetch(`http://localhost:3000/api/folders`)
    console.log(response)
    // subfolders.value = await response.json()
  } catch (error) {
    console.error('Error fetching subfolders:', error)
  }
}

onMounted(async () => {
  // Fetch initial folder structure
  try {
    const response = await fetch('http://localhost:3000/api/folders')
    folders.value = await response.json()
  } catch (error) {
    console.error('Error fetching folders:', error)
  }
})
</script>

<template>
  <div class="h-screen bg-gray-100">
    <!-- Navbar/Header -->
    <nav class="bg-white border-b border-gray-200 px-4 py-2.5">
      <div class="flex items-center">
        <img src="./assets/folder.svg" class="h-6 w-6 mr-2" alt="Explorer Icon" />
        <span class="text-xl font-semibold">Windows Explorer</span>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex h-[calc(100vh-4rem)]">
      <!-- Left Panel - Folder Tree -->
      <div class="w-1/3 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div class="mb-4">
          <h2 class="text-lg font-semibold mb-2">Folders</h2>
          <FolderTree :folders="folders" @select-folder="handleFolderSelect" />
        </div>
      </div>

      <!-- Right Panel - Folder Contents -->
      <div class="w-2/3 bg-white p-4 overflow-y-auto">
        <div v-if="selectedFolder">
          <h2 class="text-lg font-semibold mb-4">
            {{ selectedFolder.name }}
          </h2>
          <div class="grid grid-cols-4 gap-4">
            <FolderItem 
              v-for="subfolder in subfolders" 
              :key="subfolder.id" 
              :folder="subfolder" 
            />
          </div>
        </div>
        <div v-else class="text-center text-gray-500 mt-10">
          Select a folder to view its contents
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
