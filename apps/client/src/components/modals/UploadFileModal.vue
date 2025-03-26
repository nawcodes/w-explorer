<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-96">
      <h3 class="text-lg font-medium mb-4">Upload Files</h3>
      
      <div class="mb-4">
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="$refs.fileInput.click()"
        >
          <input
            type="file"
            ref="fileInput"
            multiple
            class="hidden"
            @change="handleFileSelect"
          >
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
          <p class="mt-1 text-sm text-gray-600">
            Drag and drop files here, or click to select files
          </p>
        </div>
      </div>

      <div class="mb-4 max-h-40 overflow-y-auto">
        <div v-for="file in selectedFiles" :key="file.name" 
          class="flex items-center justify-between py-2">
          <span class="truncate">{{ file.name }}</span>
          <button @click="removeFile(file)" 
            class="text-red-500 hover:text-red-700">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <button @click="$emit('close')"
          :disabled="isUploading"
          class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">
          Cancel
        </button>
        <button @click="handleUpload"
          :disabled="!selectedFiles.length || isUploading"
          :class="[
            'px-4 py-2 rounded-md',
            isUploading ? 'bg-gray-400' : 
            selectedFiles.length ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300',
            'text-white'
          ]">
          {{ isUploading ? 'Uploading...' : 'Upload' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FolderService } from '@/services/folder.service'

const props = defineProps<{
    currentFolderId: string
}>()

const emit = defineEmits(['close', 'uploaded'])
const fileInput = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const isUploading = ref(false)

const handleFileSelect = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (input.files) {
        selectedFiles.value = [...selectedFiles.value, ...Array.from(input.files)]
    }
}

const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    const droppedFiles = event.dataTransfer?.files
    if (droppedFiles) {
        selectedFiles.value = [...selectedFiles.value, ...Array.from(droppedFiles)]
    }
}

const removeFile = (file: File) => {
    selectedFiles.value = selectedFiles.value.filter(f => f !== file)
}

const handleUpload = async () => {
    if (!selectedFiles.value.length) return

    try {
        isUploading.value = true
        const { data, error } = await FolderService.uploadFiles(
            selectedFiles.value,
            props.currentFolderId
        )

        if (error) {
            throw error
        }

        emit('uploaded', data)
        emit('close')
    } catch (error) {
        console.error('Upload error:', error)
    } finally {
        isUploading.value = false
    }
}
</script> 