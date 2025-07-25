<script setup>
import { ref, computed } from "vue";
import { useCartStore } from "@/stores/cartStore";
import { useRouter } from "vue-router";

const cartStore = useCartStore();
const router = useRouter();

const shippingMethods = [
	{
		id: "standard",
		name: "Livraison standard",
		price: 5.99,
		deliveryTime: "3-5 jours ouvrés",
	},
	{
		id: "express",
		name: "Livraison express",
		price: 12.99,
		deliveryTime: "1-2 jours ouvrés",
	},
];

const selectedShipping = ref(shippingMethods[0].id);

const shipping = computed(() => {
	return shippingMethods.find((method) => method.id === selectedShipping.value);
});

const isFreeShipping = computed(() => {
	return cartStore.total >= 80;
});

const finalTotal = computed(() => {
	return isFreeShipping.value
		? cartStore.total
		: cartStore.total + shipping.value.price;
});

const formattedFinalTotal = computed(() => {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency: "EUR",
	}).format(finalTotal.value);
});

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

function continueToCheckout() {
	fetch("http://localhost:4000/checkout-panier", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			items: cartStore.items.map((item) => ({
				name: item.product.name,
				productId: item.product.id,
				quantity: item.quantity,
				size: item.size,
				color: item.color,
				price: displayPrice(item.product),
			})),
			total: cartStore.total,
		}),
	})
		.then((response) => response.json())
    .then((data) => {
      if (data.checkoutPageUrl) {
        window.location.href = data.checkoutPageUrl;
      }
    })
		.catch((error) => {
			console.error("Erreur:", error);
			alert("Erreur lors de la création du paiement");
		});
}

function continueShopping() {
	router.push("/products");
}
</script>

<template>
  <main class="bg-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Votre panier</h1>

      <div v-if="!cartStore.hasItems" class="flex flex-col items-center justify-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-24 w-24 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        <h2 class="mt-6 text-2xl font-semibold text-gray-900">Votre panier est vide</h2>
        <p class="mt-2 text-gray-600">
          Vous n'avez aucun article dans votre panier actuellement.
        </p>
        <button
          @click="continueShopping"
          class="mt-8 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Commencer vos achats
        </button>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg border">
            <ul class="divide-y divide-gray-200">
              <li v-for="item in cartStore.items" :key="item.id" class="p-6 flex">
                <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                  <img
                    :src="item.product.image"
                    :alt="item.product.name"
                    class="h-full w-full object-cover object-center"
                  />
                </div>

                <div class="ml-6 flex-1 flex flex-col">
                  <div class="flex justify-between">
                    <div>
                      <h3 class="text-base font-medium text-gray-900">
                        {{ item.product.name }}
                      </h3>
                      <p class="mt-1 text-sm text-gray-500">{{ item.product.brand }}</p>
                      <div class="flex text-sm mt-1">
                        <p v-if="item.size" class="text-gray-500">Taille: {{ item.size }}</p>
                        <p v-if="item.color" class="ml-4 text-gray-500">
                          Couleur: {{ item.color }}
                        </p>
                      </div>
                    </div>
                    <p class="text-base font-medium text-gray-900">
                      {{ formatPrice(displayPrice(item.product)) }}
                    </p>
                  </div>

                  <div class="flex items-center justify-between mt-4">
                    <div class="flex items-center border rounded">
                      <button
                        @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                        class="px-3 py-1 text-gray-600 hover:text-gray-900"
                        :disabled="item.quantity <= 1"
                      >
                        -
                      </button>
                      <span class="px-3 py-1 text-gray-900">{{ item.quantity }}</span>
                      <button
                        @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                        class="px-3 py-1 text-gray-600 hover:text-gray-900"
                      >
                        +
                      </button>
                    </div>

                    <button
                      @click="cartStore.removeItem(item.id)"
                      type="button"
                      class="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div class="mt-6 flex justify-between">
            <button
              @click="continueShopping"
              class="flex items-center text-green-600 hover:text-green-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Continuer mes achats
            </button>

            <button
              @click="cartStore.clearCart"
              class="text-gray-600 hover:text-gray-800"
            >
              Vider le panier
            </button>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-6 border">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Récapitulatif de la commande</h2>

            <div class="space-y-4">
              <div class="flex justify-between">
                <p class="text-sm text-gray-600">Sous-total</p>
                <p class="text-sm font-medium text-gray-900">{{ cartStore.formattedTotal }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-600 mb-2">Livraison</p>
                <div class="space-y-2">
                  <div
                    v-for="method in shippingMethods"
                    :key="method.id"
                    class="flex items-center"
                  >
                    <input
                      :id="`shipping-${method.id}`"
                      name="shipping"
                      type="radio"
                      :value="method.id"
                      v-model="selectedShipping"
                      class="h-4 w-4 text-green-600 focus:ring-green-500"
                    />
                    <label :for="`shipping-${method.id}`" class="ml-3 flex justify-between flex-1">
                      <div>
                        <span class="text-sm text-gray-900">{{ method.name }}</span>
                        <span class="block text-xs text-gray-500">{{ method.deliveryTime }}</span>
                      </div>
                      <span class="text-sm font-medium text-gray-900">
                        {{ isFreeShipping ? 'Offert' : formatPrice(method.price) }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div v-if="isFreeShipping" class="flex justify-between py-2 bg-green-50 px-4 rounded">
                <p class="text-sm text-green-800">Livraison offerte</p>
                <p class="text-sm font-medium text-green-800">-{{ formatPrice(shipping.price) }}</p>
              </div>

              <div class="border-t border-gray-200 pt-4">
                <div class="flex justify-between">
                  <p class="text-base font-medium text-gray-900">Total</p>
                  <p class="text-base font-medium text-gray-900">{{ formattedFinalTotal }}</p>
                </div>
              </div>
            </div>

            <button
              @click="continueToCheckout"
              class="w-full mt-6 bg-green-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Finaliser la commande
            </button>

            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500">
                En passant votre commande, vous acceptez nos
                <a href="#" class="text-green-600 hover:text-green-800">conditions générales</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
