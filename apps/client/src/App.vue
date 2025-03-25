<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/layouts/Navbar.vue'
import Sidebar from '@/layouts/Sidebar.vue'
import Content from '@/layouts/Content.vue'

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar @toggle-sidebar="toggleSidebar" />

    <!-- Sidebar -->
    <Sidebar :is-open="isSidebarOpen">
      <!-- Folder tree content -->
    </Sidebar>

    <!-- Main Content -->
    <Content>
      <!-- Folder content -->
    </Content>
  </div>
</template>

<style>
</style>
