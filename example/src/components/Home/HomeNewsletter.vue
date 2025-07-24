<script setup>
import { ref } from 'vue'

const email = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')

function subscribe() {
  isSubmitting.value = true
  isSuccess.value = false
  errorMessage.value = ''

  if (!email.value) {
    errorMessage.value = 'Veuillez entrer votre adresse email.'
    isSubmitting.value = false
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    errorMessage.value = 'Veuillez entrer une adresse email valide.'
    isSubmitting.value = false
    return
  }

  setTimeout(() => {
    isSubmitting.value = false
    isSuccess.value = true
    email.value = ''

    setTimeout(() => {
      isSuccess.value = false
    }, 5000)
  }, 1500)
}
</script>

<template>
  <section class="py-16 bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto text-center">
        <h2 class="text-3xl md:text-4xl font-bold">Restez à jour avec les dernières tendances</h2>
        <p class="mt-4 text-lg text-gray-300">
          Inscrivez-vous à notre newsletter pour recevoir des informations exclusives sur les
          nouveaux produits, les promotions et plus encore.
        </p>

        <div class="mt-8">
          <form @submit.prevent="subscribe" class="sm:flex justify-center">
            <div class="min-w-0 flex-1">
              <label for="email" class="sr-only">Adresse email</label>
              <input
                v-model="email"
                id="email"
                type="email"
                class="block w-full px-4 py-3 text-base text-white placeholder-gray-500 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Entrez votre adresse email"
              />
            </div>
            <div class="mt-3 sm:mt-0 sm:ml-3">
              <button
                type="submit"
                class="block w-full px-4 py-3 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition"
                :disabled="isSubmitting"
              >
                <span v-if="!isSubmitting">S'inscrire</span>
                <span v-else class="flex items-center justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Traitement...
                </span>
              </button>
            </div>
          </form>

          <div v-if="errorMessage" class="mt-3 text-red-400 text-sm">
            {{ errorMessage }}
          </div>

          <div v-if="isSuccess" class="mt-3 text-green-400 text-sm">
            Merci pour votre inscription ! Vous recevrez bientôt nos actualités.
          </div>

          <p class="mt-4 text-xs text-gray-400">
            En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de
            confidentialité. Nous ne spammons jamais et vous pouvez vous désinscrire à tout moment.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>