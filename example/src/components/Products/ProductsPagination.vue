<script setup>
import { computed } from "vue";

const props = defineProps({
	currentPage: {
		type: Number,
		required: true,
	},
	totalItems: {
		type: Number,
		required: true,
	},
	itemsPerPage: {
		type: Number,
		default: 12,
	},
});

const emit = defineEmits(["page-changed"]);

const totalPages = computed(() => {
	return Math.ceil(props.totalItems / props.itemsPerPage);
});

const pageNumbers = computed(() => {
	const isMobile = window.innerWidth < 640;
	const maxVisiblePages = isMobile ? 3 : 7;

	if (totalPages.value <= maxVisiblePages) {
		return Array.from({ length: totalPages.value }, (_, i) => i + 1);
	}

	const result = [];

	result.push(1);

	if (props.currentPage <= (isMobile ? 2 : 4)) {
		for (
			let i = 2;
			i <= Math.min(isMobile ? 3 : 5, totalPages.value - 1);
			i++
		) {
			result.push(i);
		}
		if (totalPages.value > (isMobile ? 3 : 5)) {
			result.push("...");
		}
	} else if (props.currentPage >= totalPages.value - (isMobile ? 1 : 3)) {
		result.push("...");
		const start = Math.max(2, totalPages.value - (isMobile ? 2 : 4));
		for (let i = start; i < totalPages.value; i++) {
			result.push(i);
		}
	} else {
		result.push("...");
		const start = Math.max(2, props.currentPage - (isMobile ? 0 : 1));
		const end = Math.min(
			totalPages.value - 1,
			props.currentPage + (isMobile ? 0 : 1),
		);
		for (let i = start; i <= end; i++) {
			result.push(i);
		}
		result.push("...");
	}

	if (totalPages.value > 1) {
		result.push(totalPages.value);
	}

	return result;
});

function goToPage(page) {
	if (page === "..." || page === props.currentPage) {
		return;
	}

	emit("page-changed", page);
}

function goToPreviousPage() {
	if (props.currentPage > 1) {
		emit("page-changed", props.currentPage - 1);
	}
}

function goToNextPage() {
	if (props.currentPage < totalPages.value) {
		emit("page-changed", props.currentPage + 1);
	}
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex justify-center mt-8">
    <nav class="inline-flex flex-wrap justify-center shadow-sm -space-x-px" aria-label="Pagination">
      <button
        @click="goToPreviousPage"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium"
        :class="currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'"
      >
        <span class="sr-only">Précédent</span>
        <svg
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>

      <button
        v-for="(page, index) in pageNumbers"
        :key="index"
        @click="goToPage(page)"
        class="relative inline-flex items-center px-3 sm:px-4 py-2 border text-sm font-medium"
        :class="
          page === currentPage
            ? 'bg-green-50 border-green-500 text-green-600 z-10'
            : page === '...'
            ? 'bg-white border-gray-300 text-gray-500 cursor-default'
            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
        "
      >
        {{ page }}
      </button>

      <button
        @click="goToNextPage"
        :disabled="currentPage === totalPages"
        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium"
        :class="currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'"
      >
        <span class="sr-only">Suivant</span>
        <svg
          class="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </nav>
  </div>
</template>