<template>
  <div class="max-w-6xl mx-auto p-8">
    <div class="bg-white p-8 rounded-lg shadow-md border">
      <h2 class="text-2xl text-gray-900 mb-4">Create a company</h2>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-semibold mb-2">
            Name <span class="text-red-500">*</span>
          </label>
          <input v-model="name" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">
            Trade name
          </label>
          <input v-model="slug" type="text" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">
            Contact email <span class="text-red-500">*</span>
          </label>
          <input v-model="contactEmail" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">
            Contact phone
          </label>
          <input v-model="contactPhone" type="text" class="w-full border rounded px-3 py-2" />
        </div>
        <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold">
          Create
        </button>
      </form>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {apiClient} from "../lib/api.js";

const name = ref("");
const slug = ref("");
const contactEmail = ref("");
const contactPhone = ref("");
const error = ref("");

const router = useRouter();

function handleSubmit() {
	error.value = "";
	if (
		!name.value ||
		!slug.value ||
		!contactEmail.value ||
		!contactPhone.value
	) {
		error.value = "All fields are required.";
		return;
	}
  try {
    apiClient.stores.$post({
      json: {
        name: name.value,
        slug: slug.value,
        contactEmail: contactEmail.value,
        contactPhone: contactPhone.value
      }
    });
  } catch (err) {
    error.value = "Failed to create store. Please try again.";
    console.log(err);
  }
	router.push("/");
}
</script>