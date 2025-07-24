<script setup>
import { computed } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['reset-filters'])

const activeFiltersCount = computed(() => {
  return Object.values(props.filters).filter(val => val !== null).length
})

const filtersSummary = computed(() => {
  const activeFilters = []

  if (props.filters.category) {
    activeFilters.push(`Catégorie: ${props.filters.category}`)
  }

  if (props.filters.brand) {
    activeFilters.push(`Marque: ${props.filters.brand}`)
  }

  if (props.filters.minPrice !== null && props.filters.maxPrice !== null) {
    activeFilters.push(`Prix: ${props.filters.minPrice}€ - ${props.filters.maxPrice}€`)
  } else if (props.filters.minPrice !== null) {
    activeFilters.push(`Prix: > ${props.filters.minPrice}€`)
  } else if (props.filters.maxPrice !== null) {
    activeFilters.push(`Prix: < ${props.filters.maxPrice}€`)
  }

  if (props.filters.inStock === true) {
    activeFilters.push('En stock')
  }

  if (props.filters.isNew === true) {
    activeFilters.push('Nouveautés')
  }

  return activeFilters
})

function resetFilters() {
  emit('reset-filters')
}
</script>

<template>
  <div v-if="activeFiltersCount > 0" class="bg-gray-100 p-3 rounded-md mb-4">
    <div class="flex justify-between items-center">
      <div>
        <span class="text-sm font-medium text-gray-700">Filtres actifs: {{ activeFiltersCount }}</span>
      </div>
      <button 
        @click="resetFilters"
        class="text-xs text-green-600 hover:text-green-800 font-medium"
      >
        Réinitialiser
      </button>
    </div>
    
    <div class="mt-2 flex flex-wrap gap-2">
      <span 
        v-for="(filter, index) in filtersSummary" 
        :key="index"
        class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-white border border-gray-300 text-gray-800"
      >
        {{ filter }}
      </span>
    </div>
  </div>
</template>