<template>
  <div class="flex justify-center items-center min-h-[50vh] p-8">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-center mb-8 text-2xl font-bold text-gray-900">Sign In</h1>
      
      <div v-if="session.data" class="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
        <p class="text-green-700 mb-4">You are already signed in as: {{ session.data.user.email }}</p>
        <button @click="signOut" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">Sign Out</button>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg">
          {{ error }}
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
          />
        </div>

        <button type="submit" :disabled="loading" class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="text-center mt-4 text-gray-600">
        Don't have an account? 
        <router-link to="/signup" class="text-blue-600 hover:underline">Sign up here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authClient } from "../lib/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const session = authClient.useSession();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleSubmit = async () => {
	loading.value = true;
	error.value = "";

	try {
		const result = await authClient.signIn.email({
			email: email.value,
			password: password.value,
		});

		if (result.data) {
			console.log("Login successful:", result);
			router.push("/");
		} else if (result.error) {
			error.value = result.error.message || "Login failed";
		}
	} catch (err: any) {
		console.error("Login failed:", err);
		error.value = err.message || "An error occurred during login";
	} finally {
		loading.value = false;
	}
};

const signOut = async () => {
	await authClient.signOut();
};
</script>
