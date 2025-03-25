<template>
  <div class="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md cursor-pointer"
    @click="showModal = true">
    <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
      <path fill-rule="evenodd"
        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
        clip-rule="evenodd" />
    </svg>
    <span>Create Source Folder</span>
  </div>

  <!-- Modal Create Folder -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-96">
      <h3 class="text-lg font-medium mb-4">Create New Folder</h3>
      <input v-model="folderName" type="text"
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        placeholder="Folder name">
      <div class="flex justify-end gap-2">
        <button @click="showModal = false"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
        <button @click="createFolder"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Create</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showModal = ref(false)
const folderName = ref('')

const emit = defineEmits(['create'])

const createFolder = () => {
  if (folderName.value.trim()) {
    emit('create', folderName.value)
    folderName.value = ''
    showModal.value = false
  }
}
</script> 