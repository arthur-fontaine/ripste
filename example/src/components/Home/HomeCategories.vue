<script setup>
import { onMounted } from "vue";
import { useProductStore } from "@/stores/productStore";

const productStore = useProductStore();

onMounted(async () => {
	if (productStore.homeCategories.length === 0) {
		await productStore.fetchHomeCategories();
	}
});
</script>

<template>
  <section class="py-12 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Parcourir par catégorie</h2>
        <p class="mt-3 max-w-2xl mx-auto text-lg text-gray-600">
          Trouvez exactement ce que vous cherchez parmi nos collections.
        </p>
      </div>

      <div v-if="productStore.isLoadingCategories" class="text-center py-12">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"
        ></div>
        <p class="mt-4 text-gray-500">Chargement des catégories...</p>
      </div>

      <div v-else-if="productStore.categoryError" class="text-center py-12">
        <p class="text-red-500">{{ productStore.categoryError }}</p>
        <button
          @click="productStore.fetchHomeCategories"
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Réessayer
        </button>
      </div>

      <div
        v-else-if="productStore.homeCategories.length > 0"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="category in productStore.homeCategories"
          :key="category.id"
          class="group relative rounded-lg overflow-hidden bg-white shadow hover:shadow-lg transition-shadow duration-300"
        >
          <div class="h-48 overflow-hidden">
            <img
              :src="category.image"
              :alt="category.name"
              class="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div
            class="absolute inset-0 bg-black/35 flex flex-col justify-end p-6 group-hover:bg-opacity-40 transition-all duration-300"
          >
            <h3 class="text-xl font-bold text-white">{{ category.name }}</h3>
            <p class="text-sm text-white mt-1">{{ category.description }}</p>
            <router-link
              :to="`/category/${category.slug}`"
              class="mt-4 bg-white text-gray-900 text-center px-4 py-2 rounded text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              Explorer
            </router-link>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-12">
        <p class="text-gray-500">Aucune catégorie disponible.</p>
      </div>
    </div>
  </section>
</template>