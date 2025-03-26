<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-96">
      <h3 class="text-lg font-medium mb-4">Create New Folder</h3>
      <input 
        v-model="folderName" 
        type="text"
        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        placeholder="Enter folder name"
        @keyup.enter="handleCreate"
      >
      <div class="flex justify-end gap-2">
        <button 
          @click="handleClose"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          Cancel
        </button>
        <button 
          @click="handleCreate"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          :disabled="!folderName.trim()"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  isOpen: boolean
  currentFolderId?: string
}>()

const emit = defineEmits(['close', 'create'])

const folderName = ref('')

const handleCreate = () => {
  if (folderName.value.trim()) {
    emit('create', {
      name: folderName.value,
      parent_id: props.currentFolderId
    })
    folderName.value = ''
  }
}

const handleClose = () => {
  folderName.value = ''
  emit('close')
}
</script> 