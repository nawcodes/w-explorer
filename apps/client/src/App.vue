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
import FileDetailModal from '@/components/modals/FileDetailModal.vue'

const isSidebarOpen = ref(true)
const currentFolder = ref<Folder | null>(null)
const currentPath = ref<string[]>([])
const folders = ref<Folder[]>([])
const files = ref<File[]>([])
const hasAnyFolders = ref(false)

const items = computed(() => [...folders.value, ...files.value])
const hasItems = computed(() => items.value.length > 0)

// Modal states
const isCreateFolderModalOpen = ref(false)
const isUploadFileModalOpen = ref(false)
const isFileDetailModalOpen = ref(false)
const selectedFile = ref<File | null>(null)


const loadFolderContents = async (folderId: string) => {
  try {
    const { data } = await FolderService.getFolderContents(folderId)

    if (data?.data) {
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
    // check if breadcrumb already active
    if (target === currentPath.value.length - 1) {
      return
    }

    const pathUntilIndex = currentPath.value.slice(0, target + 1)
    const clickedPath = pathUntilIndex[target]
    
    try {
      const { data } = await FolderService.getFolderByPath(clickedPath)
      
      if (data?.data) {
        // set current path
        currentPath.value = pathUntilIndex
        await handleFolderSelect(data.data)
      }
    } catch (error) {
      console.error('Error navigating to path:', error)
    }
  } else {    
    if (currentPath.value.includes(target.name)) {
      return
    }
    await handleFolderSelect(target)
  }
}


// this fn is every click folder or file on sidebar or content
const handleFolderSelect = async (folder: Folder) => {  
  
  currentFolder.value = folder
  folder.type = 'folder'
  // if is not root folder, we need to build the full path
  if (folder.parent_id && !folder.path?.includes('/')) {    
    const parentFolder = await FolderService.getFolderById(folder.parent_id)
    console.log('parentFolder', parentFolder);
    
    if (parentFolder?.data) {
      const parentPath = parentFolder.data.path || parentFolder.data.name
      folder.path = `${parentPath}/${folder.name}`
      console.log(folder);
      
    }
  }
  
  updateCurrentPath(folder)
  await loadFolderContents(folder.id)
}

// update current path
const updateCurrentPath = (folder: Folder) => {
  if (!folder) {
    currentPath.value = []
    return
  }

  // check if folder already in current path
  if (currentPath.value.includes(folder.name)) {
    return
  }

  if (!folder.path) {
    currentPath.value = [folder.name]
    return
  }

  // explode path 
  const cleanPath = folder.path.replace(/^\/|\/$/g, '')
  
  // If no slashes in path, use parent path + current folder
  if (!cleanPath.includes('/')) {
    
    // if (folder.parent_id) {
    //   console.log('parent_id');
      
    //   // Check duplicate before adding
    //   if (!currentPath.value.includes(folder.name)) {
    //     currentPath.value = [...currentPath.value, folder.name]
    //   }
    // } else {
      // currentPath.value = [folder.name]
    // }

    currentPath.value = [folder.name]
  }

  // console.log(cleanPath);
  
  const newPath = cleanPath.split('/').filter(part => part.length > 0)

  // console.log(newPath);
  
  // Avoid duplicate path
  currentPath.value = [...new Set(newPath)]
}

// Load initial data
const loadInitialData = async () => {
  try {
    const { data } = await FolderService.getAllFolders()    

    if (data) {
      hasAnyFolders.value = data.length > 0

      if (hasAnyFolders.value) {
        // Sort folders by created_at to get the first created folder
        const sortedFolders = [...data].sort((a, b) => {
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        })
        
        const firstCreatedFolder = sortedFolders[0]
        firstCreatedFolder.type = 'folder'
        await handleFolderSelect(firstCreatedFolder)
      } else {
        // Reset states when no folders exist
        currentFolder.value = null
        currentPath.value = []
        folders.value = []
        files.value = []
      }
    }
  } catch (error) {
    console.error('Error loading initial data:', error)
    hasAnyFolders.value = false
  }
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// Handle create folder
const handleCreateFolder = () => {
  isCreateFolderModalOpen.value = true
}

// Handle create folder from welcome banner
const handleCreateFolderSubmit = async (data: { name: string, parent_id?: string }) => {
  try {
    // prevent special characters and return error if exists
    if (/[^a-zA-Z0-9]/.test(data.name)) {
      throw new Error('Special characters are not allowed')
    }

    const response = await FolderService.createFolder({
      name: data.name,
      parent_id: currentFolder.value?.id
    })

    if (response.data?.data) {
      hasAnyFolders.value = true
      
      // If this is the first folder, make it the current folder
      if (!currentFolder.value) {
        await handleFolderSelect(response.data.data)
      } else {
        // If creating subfolder, refresh current folder contents
        await loadFolderContents(currentFolder.value.id)
      }
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

const handleUploadComplete = async () => {
    isUploadFileModalOpen.value = false
    // Refresh folder contents
    if (currentFolder.value?.id) {
        await loadFolderContents(currentFolder.value.id)
    }
}

const handleItemDelete = async (item: Folder | File) => {
  // check if this current folder want to delete
  let willDeleteCurrentFolder = false
  
  if (item.id === currentFolder.value?.id) {
    // usually is root folder
    willDeleteCurrentFolder = true
  }

  try {
    if (item.type === 'folder') {
      await FolderService.deleteFolder(item.id)
    } else {
      await FolderService.deleteFile(item.id)
    }
    
    // Refresh current folder contents
    if (willDeleteCurrentFolder) {
      await loadInitialData()
      // hard reload page
      window.location.reload()
    } else {
      if (currentFolder.value?.id) {
        await loadFolderContents(currentFolder.value.id)
      }
    }
  } catch (error) {
    console.error(`Error deleting ${item.type}:`, error)
  }
}


const handleShowFileDetail = (file: File) => {
  selectedFile.value = file
  isFileDetailModalOpen.value = true
}

onMounted(() => {
  loadInitialData()
})

</script>

<template>
  <div class="min-h-screen bg-gray-100 font-mono">
    <Navbar 
      @toggle-sidebar="toggleSidebar" 
      @navigate="handleContentNavigation"
      @show-file-detail="handleShowFileDetail"
    />

    <!-- Sidebar with currentFolderId -->
    <Sidebar 
      :is-open="isSidebarOpen"
      :current-folder-id="currentFolder?.id"
      @select-folder="handleFolderSelect"
    />

    <!-- Main Content -->
    <Content 
      :current-path="currentPath"
      :is-empty="!hasItems"
      :items="items"
      :current-folder="currentFolder"
      :has-any-folders="hasAnyFolders"
      @navigate="handleContentNavigation"
      @create-folder="handleCreateFolder"
      @upload-file="handleUploadFile"
      @delete-item="handleItemDelete"
    />

    <!-- Modals -->
    <CreateFolderModal
      :is-open="isCreateFolderModalOpen"
      :current-folder-id="currentFolder?.id"
      @close="isCreateFolderModalOpen = false"
      @create="handleCreateFolderSubmit"
    />
    
    <UploadFileModal
      v-if="isUploadFileModalOpen"
      :current-folder-id="currentFolder?.id || ''"
      @close="isUploadFileModalOpen = false"
      @uploaded="handleUploadComplete"
    />

    <!-- Add FileDetailModal component -->
    <FileDetailModal 
      v-if="selectedFile" 
      :is-open="isFileDetailModalOpen" 
      :file="selectedFile"
      @close="isFileDetailModalOpen = false" 
    />
  </div>
</template>

<style>
</style>
