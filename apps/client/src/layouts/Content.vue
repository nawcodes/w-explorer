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
    <div class="pt-[8rem]">
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
        <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ContentItem 
            v-for="item in sortedItems" 
            :key="item.id" 
            :item="item" 
            @click="handleItemClick" 
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

const emit = defineEmits(['create-folder', 'upload-file', 'navigate'])

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
</script> 