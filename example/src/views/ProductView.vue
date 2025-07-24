<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/productStore'
import { useCartStore } from '@/stores/cartStore.js'

import ProductBreadcrumb from '@/components/Product/ProductBreadcrumb.vue'
import ProductGallery from '@/components/Product/ProductGallery.vue'
import ProductInfo from '@/components/Product/ProductInfo.vue'
import ProductTabs from '@/components/Product/ProductTabs.vue'
import ProductPriceHistory from '@/components/Product/ProductPriceHistory.vue'
import ProductSimilar from '@/components/Product/ProductSimilar.vue'

const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
const isLoading = ref(true)
const error = ref(null)
const product = ref(null)

const productId = computed(() => parseInt(route.params.id))

onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null

    let foundProduct = productStore.getProductById(productId.value)

    if (!foundProduct) {
      foundProduct = await productStore.fetchProductById(productId.value)
    }

    if (!foundProduct) {
      error.value = "Produit introuvable"
      return
    }

    product.value = foundProduct

    if (productStore.products.length === 0) {
      await productStore.fetchProducts()
    }

  } catch (err) {
    console.error('Erreur lors du chargement du produit:', err)
    error.value = "Une erreur est survenue lors du chargement du produit."
  } finally {
    isLoading.value = false
  }
})

function handleAddToCart(cartItem) {
  cartStore.addItem(
    cartItem.product,
    cartItem.size,
    cartItem.color,
    cartItem.quantity
  )
}
</script>

<template>
  <main class="py-8">
    <div v-if="isLoading" class="max-w-7xl mx-auto px-4 py-12 flex justify-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600"></div>
    </div>

    <div v-else-if="error" class="max-w-7xl mx-auto px-4 py-12 text-center">
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 class="text-xl font-bold text-red-600 mb-2">{{ error }}</h2>
        <p class="text-gray-600 mb-4">Veuillez vérifier l'URL ou revenir à la page d'accueil.</p>
        <router-link to="/" class="inline-block px-6 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition">
          Retour à l'accueil
        </router-link>
      </div>
    </div>

    <div v-else-if="product" class="max-w-7xl mx-auto px-4">
      <ProductBreadcrumb :product="product" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <ProductGallery :main-image="product.image" :images="product.images ?? []" />

        <ProductInfo :product="product" @add-to-cart="handleAddToCart" />
      </div>

      <ProductTabs :product="product" />

      <ProductPriceHistory :product="product" />

      <ProductSimilar :product="product" :limit="4" />
    </div>
  </main>
</template>
