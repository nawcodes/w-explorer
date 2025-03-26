<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-96">
      <h3 class="text-lg font-medium mb-4">Upload File</h3>
      <input 
        type="file"
        @change="handleFileChange"
        class="mb-4"
        multiple
      >
      <div class="flex justify-end gap-2">
        <button 
          @click="handleClose"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
        >
          Cancel
        </button>
        <button 
          @click="handleUpload"
          class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          :disabled="!selectedFiles.length"
        >
          Upload
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

const emit = defineEmits(['close', 'upload'])

const selectedFiles = ref<File[]>([])

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    selectedFiles.value = Array.from(input.files)
  }
}

const handleUpload = () => {
  if (selectedFiles.value.length) {
    emit('upload', {
      files: selectedFiles.value,
      folderId: props.currentFolderId
    })
    selectedFiles.value = []
  }
}

const handleClose = () => {
  selectedFiles.value = []
  emit('close')
}
</script> 