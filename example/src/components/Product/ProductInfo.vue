<script setup>
import { ref, computed } from "vue";

const props = defineProps({
	product: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["add-to-cart"]);

const selectedSize = ref(
	props.product.sizes?.length > 0 ? props.product.sizes[0] : null,
);
const selectedColor = ref(
	props.product.colors?.length > 0 ? props.product.colors[0] : null,
);

const colorMap = {
	"Navy Blue": "#0a192f",
	Burgundy: "#800020",
	"Light Blue": "#add8e6",
};

const displayPrice = computed(() => {
	if (props.product.discount && props.product.discount > 0) {
		return props.product.price * (1 - props.product.discount / 100);
	}
	return props.product.price;
});

function formatPrice(price) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price);
}

function addToCart() {
	emit("add-to-cart", {
		product: props.product,
		size: selectedSize.value,
		color: selectedColor.value,
		quantity: 1,
	});
}

function getColorHex(colorName) {
	if (colorMap[colorName]) {
		return colorMap[colorName];
	}

	return colorName.toLowerCase();
}
</script>

<template>
  <div class="product-info">
    <div class="mb-4">
      <p class="text-sm text-gray-600 font-medium">{{ product.brand }}</p>
      <h1 class="text-3xl font-bold text-gray-900 mt-1">{{ product.name }}</h1>
    </div>

    <div class="mt-6">
      <div class="flex items-baseline">
        <span class="text-2xl font-bold text-gray-900">{{ formatPrice(displayPrice) }}</span>
        <span v-if="product.discount && product.discount > 0" class="ml-2 text-lg text-gray-500 line-through">
          {{ formatPrice(product.price) }}
        </span>
        <span v-if="product.discount && product.discount > 0" class="ml-2 inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
          -{{ product.discount }}%
        </span>
      </div>

      <div class="mt-2">
        <span v-if="product.inStock" class="text-sm font-medium text-green-600">En stock</span>
        <span v-else class="text-sm font-medium text-red-600">Rupture de stock</span>
      </div>
    </div>

    <div class="mt-4 flex items-center">
      <div class="flex text-yellow-400">
        <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg" :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
      <span class="ml-2 text-gray-600">{{ product.rating }} ({{ product.reviews }} avis)</span>
    </div>

    <div class="mt-4 text-gray-700">
      <p>{{ product.description }}</p>
    </div>

    <div v-if="product.colors && product.colors.length > 0" class="mt-6">
      <h3 class="text-sm font-medium text-gray-900">Couleur</h3>
      <div class="mt-2 flex space-x-2">
        <button
          v-for="color in product.colors"
          :key="color"
          @click="selectedColor = color"
          class="relative p-0.5 rounded-full flex items-center justify-center focus:outline-none ring-2 ring-offset-2"
          :class="[
            selectedColor === color
              ? 'ring-green-500'
              : 'ring-transparent hover:ring-gray-300'
          ]"
        >
          <span
            class="h-8 w-8 rounded-full border border-black border-opacity-10"
            :style="{ backgroundColor: getColorHex(color) }"
            :title="color"
          ></span>
        </button>
      </div>
    </div>

    <div v-if="product.sizes && product.sizes.length > 0" class="mt-6">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-900">Taille</h3>
        <a href="#" class="text-sm font-medium text-green-600 hover:text-green-500">Guide des tailles</a>
      </div>
      <div class="mt-2 grid grid-cols-4 gap-2">
        <button
          v-for="size in product.sizes"
          :key="size"
          @click="selectedSize = size"
          class="py-2 px-4 text-center border rounded-md text-sm font-medium focus:outline-none"
          :class="[
            selectedSize === size
              ? 'bg-gray-900 text-white border-transparent'
              : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
          ]"
        >
          {{ size }}
        </button>
      </div>
    </div>

    <div class="mt-8 flex flex-col space-y-3">
      <button
        @click="addToCart"
        class="w-full py-3 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
        :disabled="!product.inStock"
      >
        Ajouter au panier
      </button>
      <button class="w-full py-3 px-4 border border-gray-300 font-medium rounded-md hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-gray-500">
        Ajouter aux favoris
      </button>
    </div>

    <div class="mt-6">
      <h3 class="text-sm font-medium text-gray-900">Caractéristiques</h3>
      <div class="mt-2 flex flex-wrap gap-2">
        <span
          v-for="(feature, index) in product.features"
          :key="index"
          class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
        >
          {{ feature }}
        </span>
      </div>
    </div>
  </div>
</template>
