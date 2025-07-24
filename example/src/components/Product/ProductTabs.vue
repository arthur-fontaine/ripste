<!-- src/components/Product/ProductTabs.vue -->
<script setup>
import { ref } from 'vue'

defineProps({
  product: {
    type: Object,
    required: true
  }
})

const activeTab = ref('description')
</script>

<template>
  <div class="mt-12 border-t border-gray-200">
    <div class="flex border-b">
      <button 
        @click="activeTab = 'description'" 
        class="py-4 px-6 font-medium text-sm focus:outline-none"
        :class="activeTab === 'description' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'"
      >
        Description
      </button>
      <button 
        @click="activeTab = 'details'" 
        class="py-4 px-6 font-medium text-sm focus:outline-none"
        :class="activeTab === 'details' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'"
      >
        Détails
      </button>
      <button 
        @click="activeTab = 'reviews'" 
        class="py-4 px-6 font-medium text-sm focus:outline-none"
        :class="activeTab === 'reviews' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'"
      >
        Avis ({{ product.reviews }})
      </button>
    </div>
    
    <div class="py-6">
      <div v-if="activeTab === 'description'" class="prose max-w-none">
        <p>{{ product.description }}</p>
      </div>
      
      <div v-else-if="activeTab === 'details'" class="prose max-w-none">
        <h3>Matériaux</h3>
        <ul>
          <li v-for="(material, index) in product.materials" :key="index">{{ material }}</li>
        </ul>
        
        <h3 class="mt-6">Caractéristiques</h3>
        <ul>
          <li v-for="(feature, index) in product.features" :key="index">{{ feature }}</li>
        </ul>
        
        <h3 class="mt-6">Mots-clés</h3>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="(tag, index) in product.tags" 
            :key="index"
            class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      
      <div v-else-if="activeTab === 'reviews'" class="prose max-w-none">
        <div class="flex items-center mb-6">
          <div class="flex items-center">
            <div class="flex text-yellow-400">
              <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="ml-2 text-xl font-bold text-gray-900">{{ product.rating }}</span>
            <span class="ml-1 text-gray-600">({{ product.reviews }} avis)</span>
          </div>
          <button class="ml-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            Écrire un avis
          </button>
        </div>
        
        <div class="border-t border-gray-200 pt-6">
          <p class="text-gray-500 italic">Les avis ne sont pas encore disponibles pour ce produit.</p>
        </div>
      </div>
    </div>
  </div>
</template>