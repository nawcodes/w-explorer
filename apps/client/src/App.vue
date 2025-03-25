<script setup lang="ts">
import { onMounted } from 'vue';
import { initFlowbite } from 'flowbite';

import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'


onMounted(() => {
    initFlowbite();
})
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style>
</style>
