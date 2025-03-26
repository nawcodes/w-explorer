<template>
  <main class="p-4 sm:ml-64 mt-[3.875rem]">
    <!-- Fixed Header -->
    <div class="fixed top-[3.875rem] right-0 sm:left-64 left-0 bg-gray-100 z-40">
      <div class="px-4 py-3">
        <!-- Breadcrumbs -->
        <Breadcrumb 
          :path="currentPath" 
          @navigate="handleBreadcrumbNavigation" 
        />

        <!-- Action Buttons -->
        <div class="flex gap-2">
          <CreateMenu 
            :is-open="isCreateMenuOpen"
            @create-folder="handleCreateFolder"
            @upload-file="handleUploadFile"
            @toggle="toggleCreateMenu"
          />
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div class="pt-[8rem]">
      <div class="bg-white rounded-lg shadow p-6 h-full">
        <!-- Empty State -->
        <EmptyState
          v-if="isEmpty"
          title="No items"
          :message="currentFolder ? 'This folder is empty' : 'Select a folder to view its contents'"
        />

        <!-- Content Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ContentItem
            v-for="item in items"
            :key="item.id"
            :item="item"
            @click="handleItemClick"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Breadcrumb from '@/components/content/Breadcrumb.vue'
import EmptyState from '@/components/content/EmptyState.vue'
import ContentItem from '@/components/content/ContentItem.vue'
import CreateMenu from '@/components/content/CreateMenu.vue'
import type { Folder } from '../types/folder'

const props = defineProps<{
  currentPath: string[]
  isEmpty: boolean
  items: Folder[]
  currentFolder: Folder | null
}>()


const emit = defineEmits(['create-folder', 'upload-file', 'navigate'])

const isCreateMenuOpen = ref(false)

const toggleCreateMenu = () => {
  isCreateMenuOpen.value = !isCreateMenuOpen.value
}

const handleItemClick = (item: Folder) => {    
  emit('navigate', item)
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