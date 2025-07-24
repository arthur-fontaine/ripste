<script setup>
defineProps({
	product: {
		type: Object,
		required: true,
	},
});
</script>

<template>
  <div class="mb-6">
    <div class="flex items-center text-sm text-gray-500">
      <router-link to="/" class="hover:text-gray-900">Accueil</router-link>
      <svg class="mx-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
      <router-link :to="`/category/${product.category.toLowerCase()}`" class="hover:text-gray-900">
        {{ product.category }}
      </router-link>
      <svg class="mx-2 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
      <span class="font-medium text-gray-900">{{ product.name }}</span>
    </div>
  </div>
</template>