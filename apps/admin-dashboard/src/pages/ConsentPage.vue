<template>
  <div class="flex justify-center items-center min-h-[60vh] p-8">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-900">OAuth Consent</h1>
      
      <div v-if="!session.data" class="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
        <p class="text-red-700 mb-4">You must be logged in to view this page.</p>
        <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">Sign In</router-link>
      </div>

      <div v-else-if="loading" class="text-center text-gray-600 p-8">
        <p>Processing consent...</p>
      </div>

      <div v-else class="flex flex-col gap-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Authorization Request</h2>
          <p class="text-gray-600 mb-4">An application wants to access your account with the following permissions:</p>
          
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 class="text-gray-700 font-medium mb-2">Requested Permissions:</h3>
            <ul class="list-disc list-inside text-gray-600 space-y-1">
              <li>Access your basic profile information</li>
              <li>Read your email address</li>
              <li>View your account details</li>
            </ul>
          </div>
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {{ error }}
        </div>

        <div class="flex gap-4 justify-center">
          <button 
            @click="handleConsent(true)" 
            :disabled="processing"
            class="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed min-w-[100px]"
          >
            {{ processing ? 'Processing...' : 'Accept' }}
          </button>

          <button 
            @click="handleConsent(false)" 
            :disabled="processing"
            class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed min-w-[100px]"
          >
            {{ processing ? 'Processing...' : 'Reject' }}
          </button>
        </div>

        <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p class="text-yellow-800 text-center text-sm">By clicking "Accept", you allow this application to access your account information according to the permissions listed above.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { authClient } from "../lib/auth";

const session = authClient.useSession();

const loading = ref(true);
const processing = ref(false);
const error = ref("");

onMounted(() => {
	if (session.value.data) {
		loading.value = false;
	} else {
		setTimeout(() => {
			loading.value = false;
		}, 1000);
	}
});

const handleConsent = async (accept: boolean) => {
	processing.value = true;
	error.value = "";

	try {
		const response = await authClient.oauth2.consent({ accept });
		console.log("Consent response:", response);

		if (response.data?.redirectURI) {
			(globalThis as unknown as { location: { href: string } }).location.href =
				response.data.redirectURI;
		} else if (response.error) {
			error.value = response.error.message || "Failed to process consent";
		} else {
			(globalThis as unknown as { location: { href: string } }).location.href =
				"/";
		}
	} catch (err: unknown) {
		console.error("Consent failed:", err);
		error.value =
			err instanceof Error
				? err.message
				: "An error occurred while processing consent";
	} finally {
		processing.value = false;
	}
};
</script>
