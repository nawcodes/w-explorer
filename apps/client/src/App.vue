<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from '@/layouts/Navbar.vue'
import Sidebar from '@/layouts/Sidebar.vue'
import Content from '@/layouts/Content.vue'

const isSidebarOpen = ref(true)
const currentPath = ref(['Documents', 'Projects', 'Web'])
const items = ref([]) // folder dan file items
const hasItems = computed(() => items.value.length > 0)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleCreateFolder = () => {
  // Logic untuk membuat folder
}

const handleUploadFile = () => {
  // Logic untuk upload file
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 font-mono">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen">
      <!-- Folder tree content -->
    </Sidebar>

    <!-- Main Content -->
    <Content 
      :current-path="currentPath"
      :is-empty="!hasItems"
      @create-folder="handleCreateFolder"
      @upload-file="handleUploadFile"
    >
      <!-- Content items akan ditampilkan di sini -->
    </Content>
  </div>
</template>

<style>
</style>
