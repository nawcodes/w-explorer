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
  if (!folder) {
    currentPath.value = []
    return
  }

  // Pretend duplicate Breadcrumb
  if (currentPath.value.includes(folder.name)) {
    return
  }

  if (!folder.path) {
    currentPath.value = [folder.name]
    return
  }

  // Remove Slashes
  const cleanPath = folder.path.replace(/^\/|\/$/g, '')
  
  // If no slashes in path, use parent path + current folder
  if (!cleanPath.includes('/')) {
    if (folder.parent_id) {
      // Check duplicate before adding
      if (!currentPath.value.includes(folder.name)) {
        currentPath.value = [...currentPath.value, folder.name]
      }
    } else {
      currentPath.value = [folder.name]
    }
    return
  }

  // If there is a slash, split path as usual
  const newPath = cleanPath.split('/').filter(part => part.length > 0)
  // Avoid duplicate path
  currentPath.value = [...new Set(newPath)]
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

// Breadcrumb clicked
const handleContentNavigation = async (target: Folder | number | null) => {
  if (target === null) {
    // Klik pada "Root" di breadcrumb
    await loadInitialData()
  } else if (typeof target === 'number') {
    // Jika mengklik breadcrumb yang sudah aktif, abaikan
    if (target === currentPath.value.length - 1) {
      return
    }

    const pathUntilIndex = currentPath.value.slice(0, target + 1)
    const clickedPath = pathUntilIndex[target]
      
    try {
      const { data } = await FolderService.getFolderByPath(clickedPath)
      
      if (data?.data) {
        // Set current path sebelum handle folder select untuk mencegah duplikasi
        currentPath.value = pathUntilIndex
        await handleFolderSelect(data.data)
      }
    } catch (error) {
      console.error('Error navigating to path:', error)
    }
  } else {
    // Klik pada folder di content grid
    // Cek apakah folder sudah ada di path saat ini
    if (currentPath.value.includes(target.name)) {
      return
    }
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
