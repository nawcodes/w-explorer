<template>
  <aside :class="[
    'fixed left-0 z-40 w-64 h-screen transition-transform',
    isOpen ? 'translate-x-0' : '-translate-x-full',
    'sm:translate-x-0'
  ]">
    <div class="h-full flex flex-col bg-gray-50">
      <!-- Fixed Section (Search & Create) -->
      <div class="flex-shrink-0 px-3 py-4 border-b border-gray-200">
        <!-- Search Box -->
        <SearchFolder @search="handleSearch" />

        <!-- Create Root Folder Button -->
        <CreateFolderButton 
          @create="handleCreateRootFolder" 
          buttonText="Create Source Folder"
        />
      </div>

      <!-- Scrollable Section -->
      <nav class="flex-1 px-3 py-2 overflow-y-auto space-y-1">
        <!-- Root Folders Section -->
        <div>
          
          <div class="mt-1 pb-20">
            <!-- Hanya menampilkan root folders -->
            <div v-for="folder in rootFolders" :key="folder.id" 
              class="flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-gray-200"
              @click="handleSelectFolder(folder)"
            >
              <svg class="w-5 h-5 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span class="truncate">{{ folder.name }}</span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SearchFolder from '@/components/sidebar/SearchFolder.vue'
import CreateFolderButton from '@/components/sidebar/CreateFolderButton.vue'
import { FolderService } from '../services/folder.service'
import type { Folder } from '../types/folder'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['select-folder'])

// Menyimpan daftar root folders
const rootFolders = ref<Folder[]>([])

const fetchRootFolders = async () => {
  const { data, error } = await FolderService.getAllFolders()
  
  if (data) {
    rootFolders.value = data.filter(folder => !folder.parent_id)
  } else if (error) {
    console.error('Error fetching folders:', error)
  }
}

// Handle root folder creation
const handleCreateRootFolder = async (name: string) => {
  const { data, error } = await FolderService.createFolder({ 
    name,
    // Tidak perlu parent_id karena ini root folder
  })
  if (data) {
    rootFolders.value.push(data)
  } else if (error) {
    console.error('Error creating root folder:', error)
  }
}

// Handle folder search
const handleSearch = async (searchTerm: string) => {
  if (!searchTerm.trim()) {
    await fetchRootFolders()
    return
  }

  const { data, error } = await FolderService.searchFolders(searchTerm)
  if (data) {
    // Tetap filter hanya root folders dalam hasil pencarian
    rootFolders.value = data.filter(folder => !folder.parent_id)
  } else if (error) {
    console.error('Error searching folders:', error)
  }
}

// Handle folder selection
const handleSelectFolder = (folder: Folder) => {
  emit('select-folder', folder)
}

onMounted(() => {
  fetchRootFolders()
})
</script>

<style scoped>
/* Tambahkan smooth scrolling */
nav {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}

nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: #EDF2F7;
}

nav::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 3px;
}

/* Smooth sticky header transition */
.sticky {
  backdrop-filter: blur(8px);
  background-color: rgba(249, 250, 251, 0.9);
}
</style> 