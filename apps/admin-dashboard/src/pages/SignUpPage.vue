<template>
  <div class="flex justify-center items-center min-h-[50vh] p-8">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-center mb-8 text-2xl font-bold text-gray-900">Sign Up</h1>
      
      <div v-if="session.data" class="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
        <p class="text-green-700 mb-4">You are already signed in as: {{ session.data.user.email }}</p>
        <button @click="signOut" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">Sign Out</button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg">
          {{ success }}
        </div>

        <div class="flex flex-col gap-2">
          <label for="name" class="font-medium text-gray-700">Name:</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            required 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="email" class="font-medium text-gray-700">Email:</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label for="password" class="font-medium text-gray-700">Password:</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        </div>

        <button type="submit" :disabled="loading" class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed">
          {{ loading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>

      <p class="text-center mt-4 text-gray-600">
        Already have an account? 
        <router-link to="/login" class="text-blue-600 hover:underline">Sign in here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authClient } from "../lib/auth";

const session = authClient.useSession();

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

const handleSubmit = async () => {
	loading.value = true;
	error.value = "";
	success.value = "";

	try {
		const result = await authClient.signUp.email({
			email: email.value,
			password: password.value,
			name: name.value,
		});

		if (result.data) {
			success.value =
				"Account created successfully! Please check your email to verify your account.";

			name.value = "";
			email.value = "";
			password.value = "";
		} else if (result.error) {
			error.value = result.error.message || "Sign up failed";
		}
	} catch (err: unknown) {
		console.error("Sign up failed:", err);
		error.value =
			err instanceof Error ? err.message : "An error occurred during sign up";
	} finally {
		loading.value = false;
	}
};

const signOut = async () => {
	await authClient.signOut();
};
</script>
