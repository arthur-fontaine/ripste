<script setup lang="ts">
import Navigation from "./components/Navigation.vue";
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-100">
    <Navigation />
    <main class="min-h-[calc(100vh-80px)]">
      <router-view />
    </main>
  </div>
</template>

<style>
/* Styles globaux si nécessaire */
</style>
