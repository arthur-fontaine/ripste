<script setup>
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();
</script>

<template>
  <button @click="cartStore.toggleCart" class="relative cart-button text-gray-600 hover:text-green-600">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>

    <span v-if="cartStore.count > 0"
      class="absolute -top-2 -right-2 bg-green-600 text-white rounded-full text-xs flex items-center justify-center h-5 w-5 font-bold">
      {{ cartStore.count }}
    </span>
  </button>
</template>
