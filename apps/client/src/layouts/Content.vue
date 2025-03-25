<template>
  <main class="p-4 sm:ml-64 mt-[3.875rem]">
    <!-- Fixed Header -->
    <div class="fixed top-[3.875rem] right-0 sm:left-64 left-0 bg-gray-100 z-40">
      <div class="px-4 py-3">
        <!-- Breadcrumbs -->
        <nav class="flex mb-4" aria-label="Breadcrumb">
          <ol class="inline-flex items-center space-x-1 md:space-x-3">
            <li class="inline-flex items-center">
              <a href="#" class="inline-flex items-center text-gray-700 hover:text-blue-600">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Root
              </a>
            </li>
            <li v-for="(crumb, index) in breadcrumbs" :key="index">
              <div class="flex items-center">
                <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <a href="#" class="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">{{ crumb }}</a>
              </div>
            </li>
          </ol>
        </nav>

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <!-- Create Folder Dropdown -->
          <div class="relative">
            <button @click="toggleCreateMenu" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Create New
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <!-- Dropdown Menu -->
            <div v-if="isCreateMenuOpen" class="absolute z-10 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div class="py-1">
                <button @click="createFolder" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  New Folder
                </button>
                <button @click="uploadFile" class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Area with Padding Top -->
    <div class="pt-[8rem]">
      <div class="bg-white rounded-lg shadow p-6 h-full">
        <!-- Empty State -->
        <div v-if="isEmpty" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No items</h3>
          <p class="mt-1 text-sm text-gray-500">No folders or files here</p>
        </div>

        <!-- Content List -->
        <div v-else>
          <slot></slot>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  currentPath?: string[]
  isEmpty?: boolean
}>()

const isCreateMenuOpen = ref(false)
const breadcrumbs = computed(() => props.currentPath || [])

const toggleCreateMenu = () => {
  isCreateMenuOpen.value = !isCreateMenuOpen.value
}

const createFolder = () => {
  isCreateMenuOpen.value = false
  // Emit event untuk create folder
  emit('create-folder')
}

const uploadFile = () => {
  isCreateMenuOpen.value = false
  // Emit event untuk upload file
  emit('upload-file')
}

const emit = defineEmits(['create-folder', 'upload-file'])

// Click outside untuk menutup dropdown
const closeDropdown = (e: Event) => {
  if (!e.target) return
  isCreateMenuOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script> 