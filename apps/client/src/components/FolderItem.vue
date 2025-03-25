<template>
  <div 
    class="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    @click="$emit('click', folder)"
  >
    <div class="flex flex-col items-center">
      <div class="w-16 h-16 flex items-center justify-center text-yellow-400 mb-2">
        <i class="fas fa-folder text-4xl"></i>
      </div>
      <span class="text-sm text-center truncate w-full">{{ folder.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['folder'])
</script> 