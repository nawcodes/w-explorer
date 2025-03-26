<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-[480px]">
      <div class="flex justify-between items-start mb-4">
        <h3 class="text-lg font-medium">File Details</h3>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <!-- File Icon and Name -->
        <div class="flex items-center">
          <svg class="w-8 h-8 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div>
            <h4 class="font-medium">{{ file.name }}</h4>
            <p class="text-sm text-gray-500">{{ file.mime_type || 'Unknown type' }}</p>
          </div>
        </div>

        <!-- File Information -->
        <div class="bg-gray-50 p-4 rounded-lg space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-600">Size</span>
            <span class="font-medium">{{ formatFileSize(file.size) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Created</span>
            <span class="font-medium">{{ formatDate(file.created_at) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Modified</span>
            <span class="font-medium">{{ formatDate(file.updated_at) }}</span>
          </div>
         
        </div>

       
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { File } from '../../types/file'

interface Props {
  isOpen: boolean
  file: File
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'download'])

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}


</script> 