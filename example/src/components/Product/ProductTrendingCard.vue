
<script setup>
defineProps({
	product: {
		type: Object,
		required: true,
	},
	formattedPrice: {
		type: String,
		required: true,
	},
});
</script>

<template>
  <div
    class="flex flex-col md:flex-row bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
  >
    <div class="md:w-1/3 lg:w-1/4">
      <img
        :src="product.image"
        :alt="product.name"
        class="w-full h-64 md:h-full object-cover object-center"
      />
    </div>

    <div class="p-6 md:w-2/3 lg:w-3/4 flex flex-col">
      <div class="flex-1">
        <div class="flex justify-between items-start">
          <div>
            <p class="text-sm text-gray-600 font-medium">{{ product.brand }}</p>
            <h3 class="text-xl font-bold text-gray-900 mt-1">{{ product.name }}</h3>
          </div>
          <div class="bg-gray-100 px-3 py-1 rounded">
            <div class="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 10l7-7m0 0L5 3m7 0v18"
                />
              </svg>
              <span class="ml-1 text-sm font-medium text-gray-900">Trending</span>
            </div>
          </div>
        </div>

        <p class="mt-4 text-gray-600">{{ product.description }}</p>

        <div class="mt-4 flex flex-wrap gap-2">
          <span
            v-for="(feature, index) in product.features"
            :key="index"
            class="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
          >
            {{ feature }}
          </span>
        </div>
      </div>

      <div
        class="mt-6 pt-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center"
      >
        <div>
          <div class="flex items-center">
            <span class="text-2xl font-bold text-gray-900">{{ formattedPrice }}</span>
            <span
              v-if="product.discount && product.discount > 0"
              class="ml-2 text-sm text-green-600 font-medium"
            >
              -{{ product.discount }}%
            </span>
          </div>
          <div class="mt-1 flex items-center">
            <div class="flex text-yellow-400">
              <svg
                v-for="i in 5"
                :key="i"
                xmlns="http://www.w3.org/2000/svg"
                :class="i <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                />
              </svg>
            </div>
            <span class="ml-1 text-xs text-gray-500"
              >{{ product.rating }} ({{ product.reviews }} avis)</span
            >
          </div>
        </div>

        <div class="mt-4 sm:mt-0 flex space-x-2">
          <button
            class="px-5 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition"
          >
            Détails
          </button>
          <button
            class="px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
          >
            Acheter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>