<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import ProductTrendingCard from '../Product/ProductTrendingCard.vue'

const productStore = useProductStore()

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }
})

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}
</script>

<template>
  <section class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Tendances populaires</h2>
        <p class="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
          Les articles les plus recherchés et les plus vendus cette semaine.
        </p>
      </div>

      <div v-if="productStore.isLoading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"
        ></div>
        <p class="mt-4 text-gray-500">Chargement des tendances...</p>
      </div>

      <div v-else-if="productStore.error" class="text-center py-12">
        <p class="text-red-500">{{ productStore.error }}</p>
        <button
          @click="productStore.fetchProducts"
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Réessayer
        </button>
      </div>

      <div v-else-if="productStore.bestSellers.length > 0" class="grid grid-cols-1 gap-8">
        <ProductTrendingCard
          v-for="product in productStore.bestSellers"
          :key="product.id"
          :product="product"
          :formatted-price="formatPrice(product.price)"
        />
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">Aucune tendance disponible actuellement.</p>
      </div>
    </div>
  </section>
</template>