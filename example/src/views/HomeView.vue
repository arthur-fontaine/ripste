<script setup>
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/productStore'
import HomeHeroSection from '@/components/Home/HomeHeroSection.vue'
import HomeFeaturedProducts from '@/components/Home/HomeFeaturedProducts.vue'
import HomeCategories from '@/components/Home/HomeCategories.vue'
import HomeTrending from '@/components/Home/HomeTrending.vue'
import HomeNewsletter from '@/components/Home/HomeNewsletter.vue'

const productStore = useProductStore()

onMounted(async () => {
  try {
    await Promise.all([
      productStore.fetchHeroSlides(),
      productStore.fetchFeaturedProducts(),
      productStore.fetchBestSellers(),
      productStore.fetchHomeCategories(),
      productStore.fetchBrands()
    ])
  } catch (error) {
    console.error('Erreur lors du chargement des données de la page d\'accueil:', error)
  }
})
</script>

<template>
  <main>
    <HomeHeroSection />
    <HomeFeaturedProducts />
    <HomeCategories />
    <HomeTrending />
    <HomeNewsletter />
  </main>
</template>
