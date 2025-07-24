<script setup>
defineProps({
	searchQuery: {
		type: String,
		required: true,
	},
	isSearching: {
		type: Boolean,
		required: true,
	},
	searchResults: {
		type: Array,
		required: true,
	},
	formatPrice: {
		type: Function,
		required: true,
	},
});
</script>
<template>
  <div
    class="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50"
  >
    <div v-if="isSearching" class="p-4 text-center">
      <div class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-gray-200 border-t-green-600"></div>
      <span class="ml-2 text-sm text-gray-600">Recherche en cours...</span>
    </div>

    <div v-else-if="searchResults.length > 0">
      <div
        v-for="product in searchResults"
        :key="product.id"
        @click="selectProduct(product)"
        class="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
      >
        <img
          :src="product.image"
          :alt="product.name"
          class="w-12 h-12 object-cover rounded-md mr-3"
        >
        <div class="flex-1">
          <h4 class="text-sm font-medium text-gray-900">{{ product.name }}</h4>
          <p class="text-xs text-gray-600">{{ product.brand }}</p>
          <p class="text-sm font-semibold text-green-600">{{ formatPrice(product.price) }}</p>
        </div>
      </div>

      <div
        @click="search"
        class="p-3 text-center border-t border-gray-200 cursor-pointer hover:bg-gray-50"
      >
                <span class="text-sm text-green-600 font-medium">
                  Voir tous les résultats pour "{{ searchQuery }}"
                </span>
      </div>
    </div>

    <div v-else-if="searchQuery.trim()" class="p-4 text-center">
      <p class="text-sm text-gray-600">Aucun produit trouvé pour "{{ searchQuery }}"</p>
    </div>
  </div>
</template>
