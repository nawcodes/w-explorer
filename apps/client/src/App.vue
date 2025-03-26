<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/layouts/Navbar.vue'
import Sidebar from '@/layouts/Sidebar.vue'
import Content from '@/layouts/Content.vue'
import { FolderService } from './services/folder.service'
import type { Folder } from './types/folder'
import type { File } from './types/file'
import CreateFolderModal from '@/components/modals/CreateFolderModal.vue'
import UploadFileModal from '@/components/modals/UploadFileModal.vue'

const isSidebarOpen = ref(true)
const currentFolder = ref<Folder | null>(null)
const currentPath = ref<string[]>([])
const folders = ref<Folder[]>([])
const files = ref<File[]>([])
const items = computed(() => [...folders.value, ...files.value])
const hasItems = computed(() => items.value.length > 0)

// Modal states
const isCreateFolderModalOpen = ref(false)
const isUploadFileModalOpen = ref(false)

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
    const { data } = await FolderService.getFolderContents(folderId)

    if (data?.data) {
      // Update folders dan files secara terpisah
      folders.value = data.data.folders.map(folder => ({
        ...folder,
        type: 'folder' as const
      }))
      files.value = data.data.files.map(file => ({
        ...file,
        type: 'file' as const
      }))
    }
  } catch (error) {
    console.error('Error loading folder contents:', error)
    folders.value = []
    files.value = []
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

// Handle create folder
const handleCreateFolder = () => {
  isCreateFolderModalOpen.value = true
}

const handleCreateFolderSubmit = async (data: { name: string, parent_id?: string }) => {
  try {
    const response = await FolderService.createFolder({
      name: data.name,
      parent_id: currentFolder.value?.id
    })

    if (response.data?.data) {
      // Reload current folder contents
      await loadFolderContents(currentFolder.value?.id || '')
    }
  } catch (error) {
    console.error('Error creating folder:', error)
  } finally {
    isCreateFolderModalOpen.value = false
  }
}

// Handle upload file
const handleUploadFile = () => {
  isUploadFileModalOpen.value = true
}

const handleUploadFileSubmit = async (data: { files: File[], folderId?: string }) => {
  try {
    const formData = new FormData()
    data.files.forEach(file => {
      formData.append('files', file)
    })
    
    if (currentFolder.value?.id) {
      formData.append('folderId', currentFolder.value.id)
    }

    const response = await FolderService.uploadFiles(formData)
    
    if (response.data) {
      // Reload current folder contents
      await loadFolderContents(currentFolder.value?.id || '')
    }
  } catch (error) {
    console.error('Error uploading files:', error)
  } finally {
    isUploadFileModalOpen.value = false
  }
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

    <!-- Modals -->
    <CreateFolderModal
      :is-open="isCreateFolderModalOpen"
      :current-folder-id="currentFolder?.id"
      @close="isCreateFolderModalOpen = false"
      @create="handleCreateFolderSubmit"
    />
    
    <UploadFileModal
      :is-open="isUploadFileModalOpen"
      :current-folder-id="currentFolder?.id"
      @close="isUploadFileModalOpen = false"
      @upload="handleUploadFileSubmit"
    />
  </div>
</template>

<style>
</style>
