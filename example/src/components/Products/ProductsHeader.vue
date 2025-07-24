<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: null
  }
})

const backgroundImage = computed(() => {
  if (props.category) {
    const categoryId = props.category.charCodeAt(0) % 1000
    return `https://picsum.photos/seed/${1000 + categoryId}/1600/400`
  }
  return 'https://picsum.photos/seed/1059/1600/400'
})

const description = computed(() => {
  if (!props.category) {
    return 'Découvrez notre sélection de produits authentiques et garantis. Achetez et vendez en toute confiance sur notre plateforme.'
  }
  
  const descriptions = {
    'Sport': 'Découvrez notre collection de chaussures de sport pour améliorer vos performances.',
    'Ville': 'Nos chaussures de ville allient élégance et confort pour votre quotidien urbain.',
    'Outdoor': 'Explorez la nature avec nos chaussures conçues pour les aventures en plein air.',
    'Professionnel': 'Sécurité et confort pour vos journées de travail avec notre gamme professionnelle.',
    'Cérémonie': 'Élégance et raffinement pour vos événements spéciaux.',
    'Casual': 'Style décontracté et confort pour tous les jours.',
    'Enfant': 'Des chaussures robustes et colorées pour les plus jeunes.',
    'Été': 'Restez au frais avec notre collection de chaussures légères et aérées.',
    'Saison': 'Des modèles adaptés à chaque saison pour vous accompagner toute l\'année.',
    'Maison': 'Confort ultime pour vos moments de détente à la maison.',
    'Danse': 'Performance et élégance pour tous les styles de danse.'
  }
  
  return descriptions[props.category] || `Découvrez notre sélection de produits ${props.category.toLowerCase()}.`
})
</script>

<template>
  <div class="relative mb-8">
    <div class="h-48 md:h-64 w-full overflow-hidden relative">
      <img 
        :src="backgroundImage" 
        :alt="title" 
        class="w-full h-full object-cover"
      >
      <div class="absolute inset-0 bg-black opacity-40"></div>
    </div>
    
    <div class="absolute inset-0 flex flex-col justify-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4">{{ title }}</h1>
        <p class="text-base md:text-lg lg:text-xl max-w-3xl line-clamp-3 md:line-clamp-none">{{ description }}</p>
      </div>
    </div>
  </div>
</template>