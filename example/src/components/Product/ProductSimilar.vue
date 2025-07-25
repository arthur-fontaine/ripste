<script setup>
import { computed } from "vue";
import { useProductStore } from "@/stores/productStore";

const props = defineProps({
	product: {
		type: Object,
		required: true,
	},
	limit: {
		type: Number,
		default: 4,
	},
});

const productStore = useProductStore();

const similarProducts = computed(() => {
	return productStore
		.getProductsByCategory(props.product.category)
		.filter((p) => p.id !== props.product.id)
		.slice(0, props.limit);
});

function formatPrice(price) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price);
}
</script>

<template>
  <div v-if="similarProducts.length > 0" class="mt-16">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Produits similaires</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div 
        v-for="similarProduct in similarProducts" 
        :key="similarProduct.id"
        class="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
      >
        <div class="relative aspect-square overflow-hidden">
          <img 
            :src="similarProduct.image" 
            :alt="similarProduct.name" 
            class="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        
        <div class="p-4">
          <p class="text-sm text-gray-600 font-medium">{{ similarProduct.brand }}</p>
          <h3 class="text-lg font-medium text-gray-900 mt-1 group-hover:text-green-600 transition-colors">
            {{ similarProduct.name }}
          </h3>
          <p class="mt-2 font-bold text-gray-900">{{ formatPrice(similarProduct.price) }}</p>
        </div>
        
        <router-link 
          :to="`/product/${similarProduct.id}`" 
          class="absolute inset-0 z-10"
          aria-hidden="true"
        ></router-link>
      </div>
    </div>
  </div>
</template>