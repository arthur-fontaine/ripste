<script setup>
import { ref, watch } from "vue";

const props = defineProps({
	selected: {
		type: String,
		default: "default",
	},
});

const emit = defineEmits(["update-sorting"]);

const sortingOptions = [
	{ value: "default", label: "Recommandés" },
	{ value: "price-asc", label: "Prix croissant" },
	{ value: "price-desc", label: "Prix décroissant" },
	{ value: "rating", label: "Meilleures notes" },
	{ value: "newest", label: "Nouveautés" },
];

const selectedOption = ref(props.selected);
const isOpen = ref(false);

watch(selectedOption, (newOption) => {
	emit("update-sorting", newOption);
});

function toggleDropdown() {
	isOpen.value = !isOpen.value;
}

function selectOption(option) {
	selectedOption.value = option;
	isOpen.value = false;
}

function handleClickOutside(event) {
	if (isOpen.value && !event.target.closest(".sorting-dropdown")) {
		isOpen.value = false;
	}
}

if (typeof window !== "undefined") {
	window.addEventListener("click", handleClickOutside);
}
</script>

<template>
  <div class="relative inline-block text-left sorting-dropdown">
    <div>
      <button 
        @click="toggleDropdown" 
        type="button" 
        class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <span class="hidden sm:inline-block">Trier par:</span>
        <span class="ml-1">{{ sortingOptions.find(option => option.value === selectedOption)?.label }}</span>
        <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <div 
      v-if="isOpen" 
      class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
    >
      <div class="py-1" role="menu" aria-orientation="vertical">
        <button
          v-for="option in sortingOptions"
          :key="option.value"
          @click="selectOption(option.value)"
          class="w-full text-left block px-4 py-2 text-sm"
          :class="selectedOption === option.value ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'"
          role="menuitem"
        >
          {{ option.label }}
        </button>
      </div>
    </div>
  </div>
</template>