<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import ProductCard from '@/components/Product/ProductCard.vue'

const productStore = useProductStore()

onMounted(async () => {
  if (productStore.products.length === 0) {
    await productStore.fetchProducts()
  }
})
</script>

<template>
  <section class="py-12 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Produits en vedette</h2>
        <p class="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
          Les articles les plus populaires et les plus recherchés sur notre plateforme.
        </p>
      </div>

      <div v-if="productStore.isLoading" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"
        ></div>
        <p class="mt-4 text-gray-500">Chargement des produits...</p>
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

      <div
        v-else-if="productStore.featuredProducts.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ProductCard
          v-for="product in productStore.featuredProducts"
          :key="product.id"
          :product="product"
        />
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">Aucun produit en vedette disponible.</p>
      </div>

      <div class="mt-10 text-center">
        <router-link
          to="/products"
          class="inline-block px-6 py-3 border border-gray-900 text-gray-900 font-medium rounded hover:bg-gray-900 hover:text-white transition"
        >
          Voir tous les produits
        </router-link>
      </div>
    </div>
  </section>
</template>
