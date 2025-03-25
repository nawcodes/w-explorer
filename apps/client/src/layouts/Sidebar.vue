<template>
  <aside :class="[
    'fixed left-0 z-40 w-64 h-screen transition-transform',
    isOpen ? 'translate-x-0' : '-translate-x-full',
    'sm:translate-x-0'
  ]">
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50">
      <!-- Sidebar content akan kita buat nanti -->
      <slot>
            
      </slot>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
</script> 