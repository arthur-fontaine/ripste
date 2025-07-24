<template>
  <div class="max-w-6xl mx-auto p-8">
    <div class="text-center mb-12 p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
      <h1 class="text-4xl font-bold mb-4">Please create a company before use Ripste</h1>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-md border">
      <h2 class="text-2xl text-gray-900 mb-4">Create a company</h2>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-gray-700 font-semibold mb-2">
            Legal name <span class="text-red-500">*</span>
          </label>
          <input v-model="legalName" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">
            Trade name
          </label>
          <input v-model="tradeName" type="text" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">
            Kbis <span class="text-red-500">*</span>
          </label>
          <input v-model="kbis" type="text" class="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">
            VAT number
          </label>
          <input v-model="vatNumber" type="text" class="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label class="block text-gray-700 font-semibold mb-2">
            Address
          </label>
          <input v-model="address" type="text" class="w-full border rounded px-3 py-2" />
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
import { apiClient } from "../lib/api";

const legalName = ref("");
const tradeName = ref("");
const kbis = ref("");
const vatNumber = ref("");
const address = ref("");
const error = ref("");

const router = useRouter();

function handleSubmit() {
	error.value = "";
	if (!legalName.value || !kbis.value) {
		error.value = "Legal name and Kbis are required.";
		return;
	}

	try {
		apiClient.companies.$post({
			json: {
				legalName: legalName.value,
				tradeName: tradeName.value,
				kbis: kbis.value,
				vatNumber: vatNumber.value,
				address: address.value,
			},
		});
	} catch (err) {
		error.value = "Failed to create company. Please try again.";
		console.error(err);
    router.push("/company/create");
	}
	router.push("/store/create");
}
</script>

