<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1>salut admin metrics
        </h1>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { apiClient } from "../lib/api";

onMounted(async () => {
	try {
		const response = await apiClient.admin.metrics.transactions.$get();
		console.log("Metrics data:", await response.json());
	} catch (error) {
		console.error("Error fetching metrics:", error);
	}
	console.log("Admin Metrics page mounted");
});
</script>