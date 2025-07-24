<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const priceHistory = ref([])
const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    const now = new Date()
    const data = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      
      const variance = (Math.random() * 0.2) - 0.1
      const price = props.product.price * (1 + variance)
      
      data.push({
        date: date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' }),
        price: Math.round(price * 100) / 100,
        formattedPrice: new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
      })
    }
    
    priceHistory.value = data
    isLoading.value = false
  }, 800)
})
</script>

<template>
  <div class="mt-12 p-6 border border-gray-200 rounded-lg">
    <h2 class="text-lg font-bold text-gray-900 mb-4">Historique des prix</h2>
    <p class="text-gray-600 mb-6">Évolution du prix au cours des 6 derniers mois.</p>
    
    <div v-if="isLoading" class="h-64 flex items-center justify-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"></div>
    </div>
    
    <div v-else class="h-64 flex flex-col">
      <div class="flex justify-between mb-2">
        <span v-for="item in priceHistory" :key="item.date" class="text-xs text-gray-500">
          {{ item.date }}
        </span>
      </div>
      
      <div class="relative flex-1 flex items-end">
        <div 
          v-for="(item, index) in priceHistory" 
          :key="item.date"
          class="bg-green-600 mx-1 flex-1 rounded-t-sm transition-all duration-500"
          :style="{
            height: `${(item.price / (Math.max(...priceHistory.map(p => p.price)) * 1.1)) * 100}%`,
            opacity: index === priceHistory.length - 1 ? '1' : '0.7'
          }"
        ></div>
      </div>
      
      <div class="flex justify-between mt-2">
        <span v-for="item in priceHistory" :key="item.date" class="text-xs font-medium">
          {{ item.formattedPrice }}
        </span>
      </div>
    </div>
  </div>
</template>