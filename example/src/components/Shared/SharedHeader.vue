<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useProductStore } from "@/stores/productStore";
import CartIcon from "@/components/Cart/CartIcon.vue";
import { useCartStore } from "@/stores/cartStore";
import HeaderSearchResults from "@/components/Header/HeaderSearchResults.vue";

const router = useRouter();
const productStore = useProductStore();
const cartStore = useCartStore();

const menuItems = [
	{ title: "Accueil", url: "/" },
	{ title: "Produits", url: "/products" },
];

const mobileMenuOpen = ref(false);
const searchQuery = ref("");
const searchResults = ref([]);
const showSearchResults = ref(false);
const isSearching = ref(false);

function toggleMobileMenu() {
	mobileMenuOpen.value = !mobileMenuOpen.value;
}

let searchTimeout = null;
watch(searchQuery, async (newQuery) => {
	if (searchTimeout) {
		clearTimeout(searchTimeout);
	}

	if (!newQuery.trim()) {
		searchResults.value = [];
		showSearchResults.value = false;
		return;
	}

	searchTimeout = setTimeout(async () => {
		try {
			isSearching.value = true;
			const results = await productStore.searchProducts(newQuery.trim());
			searchResults.value = results.slice(0, 5);
			showSearchResults.value = true;
		} catch (error) {
			console.error("Erreur lors de la recherche:", error);
			searchResults.value = [];
		} finally {
			isSearching.value = false;
		}
	}, 300);
});

function search() {
	if (searchQuery.value.trim()) {
		router.push({
			path: "/products",
			query: { search: searchQuery.value.trim() },
		});
		hideSearchResults();
	}
}

function selectProduct(product) {
	router.push(`/product/${product.id}`);
	hideSearchResults();
	searchQuery.value = "";
}

function hideSearchResults() {
	showSearchResults.value = false;
}

function formatPrice(price) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price);
}

function handleClickOutside(event) {
	if (!event.target.closest(".search-container")) {
		hideSearchResults();
	}
}

if (typeof window !== "undefined") {
	window.addEventListener("click", handleClickOutside);
}
</script>

<template>
  <header class="border-b shadow-sm sticky top-0 bg-white z-50">
    <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
      <router-link to="/" class="flex items-center">
        <h1 class="text-2xl font-bold text-green-600">StockX Clone</h1>
      </router-link>

      <div class="hidden md:flex items-center relative flex-1 max-w-xl mx-6 search-container">
        <div class="relative w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher des produits..."
            class="border border-gray-300 rounded-full py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            @keyup.enter="search"
            @focus="showSearchResults = searchResults.length > 0"
          >
          <button @click="search" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <HeaderSearchResults v-if="showSearchResults" :search-query="searchQuery" :is-searching="isSearching" :search-results="searchResults" :format-price="formatPrice" />
        </div>
      </div>

      <nav class="hidden md:flex items-center space-x-6">
        <router-link
          v-for="item in menuItems"
          :key="item.title"
          :to="item.url"
          class="hover:text-green-600 font-medium"
          :class="$route.path === item.url ? 'text-green-600' : 'text-gray-700'"
        >
          {{ item.title }}
        </router-link>
        <router-link to="/cart" class="hover:text-green-600 font-medium" :class="$route.path === '/cart' ? 'text-green-600' : 'text-gray-700'">
          Panier
        </router-link>
        <a href="#" class="text-gray-600 hover:text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </a>
        <CartIcon />
      </nav>

      <button @click="toggleMobileMenu" class="md:hidden text-gray-600">
        <svg v-if="!mobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="mobileMenuOpen" class="md:hidden px-4 py-3 border-t bg-white">
      <div class="flex items-center relative mb-3 search-container">
        <div class="relative w-full">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Rechercher des produits..."
            class="border border-gray-300 rounded-full py-2 px-4 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            @keyup.enter="search"
            @focus="showSearchResults = searchResults.length > 0"
          >
          <button @click="search" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <HeaderSearchResults v-if="showSearchResults" :search-query="searchQuery" :isSearching="isSearching" :searchResults="searchResults" :formatPrice="formatPrice"/>
        </div>
      </div>

      <div class="space-y-3">
        <router-link
          v-for="item in menuItems"
          :key="item.title"
          :to="item.url"
          class="block py-2 font-medium"
          :class="$route.path === item.url ? 'text-green-600' : 'text-gray-800 hover:text-green-600'"
          @click="mobileMenuOpen = false"
        >
          {{ item.title }}
        </router-link>
        <div class="flex space-x-4 pt-2 border-t">
          <a href="#" class="text-gray-600 hover:text-green-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mon compte
          </a>
          <router-link
            to="/cart"
            class="text-gray-600 hover:text-green-600 flex items-center"
            :class="$route.path === '/cart' ? 'text-green-600' : ''"
            @click="mobileMenuOpen = false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Panier
            <span
              v-if="cartStore.count > 0"
              class="ml-1 bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs"
            >
              {{ cartStore.count }}
            </span>
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>
