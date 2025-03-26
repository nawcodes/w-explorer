<template>
  <main class="p-4 sm:ml-64 mt-[3.875rem]">
    <!-- Fixed Header -->
    <div class="fixed  top-[3.875rem] right-0 sm:left-64 left-0 bg-gray-100 z-40">
      <div class="px-4 py-3">
        <!-- Top Section -->
        <div class="flex justify-between items-center mb-4">
          <Breadcrumb 
            v-if="currentFolder" 
            :path="currentPath" 
            @navigate="handleBreadcrumbNavigation" 
          />
        </div>

        <!-- Title -->
        <div class="flex gap-2 items-center mb-4">
          <h1 class="text-2xl font-bold">{{ currentFolder?.name || 'Home' }}</h1>
          <button @click="handleDeleteFolder" class="text-red-500 hover:text-red-600">
            <!-- svg trash -->
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>

          </button>
        </div>

        <div v-if="currentFolder" class="flex justify-between items-center gap-2">
          <CreateMenu 
            :is-open="isCreateMenuOpen" 
            @create-folder="handleCreateFolder" 
            @upload-file="handleUploadFile"
            @toggle="toggleCreateMenu" 
          />
          <SortMenu @sort="handleSort" />
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="pt-[10rem]">
      <div class="bg-white rounded-lg shadow p-6 h-full">
        <!-- Welcome Banner when no folders exist -->
        <WelcomeBanner 
          v-if="!currentFolder && !hasAnyFolders"
          @create-folder="handleCreateFolder"
        />
        
        <!-- Empty State for selected folder -->
        <EmptyState 
          v-else-if="isEmpty" 
          title="No items"
          :message="currentFolder ? 'This folder is empty' : 'Select a folder to view its contents'" 
        />

        <!-- Content Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
          <ContentItem 
            v-for="item in sortedItems" 
            :key="item.id" 
            :item="item" 
            @click="handleItemClick"
            @delete="handleItemDelete" 
          />
        </div>
      </div>
    </div>

    <!-- File Detail Modal -->
    <FileDetailModal 
      v-if="selectedFile" 
      :is-open="isFileDetailModalOpen" 
      :file="selectedFile"
      @close="isFileDetailModalOpen = false" 
    />
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Breadcrumb from '@/components/content/Breadcrumb.vue'
import EmptyState from '@/components/content/EmptyState.vue'
import ContentItem from '@/components/content/ContentItem.vue'
import CreateMenu from '@/components/content/CreateMenu.vue'
import SortMenu from '@/components/content/SortMenu.vue'
import FileDetailModal from '@/components/modals/FileDetailModal.vue'
import WelcomeBanner from '@/components/content/WelcomeBanner.vue'
import type { Folder } from '../types/folder'
import type { File } from '../types/file'

const props = defineProps<{
  currentPath: string[]
  isEmpty: boolean
  items: (Folder | File)[]
  currentFolder: Folder | null
  hasAnyFolders: boolean
}>()

const emit = defineEmits([
  'create-folder', 
  'upload-file', 
  'navigate',
  'delete-item'
])

const isCreateMenuOpen = ref(false)
const isFileDetailModalOpen = ref(false)
const selectedFile = ref<File | null>(null)

// Sorting logic
const sortConfig = ref({
  key: 'name',
  compareFn: (a: any, b: any) => a.name.localeCompare(b.name)
})

const sortedItems = computed(() => {
  const folders = props.items.filter((item: Folder | File) => item.type === 'folder')
  const files = props.items.filter((item: Folder | File) => item.type === 'file')

  // Sort folders and files separately
  const sortedFolders = [...folders].sort(sortConfig.value.compareFn)
  const sortedFiles = [...files].sort(sortConfig.value.compareFn)

  // Always show folders first
  return [...sortedFolders, ...sortedFiles]
})

const handleSort = ({ key, compareFn }: { key: string, compareFn: (a: any, b: any) => number }) => {
  sortConfig.value = { key, compareFn }
}

const toggleCreateMenu = () => {
  isCreateMenuOpen.value = !isCreateMenuOpen.value
}

const handleItemClick = (item: Folder | File) => {
  if (item.type === 'folder') {
    emit('navigate', item)
  } else {
    selectedFile.value = item as File
    isFileDetailModalOpen.value = true
  }
}

const handleBreadcrumbNavigation = (index: number | null) => {  
  emit('navigate', index)
}

const handleCreateFolder = () => {
  isCreateMenuOpen.value = false
  emit('create-folder')
}

const handleUploadFile = () => {
  isCreateMenuOpen.value = false
  emit('upload-file')
}

const handleItemDelete = async (item: Folder | File) => {
  if (confirm(`Are you sure you want to delete this ${item.type}?`)) {
    emit('delete-item', item)
  }
}

const handleDeleteFolder = async () => {
  if (confirm(`Are you sure you want to delete this folder?`)) {
    emit('delete-item', props.currentFolder)
  }
}
</script> 