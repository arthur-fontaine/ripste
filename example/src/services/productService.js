// src/services/productService.js
import { supabase } from "@/lib/supabase";

export const ProductService = {
	async getAllProducts() {
		try {
			const { data, error } = await supabase
				.from("products")
				.select(`
          *,
          brands(name),
          categories(name, slug),
          product_images(image_url, alt_text, display_order),
          product_colors(colors(name, hex_code)),
          product_sizes(sizes(value)),
          product_materials(materials(name)),
          product_features(features(name)),
          product_tags(tags(name))
        `)
				.order("created_at", { ascending: false });

			if (error) throw error;

			return data.map((product) => ({
				id: product.id,
				name: product.name,
				description: product.description,
				price: Number.parseFloat(product.price),
				discount: product.discount,
				brand: product.brands?.name || "",
				category: product.categories?.name || "",
				inStock: product.in_stock,
				rating: Number.parseFloat(product.rating),
				reviews: product.reviews_count,
				isNew: product.is_new,
				image: product.main_image_url,
				images:
					product.product_images
						?.sort((a, b) => a.display_order - b.display_order)
						?.map((img) => img.image_url) || [],
				colors: product.product_colors?.map((pc) => pc.colors.name) || [],
				sizes:
					product.product_sizes?.map((ps) => Number.parseInt(ps.sizes.value)) ||
					[],
				materials:
					product.product_materials?.map((pm) => pm.materials.name) || [],
				features: product.product_features?.map((pf) => pf.features.name) || [],
				tags: product.product_tags?.map((pt) => pt.tags.name) || [],
			}));
		} catch (error) {
			console.error("Erreur lors de la récupération des produits:", error);
			throw error;
		}
	},

	async getProductById(id) {
		try {
			const { data, error } = await supabase
				.from("products")
				.select(`
          *,
          brands(name),
          categories(name, slug),
          product_images(image_url, alt_text, display_order),
          product_colors(colors(name, hex_code)),
          product_sizes(sizes(value)),
          product_materials(materials(name)),
          product_features(features(name)),
          product_tags(tags(name))
        `)
				.eq("id", id)
				.single();

			if (error) throw error;

			if (!data) return null;

			return {
				id: data.id,
				name: data.name,
				description: data.description,
				price: Number.parseFloat(data.price),
				discount: data.discount,
				brand: data.brands?.name || "",
				category: data.categories?.name || "",
				inStock: data.in_stock,
				rating: Number.parseFloat(data.rating),
				reviews: data.reviews_count,
				isNew: data.is_new,
				image: data.main_image_url,
				images:
					data.product_images
						?.sort((a, b) => a.display_order - b.display_order)
						?.map((img) => img.image_url) || [],
				colors: data.product_colors?.map((pc) => pc.colors.name) || [],
				sizes:
					data.product_sizes?.map((ps) => Number.parseInt(ps.sizes.value)) ||
					[],
				materials: data.product_materials?.map((pm) => pm.materials.name) || [],
				features: data.product_features?.map((pf) => pf.features.name) || [],
				tags: data.product_tags?.map((pt) => pt.tags.name) || [],
			};
		} catch (error) {
			console.error("Erreur lors de la récupération du produit:", error);
			throw error;
		}
	},

	async getProductsByCategory(categorySlug) {
		try {
			const { data, error } = await supabase
				.from("products")
				.select(`
          *,
          brands(name),
          categories!inner(name, slug)
        `)
				.eq("categories.slug", categorySlug);

			if (error) throw error;

			return data.map((product) => ({
				id: product.id,
				name: product.name,
				description: product.description,
				price: Number.parseFloat(product.price),
				discount: product.discount,
				brand: product.brands?.name || "",
				category: product.categories?.name || "",
				inStock: product.in_stock,
				rating: Number.parseFloat(product.rating),
				reviews: product.reviews_count,
				isNew: product.is_new,
				image: product.main_image_url,
			}));
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des produits par catégorie:",
				error,
			);
			throw error;
		}
	},

	async getCategories() {
		try {
			const { data, error } = await supabase
				.from("categories")
				.select("*")
				.order("name");

			if (error) throw error;

			return data.map((category) => ({
				id: category.id,
				name: category.name,
				slug: category.slug,
				description: category.description,
				image: category.image_url,
			}));
		} catch (error) {
			console.error("Erreur lors de la récupération des catégories:", error);
			throw error;
		}
	},

	async getHeroSlides() {
		try {
			const { data, error } = await supabase
				.from("hero_slides")
				.select("*")
				.eq("is_active", true)
				.order("display_order");

			if (error) throw error;

			return data.map((slide) => ({
				id: slide.id,
				title: slide.title,
				subtitle: slide.subtitle,
				cta: slide.cta_text,
				bgColor: slide.bg_color,
				image: slide.image_url,
			}));
		} catch (error) {
			console.error("Erreur lors de la récupération des slides hero:", error);
			throw error;
		}
	},

	async getFeaturedProducts(type = "featured") {
		try {
			const { data, error } = await supabase
				.from("featured_products")
				.select(`
          products(
            *,
            brands(name),
            categories(name)
          )
        `)
				.eq("type", type)
				.order("display_order");

			if (error) throw error;

			return data.map((item) => ({
				id: item.products.id,
				name: item.products.name,
				description: item.products.description,
				price: Number.parseFloat(item.products.price),
				discount: item.products.discount,
				brand: item.products.brands?.name || "",
				category: item.products.categories?.name || "",
				inStock: item.products.in_stock,
				rating: Number.parseFloat(item.products.rating),
				reviews: item.products.reviews_count,
				isNew: item.products.is_new,
				image: item.products.main_image_url,
			}));
		} catch (error) {
			console.error(
				"Erreur lors de la récupération des produits en vedette:",
				error,
			);
			throw error;
		}
	},

	async searchProducts(query, filters = {}) {
		try {
			let queryBuilder = supabase.from("products").select(`
          *,
          brands(name),
          categories(name, slug)
        `);

			if (query) {
				queryBuilder = queryBuilder.or(
					`name.ilike.%${query}%,description.ilike.%${query}%`,
				);
			}

			if (filters.categoryId) {
				queryBuilder = queryBuilder.eq("category_id", filters.categoryId);
			}

			if (filters.brandId) {
				queryBuilder = queryBuilder.eq("brand_id", filters.brandId);
			}

			if (filters.minPrice !== undefined) {
				queryBuilder = queryBuilder.gte("price", filters.minPrice);
			}

			if (filters.maxPrice !== undefined) {
				queryBuilder = queryBuilder.lte("price", filters.maxPrice);
			}

			if (filters.inStock !== undefined) {
				queryBuilder = queryBuilder.eq("in_stock", filters.inStock);
			}

			if (filters.isNew !== undefined) {
				queryBuilder = queryBuilder.eq("is_new", filters.isNew);
			}

			switch (filters.sortBy) {
				case "price-asc":
					queryBuilder = queryBuilder.order("price", { ascending: true });
					break;
				case "price-desc":
					queryBuilder = queryBuilder.order("price", { ascending: false });
					break;
				case "rating":
					queryBuilder = queryBuilder.order("rating", { ascending: false });
					break;
				case "newest":
					queryBuilder = queryBuilder.order("created_at", { ascending: false });
					break;
				default:
					queryBuilder = queryBuilder.order("created_at", { ascending: false });
			}

			const { data, error } = await queryBuilder;

			if (error) throw error;

			return data.map((product) => ({
				id: product.id,
				name: product.name,
				description: product.description,
				price: Number.parseFloat(product.price),
				discount: product.discount,
				brand: product.brands?.name || "",
				category: product.categories?.name || "",
				inStock: product.in_stock,
				rating: Number.parseFloat(product.rating),
				reviews: product.reviews_count,
				isNew: product.is_new,
				image: product.main_image_url,
			}));
		} catch (error) {
			console.error("Erreur lors de la recherche de produits:", error);
			throw error;
		}
	},

	async getBrands() {
		try {
			const { data, error } = await supabase
				.from("brands")
				.select("*")
				.order("name");

			if (error) throw error;
			return data;
		} catch (error) {
			console.error("Erreur lors de la récupération des marques:", error);
			throw error;
		}
	},
};
