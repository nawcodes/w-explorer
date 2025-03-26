<template>
  <nav class="fixed top-0 z-50 w-full border-b border-gray-200 bg-blue-400 text-white">
    <div class="px-3 py-3 lg:px-5 lg:pl-3">
      <div class="flex">
        <div class="md:w-1/4 ">
          <button @click="$emit('toggle-sidebar')"
            class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clip-rule="evenodd" fill-rule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
              </path>
            </svg>
          </button>
          <div class="ml-2 md:mr-24 hidden md:flex ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="h-8 mr-3">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
            </svg>
            <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrapk">WExplorer</span>
          </div>
        </div>
        <div class="md:w-1/3 md:px-0 px-8 w-full">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input 
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              @focus="showDropdown = true"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-64 pl-10 p-2.5 w-full"
              placeholder="Search folders and files..."
            >
            
            <!-- Search Results Dropdown -->
            <div 
              v-if="showDropdown && searchResults.length > 0" 
              class="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200"
            >
              <div class="max-h-60 overflow-y-auto">
                <div 
                  v-for="item in searchResults" 
                  :key="item.id"
                  @click="handleItemClick(item)"
                  class="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <!-- Folder Icon -->
                  <svg 
                    v-if="item.type === 'folder'"
                    class="w-5 h-5 mr-2 text-yellow-500"
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" 
                    />
                  </svg>
                  <!-- File Icon -->
                  <svg
                    v-else
                    class="w-5 h-5 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span class="text-gray-700">{{ item.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FolderService } from '../services/folder.service'
import type { Folder } from '../types/folder'
import type { File } from '../types/file'

const emit = defineEmits(['toggle-sidebar', 'navigate', 'show-file-detail'])

const searchQuery = ref('')
const searchResults = ref<(Folder | File)[]>([])
const showDropdown = ref(false)

// Debounce helper function
const debounce = (fn: Function, delay: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

const handleSearch = debounce(async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  try {
    // Search folders and files simultaneously
    const [folderResponse, fileResponse] = await Promise.all([
      FolderService.searchFolders(searchQuery.value),
      FolderService.searchFiles(searchQuery.value)
    ])

    const folders = (folderResponse.data || []).map(folder => ({
      ...folder,
      type: 'folder'
    }))
    
    const files = (fileResponse.data || []).map(file => ({
      ...file,
      type: 'file'
    }))

    // Merge and sort results
    searchResults.value = [...folders, ...files].sort((a, b) => 
      a.name.localeCompare(b.name)
    )
  } catch (error) {
    console.error('Error searching items:', error)
    searchResults.value = []
  }
}, 300)

const handleItemClick = (item: Folder | File) => {
  searchQuery.value = ''
  searchResults.value = []
  showDropdown.value = false
  
  if (item.type === 'folder') {
    emit('navigate', item)
  } else {
    emit('show-file-detail', item)
  }
}

// Close dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (showDropdown.value && !(event.target as HTMLElement).closest('.relative')) {
    showDropdown.value = false
  }
}

// Add and remove click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.max-h-60 {
  max-height: 15rem;
}
</style> 