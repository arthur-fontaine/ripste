import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
	state: () => ({
		items: [],
		isOpen: false,
	}),

	getters: {
		count: (state) => {
			return state.items.length;
		},

		total: (state) => {
			return state.items.reduce((total, item) => {
				const price = item.product.discount
					? item.product.price * (1 - item.product.discount / 100)
					: item.product.price;
				return total + price * item.quantity;
			}, 0);
		},

		formattedTotal: (state) => {
			return new Intl.NumberFormat("fr-FR", {
				style: "currency",
				currency: "EUR",
			}).format(state.total);
		},

		hasItems: (state) => {
			return state.items.length > 0;
		},
	},

	actions: {
		addItem(product, size = null, color = null, quantity = 1) {
			const existingItemIndex = this.items.findIndex(
				(item) =>
					item.product.id === product.id &&
					item.size === size &&
					item.color === color,
			);

			if (existingItemIndex !== -1) {
				this.items[existingItemIndex].quantity += quantity;
			} else {
				this.items.push({
					id: Date.now(),
					product,
					size,
					color,
					quantity,
				});
			}

			this.isOpen = true;
		},

		removeItem(itemId) {
			const index = this.items.findIndex((item) => item.id === itemId);
			if (index !== -1) {
				this.items.splice(index, 1);
			}
		},

		updateQuantity(itemId, quantity) {
			const item = this.items.find((item) => item.id === itemId);
			if (item) {
				item.quantity = Math.max(1, quantity);
			}
		},

		clearCart() {
			this.items = [];
			this.isOpen = false;
		},

		toggleCart() {
			this.isOpen = !this.isOpen;
		},

		closeCart() {
			this.isOpen = false;
		},
	},
});
