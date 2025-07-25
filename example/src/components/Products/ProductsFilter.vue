<script setup>
import { ref, reactive, watch } from "vue";
import router from "@/router/index.js";

const props = defineProps({
	activeFilters: {
		type: Object,
		required: true,
	},
	categories: {
		type: Array,
		required: true,
	},
	brands: {
		type: Array,
		required: true,
	},
});

const emit = defineEmits(["update-filters"]);

const filters = reactive({
	category: props.activeFilters.category,
	brand: props.activeFilters.brand,
	minPrice: props.activeFilters.minPrice,
	maxPrice: props.activeFilters.maxPrice,
	inStock: props.activeFilters.inStock,
	isNew: props.activeFilters.isNew,
});

const priceRanges = [
	{ id: "all", label: "Tous les prix", min: null, max: null },
	{ id: "under-50", label: "Moins de 50€", min: 0, max: 50 },
	{ id: "50-100", label: "50€ - 100€", min: 50, max: 100 },
	{ id: "100-150", label: "100€ - 150€", min: 100, max: 150 },
	{ id: "over-150", label: "Plus de 150€", min: 150, max: null },
];

const selectedPriceRange = ref("all");

watch(
	filters,
	(newFilters) => {
		emit("update-filters", { ...newFilters });
	},
	{ deep: true },
);

watch(selectedPriceRange, (newRange) => {
	const range = priceRanges.find((r) => r.id === newRange);
	filters.minPrice = range.min;
	filters.maxPrice = range.max;
});

function resetFilters() {
	filters.category = null;
	filters.brand = null;
	filters.minPrice = null;
	filters.maxPrice = null;
	filters.inStock = null;
	filters.isNew = null;
	selectedPriceRange.value = "all";
}
</script>

<template>
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm sm:shadow">
    <div class="flex justify-between items-center mb-4 sm:mb-6">
      <h2 class="text-lg font-medium text-gray-900">Filtres</h2>
      <button @click="resetFilters" class="text-sm text-green-600 hover:text-green-800 whitespace-nowrap">
        Réinitialiser
      </button>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-900 mb-3">Catégories</h3>
      <div class="space-y-2">
        <div class="flex items-center">
          <input
            id="category-all"
            type="radio"
            name="category"
            v-model="filters.category"
            :value="null"
            class="h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <label for="category-all" class="ml-2 text-sm text-gray-700">Toutes les catégories</label>
        </div>
        <div v-for="category in categories" :key="category" class="flex items-center">
          <input
            :id="'category-' + category"
            type="radio"
            name="category"
            v-model="filters.category"
            :value="category"
            class="h-4 w-4 text-green-600 focus:ring-green-500"
            @click="router.push(`/category/${category}`)"
          />
          <label :for="'category-' + category" class="ml-2 text-sm text-gray-700">{{ category }}</label>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-900 mb-3">Marques</h3>
      <div class="space-y-2 max-h-40 overflow-y-auto">
        <div class="flex items-center">
          <input
            id="brand-all"
            type="radio"
            name="brand"
            v-model="filters.brand"
            :value="null"
            class="h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <label for="brand-all" class="ml-2 text-sm text-gray-700">Toutes les marques</label>
        </div>
        <div v-for="brand in brands" :key="brand" class="flex items-center">
          <input
            :id="'brand-' + brand"
            type="radio"
            name="brand"
            v-model="filters.brand"
            :value="brand"
            class="h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <label :for="'brand-' + brand" class="ml-2 text-sm text-gray-700">{{ brand }}</label>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-900 mb-3">Prix</h3>
      <div class="space-y-2">
        <div v-for="range in priceRanges" :key="range.id" class="flex items-center">
          <input
            :id="'price-' + range.id"
            type="radio"
            name="price"
            v-model="selectedPriceRange"
            :value="range.id"
            class="h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <label :for="'price-' + range.id" class="ml-2 text-sm text-gray-700">{{ range.label }}</label>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-900 mb-3">Disponibilité</h3>
      <div class="space-y-2">
        <div class="flex items-center">
          <input
            id="availability-all"
            type="radio"
            name="availability"
            v-model="filters.inStock"
            :value="null"
            class="h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <label for="availability-all" class="ml-2 text-sm text-gray-700">Tous les produits</label>
        </div>
        <div class="flex items-center">
          <input
            id="availability-instock"
            type="radio"
            name="availability"
            v-model="filters.inStock"
            :value="true"
            class="h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <label for="availability-instock" class="ml-2 text-sm text-gray-700">En stock</label>
        </div>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-medium text-gray-900 mb-3">Nouveautés</h3>
      <div class="space-y-2">
        <div class="flex items-center">
          <input
            id="new-all"
            type="radio"
            name="new"
            v-model="filters.isNew"
            :value="null"
            class="h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <label for="new-all" class="ml-2 text-sm text-gray-700">Tous les produits</label>
        </div>
        <div class="flex items-center">
          <input
            id="new-only"
            type="radio"
            name="new"
            v-model="filters.isNew"
            :value="true"
            class="h-4 w-4 text-green-600 focus:ring-green-500"
          />
          <label for="new-only" class="ml-2 text-sm text-gray-700">Nouveautés uniquement</label>
        </div>
      </div>
    </div>
  </div>
</template>
