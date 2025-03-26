<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/layouts/Navbar.vue'
import Sidebar from '@/layouts/Sidebar.vue'
import Content from '@/layouts/Content.vue'
import { FolderService } from './services/folder.service'
import type { Folder } from './types/folder'

const isSidebarOpen = ref(true)
const currentFolder = ref<Folder | null>(null)
const currentPath = ref<string[]>([])
const items = ref<Folder[]>([])
const hasItems = computed(() => items.value.length > 0)

// Handle folder selection dari sidebar atau content
const handleFolderSelect = async (folder: Folder) => {
  currentFolder.value = folder
  
  // Jika folder memiliki parent_id, kita perlu membangun path lengkap
  if (folder.parent_id && !folder.path?.includes('/')) {
    const parentFolder = await FolderService.getFolderById(folder.parent_id)
    if (parentFolder?.data) {
      const parentPath = parentFolder.data.path || parentFolder.data.name
      folder.path = `${parentPath}/${folder.name}`
    }
  }
  
  updateCurrentPath(folder)
  await loadFolderContents(folder.id)
}

// Update current path berdasarkan folder yang dipilih
const updateCurrentPath = (folder: Folder) => {
  if (!folder.path) {
    currentPath.value = [folder.name]
    return
  }

  // Hapus slash di awal dan akhir
  const cleanPath = folder.path.replace(/^\/|\/$/g, '')
  
  // Jika tidak ada slash di path, gunakan parent path + current folder
  if (!cleanPath.includes('/')) {
    if (folder.parent_id) {
      currentPath.value = [...currentPath.value, folder.name]
    } else {
      currentPath.value = [folder.name]
    }
    return
  }

  // Jika ada slash, split path seperti biasa
  currentPath.value = cleanPath.split('/').filter(part => part.length > 0)
}

// Load contents dari folder yang dipilih
const loadFolderContents = async (folderId: string) => {
  try {
    const { data } = await FolderService.getSubfolders(folderId)
    if (data) {
      items.value = data.data
    }
  } catch (error) {
    console.error('Error loading folder contents:', error)
    items.value = []
  }
}

// Handle navigasi dari content (click item atau breadcrumb)
const handleContentNavigation = async (target: Folder | number | null) => {
  
  if (target === null) {
    // Klik pada "Root" di breadcrumb
    await loadInitialData()
  } else if (typeof target === 'number') {
    // Klik pada breadcrumb item
    const pathUntilIndex = currentPath.value.slice(0, target + 1)
    const fullPath = '/' + pathUntilIndex.join('/')
    
    try {
      const { data } = await FolderService.getFolderByPath(fullPath)
      console.log(data);
      
      if (data?.data) {
        await handleFolderSelect(data.data)
      }
    } catch (error) {
      console.error('Error navigating to path:', error)
    }
  } else {
    // Klik pada folder di content grid
    await handleFolderSelect(target)
  }
}

// Load initial data
const loadInitialData = async () => {
  try {
    const { data } = await FolderService.getAllFolders()
    if (data?.data && data.data.length > 0) {
      const firstFolder = data.data[0]
      await handleFolderSelect(firstFolder)
    }
  } catch (error) {
    console.error('Error loading initial data:', error)
  }
}

onMounted(() => {
  loadInitialData()
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

/**
 * @todo: do later
 */
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
    <Sidebar 
      :is-open="isSidebarOpen"
      @select-folder="handleFolderSelect"
    />

    <!-- Main Content -->
    <Content 
      :current-path="currentPath"
      :is-empty="!hasItems"
      :items="items"
      :current-folder="currentFolder"
      @navigate="handleContentNavigation"
      @create-folder="handleCreateFolder"
      @upload-file="handleUploadFile"
    />
  </div>
</template>

<style>
</style>
