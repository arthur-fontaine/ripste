<script setup>
import { onMounted, onUnmounted } from "vue";
import { useCartStore } from "@/stores/cartStore";

const cartStore = useCartStore();

function formatPrice(price) {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(price);
}

function displayPrice(product) {
	if (product.discount && product.discount > 0) {
		return product.price * (1 - product.discount / 100);
	}
	return product.price;
}

function handleClickOutside(event) {
	const drawer = document.querySelector(".cart-drawer");
	if (
		drawer &&
		!drawer.contains(event.target) &&
		!event.target.closest(".cart-button")
	) {
		cartStore.closeCart();
	}
}

function handleEscape(event) {
	if (event.key === "Escape" && cartStore.isOpen) {
		cartStore.closeCart();
	}
}

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
	document.addEventListener("keydown", handleEscape);
});

onUnmounted(() => {
	document.removeEventListener("click", handleClickOutside);
	document.removeEventListener("keydown", handleEscape);
});
</script>

<template>
  <div
    class="cart-drawer border border-l-black fixed right-0 top-0 h-full w-full max-w-md z-50 bg-white shadow-xl transform transition-transform duration-300"
    :class="cartStore.isOpen ? 'translate-x-0' : 'translate-x-full'">
    <div class="flex flex-col h-full">
      <div class="p-4 border-b flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900">Votre panier ({{ cartStore.count }})</h2>
        <button @click="cartStore.closeCart" class="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="!cartStore.hasItems" class="flex-1 flex flex-col items-center justify-center p-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p class="mt-4 text-gray-600 text-center">Votre panier est vide</p>
        <button @click="cartStore.closeCart" class="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Continuer vos achats
        </button>
      </div>

      <div v-else class="flex-1 overflow-y-auto p-4">
        <ul class="space-y-4">
          <li v-for="item in cartStore.items" :key="item.id" class="flex border-b pb-4">
            <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
              <img :src="item.product.image" :alt="item.product.name"
                class="h-full w-full object-cover object-center" />
            </div>

            <div class="ml-4 flex flex-1 flex-col">
              <div class="flex justify-between text-base font-medium text-gray-900">
                <h3>
                  {{ item.product.name }}
                </h3>
                <p class="ml-4">{{ formatPrice(displayPrice(item.product) * item.quantity) }}</p>
              </div>
              <p class="mt-1 text-sm text-gray-500">{{ item.product.brand }}</p>

              <div class="flex text-sm">
                <p v-if="item.size" class="text-gray-500">Taille: {{ item.size }}</p>
                <p v-if="item.color" class="ml-2 pl-2 border-l border-gray-200 text-gray-500">
                  Couleur: {{ item.color }}
                </p>
              </div>

              <div class="flex items-center justify-between text-sm mt-2">
                <div class="flex items-center border rounded">
                  <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    class="px-2 py-1 text-gray-600 hover:text-gray-900" :disabled="item.quantity <= 1">
                    -
                  </button>
                  <span class="px-2 py-1 text-gray-900">{{ item.quantity }}</span>
                  <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    class="px-2 py-1 text-gray-600 hover:text-gray-900">
                    +
                  </button>
                </div>

                <button @click="cartStore.removeItem(item.id)" type="button" class="text-red-600 hover:text-red-800">
                  Supprimer
                </button>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="cartStore.hasItems" class="border-t border-gray-200 p-4">
        <div class="flex justify-between text-base font-medium text-gray-900 mb-4">
          <p>Sous-total</p>
          <p>{{ cartStore.formattedTotal }}</p>
        </div>
        <div class="flex flex-col space-y-2">
          <router-link to="/checkout"
            class="block w-full py-3 px-4 rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 text-center"
            @click="cartStore.closeCart">
            Passer à la caisse
          </router-link>
          <button @click="cartStore.closeCart"
            class="w-full py-3 px-4 rounded-md border border-gray-300 shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50">
            Continuer vos achats
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="cartStore.isOpen" class="fixed inset-0 bg-black/50 z-40 transition-opacity" @click="cartStore.closeCart">
  </div>
</template>
