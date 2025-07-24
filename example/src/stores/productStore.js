import { defineStore } from "pinia";
import { ProductService } from "@/services/productService";

export const useProductStore = defineStore("products", {
	state: () => ({
		products: [],
		featuredProducts: [],
		bestSellers: [],
		categories: [],
		homeCategories: [],
		heroSlides: [],
		brands: [],

		isLoading: false,
		isLoadingCategories: false,
		isLoadingHero: false,
		error: null,
		categoryError: null,
		heroError: null,
	}),

	getters: {
		getProductById: (state) => (id) => {
			return state.products.find((product) => product.id === id);
		},
		getProductsByCategory: (state) => (category) => {
			return state.products.filter((product) => product.category === category);
		},
		getProductsByBrand: (state) => (brand) => {
			return state.products.filter((product) => product.brand === brand);
		},
		getNewProducts: (state) => {
			return state.products.filter((product) => product.isNew);
		},
		getDiscountedProducts: (state) => {
			return state.products.filter(
				(product) => product.discount && product.discount > 0,
			);
		},
	},

	actions: {
		async fetchProducts() {
			this.isLoading = true;
			this.error = null;

			try {
				this.products = await ProductService.getAllProducts();
			} catch (error) {
				console.error("Error fetching products:", error);
				this.error =
					"Impossible de charger les produits. Veuillez réessayer plus tard.";
			} finally {
				this.isLoading = false;
			}
		},

		async fetchProductById(id) {
			try {
				const product = await ProductService.getProductById(id);

				if (product && !this.products.find((p) => p.id === id)) {
					this.products.push(product);
				}

				return product;
			} catch (error) {
				console.error("Error fetching product:", error);
				throw error;
			}
		},

		async fetchFeaturedProducts() {
			try {
				this.featuredProducts =
					await ProductService.getFeaturedProducts("featured");
			} catch (error) {
				console.error("Error fetching featured products:", error);
				this.error = "Impossible de charger les produits en vedette.";
			}
		},

		async fetchBestSellers() {
			try {
				this.bestSellers =
					await ProductService.getFeaturedProducts("bestseller");
			} catch (error) {
				console.error("Error fetching best sellers:", error);
				this.error = "Impossible de charger les meilleures ventes.";
			}
		},

		async fetchHomeCategories() {
			this.isLoadingCategories = true;
			this.categoryError = null;

			try {
				const allCategories = await ProductService.getCategories();

				this.homeCategories = allCategories.slice(0, 4);
				this.categories = allCategories.map((cat) => cat.name);
			} catch (error) {
				console.error("Error fetching home categories:", error);
				this.categoryError =
					"Impossible de charger les catégories. Veuillez réessayer plus tard.";
			} finally {
				this.isLoadingCategories = false;
			}
		},

		async fetchHeroSlides() {
			this.isLoadingHero = true;
			this.heroError = null;

			try {
				this.heroSlides = await ProductService.getHeroSlides();
			} catch (error) {
				console.error("Error fetching hero slides:", error);
				this.heroError =
					"Impossible de charger les slides. Veuillez réessayer plus tard.";
			} finally {
				this.isLoadingHero = false;
			}
		},

		async fetchBrands() {
			try {
				this.brands = await ProductService.getBrands();
			} catch (error) {
				console.error("Error fetching brands:", error);
			}
		},

		async searchProducts(query, filters = {}) {
			try {
				return await ProductService.searchProducts(query, filters);
			} catch (error) {
				console.error("Error searching products:", error);
				throw error;
			}
		},

		async fetchProductsByCategory(categorySlug) {
			try {
				return await ProductService.getProductsByCategory(categorySlug);
			} catch (error) {
				console.error("Error fetching products by category:", error);
				throw error;
			}
		},

		filterProducts(filters) {
			let filteredProducts = [...this.products];

			if (filters.category !== null) {
				filteredProducts = filteredProducts.filter(
					(product) => product.category === filters.category,
				);
			}

			if (filters.brand !== null) {
				filteredProducts = filteredProducts.filter(
					(product) => product.brand === filters.brand,
				);
			}

			if (filters.minPrice !== null) {
				filteredProducts = filteredProducts.filter(
					(product) => product.price >= filters.minPrice,
				);
			}

			if (filters.maxPrice !== null) {
				filteredProducts = filteredProducts.filter(
					(product) => product.price <= filters.maxPrice,
				);
			}

			if (filters.inStock !== null) {
				filteredProducts = filteredProducts.filter(
					(product) => product.inStock === filters.inStock,
				);
			}

			if (filters.isNew !== null) {
				filteredProducts = filteredProducts.filter(
					(product) => product.isNew === filters.isNew,
				);
			}

			return filteredProducts;
		},
	},
});
