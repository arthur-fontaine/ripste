<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const currentSlide = ref(0)
let slideInterval = null

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % productStore.heroSlides.length
}

function prevSlide() {
  currentSlide.value =
    (currentSlide.value - 1 + productStore.heroSlides.length) % productStore.heroSlides.length
}

function setSlide(index) {
  currentSlide.value = index
}

onMounted(async () => {
  if (productStore.heroSlides.length === 0) {
    await productStore.fetchHeroSlides()
  }

  slideInterval = setInterval(() => {
    nextSlide()
  }, 7000)
})

onBeforeUnmount(() => {
  if (slideInterval) clearInterval(slideInterval)
})
</script>

<template>
  <section class="relative overflow-hidden" style="height: 500px">
    <div
      v-if="productStore.isLoadingHero"
      class="w-full h-full flex items-center justify-center bg-gray-100"
    >
      <div
        class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-green-600"
      ></div>
    </div>

    <div v-else class="w-full h-full relative">
      <div
        v-for="(slide, index) in productStore.heroSlides"
        :key="slide.id"
        class="absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out"
        :class="index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'"
      >
        <img :src="slide.image" :alt="slide.title" class="w-full h-full object-cover" />

        <div class="absolute inset-0 opacity-40" :class="slide.bgColor"></div>

        <div
          class="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-24 text-white z-20"
        >
          <div class="max-w-md">
            <h2 class="text-4xl md:text-5xl font-bold mb-2">{{ slide.title }}</h2>
            <p class="text-lg md:text-xl mb-6">{{ slide.subtitle }}</p>
            <button
              class="bg-white text-gray-900 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition"
            >
              {{ slide.cta }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="!productStore.isLoadingHero && productStore.heroSlides.length > 1"
      class="absolute inset-y-0 left-0 flex items-center z-20"
    >
      <button
        @click="prevSlide"
        class="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 mx-3 rounded-full focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>
    <div
      v-if="!productStore.isLoadingHero && productStore.heroSlides.length > 1"
      class="absolute inset-y-0 right-0 flex items-center z-20"
    >
      <button
        @click="nextSlide"
        class="bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-3 mx-3 rounded-full focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div
      v-if="!productStore.isLoadingHero && productStore.heroSlides.length > 1"
      class="absolute bottom-5 left-0 right-0 flex justify-center z-20 space-x-2"
    >
      <button
        v-for="(slide, index) in productStore.heroSlides"
        :key="slide.id"
        @click="setSlide(index)"
        class="w-3 h-3 rounded-full focus:outline-none transition-all duration-300"
        :class="
          currentSlide === index
            ? 'bg-white scale-125'
            : 'bg-white bg-opacity-50 hover:bg-opacity-75'
        "
      ></button>
    </div>
  </section>
</template>