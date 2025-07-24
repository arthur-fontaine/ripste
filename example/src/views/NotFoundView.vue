<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
    <div class="text-center">
      <div class="mb-6">
        <h1 class="text-9xl font-bold text-gray-900">404</h1>
        <p class="text-2xl font-medium text-gray-700 mt-3">Page introuvable</p>
      </div>
      
      <p class="text-gray-600 max-w-md mx-auto mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
        Vérifiez l'URL ou retournez à la page d'accueil.
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          @click="goBack" 
          class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md shadow-sm hover:bg-gray-200 transition"
        >
          Retour
        </button>
        <button 
          @click="goHome" 
          class="px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 transition"
        >
          Page d'accueil
        </button>
      </div>
      
      <div class="mt-12 relative">
        <div class="h-1 w-16 bg-green-600 mx-auto"></div>
        <div class="mt-8 text-gray-800">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
  </main>
</template>