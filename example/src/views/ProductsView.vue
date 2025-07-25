<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProductStore } from "@/stores/productStore";
import ProductCard from "@/components/Product/ProductCard.vue";
import ProductsFilter from "@/components/Products/ProductsFilter.vue";
import ProductsSorting from "@/components/Products/ProductsSorting.vue";
import ProductsPagination from "@/components/Products/ProductsPagination.vue";
import ProductsHeader from "@/components/Products/ProductsHeader.vue";
import ProductsFilterSummary from "@/components/Products/ProductsFilterSummary.vue";

const route = useRoute();
const router = useRouter();
const productStore = useProductStore();

const isLoading = ref(true);
const mobileFiltersOpen = ref(false);
const searchResults = ref([]);
const isSearchMode = ref(false);
const searchQuery = ref("");

const activeFilters = ref({
	category: null,
	brand: null,
	minPrice: null,
	maxPrice: null,
	inStock: null,
	isNew: null,
});

const sortOption = ref("default");
const currentPage = ref(1);
const itemsPerPage = ref(12);

const categoryFromRoute = computed(() => {
	return route.params.category
		? productStore.categories.find(
				(c) => c.toLowerCase() === route.params.category.toLowerCase(),
			)
		: null;
});

const displayedProducts = computed(() => {
	if (isSearchMode.value) {
		return searchResults.value;
	}
	return productStore.filterProducts(activeFilters.value);
});

const allFilteredProducts = computed(() => {
	const products = [...displayedProducts.value];

	if (sortOption.value === "price-asc") {
		return products.sort((a, b) => a.price - b.price);
	}
	if (sortOption.value === "price-desc") {
		return products.sort((a, b) => b.price - a.price);
	}
	if (sortOption.value === "rating") {
		return products.sort((a, b) => b.rating - a.rating);
	}
	if (sortOption.value === "newest") {
		return products.sort((a, b) =>
			b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1,
		);
	}

	return products;
});

const paginatedProducts = computed(() => {
	const startIndex = (currentPage.value - 1) * itemsPerPage.value;
	const endIndex = startIndex + itemsPerPage.value;
	return allFilteredProducts.value.slice(startIndex, endIndex);
});

const pageTitle = computed(() => {
	if (isSearchMode.value && searchQuery.value) {
		return `Résultats pour "${searchQuery.value}"`;
	}
	return categoryFromRoute.value
		? categoryFromRoute.value
		: "Tous les produits";
});

async function performSearch(query) {
	if (!query || !query.trim()) {
		isSearchMode.value = false;
		searchResults.value = [];
		return;
	}

	try {
		isLoading.value = true;
		const results = await productStore.searchProducts(query.trim());
		searchResults.value = results;
		isSearchMode.value = true;
		currentPage.value = 1;
	} catch (error) {
		console.error("Erreur lors de la recherche:", error);
		searchResults.value = [];
		isSearchMode.value = false;
	} finally {
		isLoading.value = false;
	}
}

function updateFilters(filters) {
	activeFilters.value = filters;
	isSearchMode.value = false;

	if (route.query.search) {
		router.replace({ query: { ...route.query, search: undefined } });
	}
}

function resetAllFilters() {
	updateFilters({
		category: null,
		brand: null,
		minPrice: null,
		maxPrice: null,
		inStock: null,
		isNew: null,
	});
	mobileFiltersOpen.value = false;

	if (route.query.search) {
		router.replace({ query: {} });
	}
}

function updateSorting(option) {
	sortOption.value = option;
}

function changePage(page) {
	currentPage.value = page;
	window.scrollTo({
		top: document.querySelector(".products-grid")?.offsetTop - 20 || 0,
		behavior: "smooth",
	});
}

watch(
	() => route.query.search,
	(newSearch) => {
		if (newSearch && newSearch !== searchQuery.value) {
			searchQuery.value = newSearch;
			performSearch(newSearch);
		} else if (!newSearch && isSearchMode.value) {
			isSearchMode.value = false;
			searchResults.value = [];
			searchQuery.value = "";
		}
	},
	{ immediate: true },
);

watch(
	() => route.params.category,
	(newCategory) => {
		if (newCategory && categoryFromRoute.value) {
			activeFilters.value.category = categoryFromRoute.value;
			currentPage.value = 1;
			isSearchMode.value = false;
		} else {
			activeFilters.value.category = null;
		}
	},
	{ immediate: true },
);

watch(
	activeFilters,
	() => {
		currentPage.value = 1;
	},
	{ deep: true },
);

watch(sortOption, () => {
	currentPage.value = 1;
});

onMounted(async () => {
	if (productStore.products.length === 0) {
		await productStore.fetchProducts();
	}

	if (categoryFromRoute.value) {
		activeFilters.value.category = categoryFromRoute.value;
	}

	if (route.query.search) {
		searchQuery.value = route.query.search;
		await performSearch(route.query.search);
	}

	isLoading.value = false;
});
</script>

<template>
  <main>
    <ProductsHeader :title="pageTitle" :category="!isSearchMode ? categoryFromRoute : null" />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            {{ isSearchMode ? 'Résultats de recherche' : 'Explorer' }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ allFilteredProducts.length }} produits
            {{ isSearchMode ? `trouvés pour "${searchQuery}"` : 'disponibles' }}
          </p>
        </div>
        <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
          <button
            class="sm:hidden px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 bg-white shadow-sm hover:bg-gray-50"
            @click="mobileFiltersOpen = !mobileFiltersOpen"
          >
            Filtres
            <span class="ml-1 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
              {{ Object.values(activeFilters).filter((v) => v !== null).length + (isSearchMode ? 1 : 0) }}
            </span>
          </button>
          <ProductsSorting :selected="sortOption" @update-sorting="updateSorting" />
        </div>
      </div>

      <div v-if="isSearchMode && searchQuery" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span class="text-sm text-blue-800">
              Recherche active : <strong>"{{ searchQuery }}"</strong>
            </span>
          </div>
          <button
            @click="resetAllFilters"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ✕ Effacer
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-col lg:flex-row gap-8 mx-auto px-4 sm:px-6 lg:px-8 pb-8">
      <div class="lg:w-1/4">
        <ProductsFilter
          :active-filters="activeFilters"
          :categories="productStore.categories"
          :brands="[...new Set(productStore.products.map((p) => p.brand))]"
          @update-filters="updateFilters"
        />
      </div>

      <div class="lg:w-3/4">
        <div v-if="isLoading" class="flex justify-center items-center py-20">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600"></div>
        </div>

        <div v-else-if="allFilteredProducts.length === 0" class="py-12 text-center">
          <div class="mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p class="text-gray-500 text-lg mb-2">
            {{ isSearchMode ? `Aucun résultat pour "${searchQuery}"` : 'Aucun produit ne correspond à vos critères.' }}
          </p>
          <p class="text-gray-400 text-sm mb-6">
            {{ isSearchMode ? 'Essayez avec des mots-clés différents.' : 'Essayez de modifier vos filtres.' }}
          </p>
          <button @click="resetAllFilters" class="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            {{ isSearchMode ? 'Effacer la recherche' : 'Réinitialiser les filtres' }}
          </button>
        </div>

        <div v-else>
          <div class="mb-4 text-sm text-gray-500">
            {{ allFilteredProducts.length }} produits trouvés
          </div>

          <div class="sm:hidden">
            <ProductsFilterSummary :filters="activeFilters" @reset-filters="resetAllFilters" />
          </div>

          <div class="hidden lg:block lg:ml-4 mb-4">
            <ProductsFilterSummary :filters="activeFilters" @reset-filters="resetAllFilters" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 products-grid">
            <ProductCard v-for="product in paginatedProducts" :key="product.id" :product="product" />
          </div>

          <ProductsPagination
            :current-page="currentPage"
            :total-items="allFilteredProducts.length"
            :items-per-page="itemsPerPage"
            @page-changed="changePage"
          />
        </div>
      </div>
    </div>
  </main>
</template>
