<template>
  <aside :class="[
    'fixed left-0 z-40 w-64 h-screen transition-transform',
    isOpen ? 'translate-x-0' : '-translate-x-full',
    'sm:translate-x-0'
  ]">
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50">
      <!-- Search Box -->
      <div class="mb-4">
        <div class="relative">
          <input type="text" 
            class="w-full pl-10 pr-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search folders..."
          >
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

       

      <!-- Folder Navigation -->
      <nav class="space-y-1">
        <!-- button create folder -->

        <div class="flex items-center px-2 py-2 text-sm font-medium text-gray-600 uppercase">
            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
            </svg>
            <button class="text-sm font-medium text-gray-600 uppercase hover:text-gray-800  ">
                Create Source Folder
            </button>
        </div>
        <!-- Favorites Section -->
        <div class="mb-4">
          <div class="flex items-center px-2 py-2 text-sm font-medium text-gray-600 uppercase">
            <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Favorites
          </div>
          <FolderTreeItem 
            :folder="rootFolder"
            :level="0"
            :max-depth="5"
          />
        </div>

        <!-- All Folders Section -->
        <div>
          <div class="flex items-center px-2 py-2 text-sm font-medium text-gray-600 uppercase">
            <svg class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            All Folders
          </div>
          <FolderTreeItem 
            :folder="rootFolder"
            :level="0"
            :max-depth="5"
          />
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FolderTreeItem from '@/components/FolderTreeItem.vue'
import type { Folder } from '../types/folder';

defineProps<{
  isOpen: boolean
}>()

const rootFolder = ref<Folder>({
  id: 'root',
  name: 'Root',
  path: '/',
  isOpen: true,
  subfolders: []
})
</script> 