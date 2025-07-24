<script setup>
import { computed } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const displayPrice = computed(() => {
  if (props.product.discount && props.product.discount > 0) {
    return props.product.price * (1 - props.product.discount / 100)
  }
  return props.product.price
})

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

const productUrl = computed(() => {
  return `/product/${props.product.id}`
})
</script>

<template>
  <div class="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div v-if="product.isNew" class="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
      NOUVEAU
    </div>
    
    <div v-if="product.discount && product.discount > 0" class="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
      -{{ product.discount }}%
    </div>
    
    <div class="relative aspect-square overflow-hidden">
      <img 
        :src="product.image" 
        :alt="product.name" 
        class="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
    
    <div class="p-3 sm:p-4">
      <p class="text-xs sm:text-sm text-gray-600 font-medium truncate">{{ product.brand }}</p>
      
      <h3 class="text-base sm:text-lg font-bold text-gray-900 mt-1 group-hover:text-green-600 transition-colors line-clamp-2 h-12">
        {{ product.name }}
      </h3>
      
      <p class="text-xs sm:text-sm text-gray-500 mt-1">{{ product.category }}</p>
      
      <div class="mt-2 sm:mt-3 flex items-center">
        <span class="text-base sm:text-lg font-bold text-gray-900">{{ formatPrice(displayPrice) }}</span>
        
        <span v-if="product.discount && product.discount > 0" class="ml-2 text-xs sm:text-sm text-gray-500 line-through">
          {{ formatPrice(product.price) }}
        </span>
      </div>
      
      <div class="mt-2 flex items-center">
        <div class="flex">
          <span v-for="i in 5" :key="i" class="text-yellow-400">
            <svg v-if="i <= Math.round(product.rating)" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 sm:h-4 sm:w-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </span>
        </div>
        <span class="ml-1 text-xs text-gray-500">({{ product.reviews }})</span>
      </div>
      
      <div class="mt-2 sm:mt-3">
        <span v-if="product.inStock" class="text-xs font-medium text-green-600">En stock</span>
        <span v-else class="text-xs font-medium text-red-600">Rupture de stock</span>
      </div>
    </div>
    
    <div class="px-3 pb-3 sm:p-4 sm:pt-0">
      <router-link 
        :to="productUrl" 
        class="block w-full py-1.5 sm:py-2 text-center font-medium text-sm text-green-600 bg-white border border-green-600 rounded hover:bg-green-600 hover:text-white transition-colors"
      >
        Voir le produit
      </router-link>
    </div>
  </div>
</template>