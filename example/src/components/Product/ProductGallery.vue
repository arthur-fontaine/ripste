<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    required: false,
    default: () => []
  },
  mainImage: {
    type: String,
    required: true
  }
})

const selectedImage = ref(props.mainImage)

const allImages = computed(() => {
  return [props.mainImage, ...props.images].filter(Boolean)
})

function selectImage(image) {
  selectedImage.value = image
}
</script>

<template>
  <div class="product-gallery">
    <div class="mb-4 overflow-hidden rounded-lg bg-gray-100 h-96">
      <img
        :src="selectedImage"
        :alt="'Product image'"
        class="h-full w-full object-cover object-center"
      />
    </div>

    <div v-if="allImages.length > 1" class="grid grid-cols-5 gap-2">
      <button
        v-for="(image, index) in allImages"
        :key="index"
        @click="selectImage(image)"
        class="aspect-square overflow-hidden rounded-md border"
        :class="selectedImage === image ? 'ring-2 ring-green-500' : 'opacity-70 hover:opacity-100'"
      >
        <img
          :src="image"
          :alt="`Product thumbnail ${index + 1}`"
          class="h-full w-full object-cover object-center"
        />
      </button>
    </div>
  </div>
</template>
