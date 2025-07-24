<script setup>
import { RouterView } from 'vue-router'
import SharedHeader from '@/components/Shared/SharedHeader.vue'
import SharedFooter from '@/components/Shared/SharedFooter.vue'
import CartDrawer from '@/components/Cart/CartDrawer.vue'
</script>

<template>

  <SharedHeader/>

  <RouterView />

  <SharedFooter/>

  <CartDrawer/>
</template>

<style scoped>
</style>
