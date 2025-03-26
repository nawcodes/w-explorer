<template>
  <div class="text-center py-12">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
    <h3 class="mt-2 text-lg font-medium text-gray-900">Welcome to W-Explorer</h3>
    <p class="mt-1 text-sm text-gray-500">Create your first resource folder to get started</p>
    <div class="mt-6">
      <button 
        @click="$emit('create-folder')"
        class="inline-flex items-center px-4 py-2 border border-transparent 
               shadow-sm text-sm font-medium rounded-md text-white 
               bg-blue-500 hover:bg-blue-600"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Resource Folder
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['create-folder'])
</script> 