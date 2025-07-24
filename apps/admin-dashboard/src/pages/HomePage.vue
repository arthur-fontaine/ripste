<template>
  <div class="max-w-6xl mx-auto p-8">
    <div class="text-center mb-12 p-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
      <h1 class="text-4xl font-bold mb-4">Welcome to RIPSTE Admin Dashboard</h1>
      <p class="text-xl opacity-90">Your OAuth OIDC Provider Management System</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div class="bg-white p-8 rounded-lg shadow-md border">
        <h2 class="text-2xl mb-4">🔐 Authentication</h2>
        <p class="text-gray-600 mb-6 leading-relaxed">Secure user authentication with email and password</p>
        <div class="flex gap-4 flex-wrap">
          <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">Sign In</router-link>
          <router-link to="/signup" class="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">Sign Up</router-link>
        </div>
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md border">
        <h2 class="text-2xl mb-4">🔑 OAuth Provider</h2>
        <p class="text-gray-600 mb-6 leading-relaxed">Act as an OAuth 2.0 / OIDC Provider for other applications</p>
        <div class="flex gap-4 flex-wrap">
          <router-link to="/oauth-demo" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">Try OAuth Demo</router-link>
        </div>
      </div>

      <div class="bg-white p-8 rounded-lg shadow-md border">
        <h2 class="text-2xl mb-4">📊 Session Management</h2>
        <p class="text-gray-600 mb-6 leading-relaxed">View and manage your current authentication session</p>
        <div v-if="session.data" class="bg-green-50 p-4 rounded border border-green-200">
          <p class="text-green-700 mb-1"><strong>Logged in as:</strong> {{ session.data.user.email }}</p>
          <p class="text-green-700 mb-4"><strong>Session expires:</strong> {{ formatDate(session.data.session.expiresAt) }}</p>
          <button @click="signOut" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">Sign Out</button>
        </div>
        <div v-else class="bg-yellow-50 p-4 rounded border border-yellow-200 text-center">
          <p class="text-yellow-700 mb-4">Not currently authenticated</p>
          <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors">Sign In</router-link>
        </div>
      </div>
    </div>

    <div class="bg-white p-8 rounded-lg shadow-md border">
      <h2 class="text-2xl text-gray-900 mb-4">Quick Start Guide</h2>
      <ol class="text-gray-700 leading-8 pl-6 space-y-2">
        <li><strong class="text-gray-900">Create an account:</strong> Use the Sign Up page to create your account</li>
        <li><strong class="text-gray-900">Sign in:</strong> Log in with your credentials</li>
        <li><strong class="text-gray-900">Register an OAuth App:</strong> Use the OAuth Demo to register a test application</li>
        <li><strong class="text-gray-900">Test the flow:</strong> Try the complete OAuth authorization flow</li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
import { authClient } from "../lib/auth";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const session = authClient.useSession();
const router = useRouter();

onMounted(() => {
	if (session && !session) {
		router.replace("/company/create");
	}
});

const signOut = async () => {
	await authClient.signOut();
};

const formatDate = (date: Date) => {
	return new Date(date).toLocaleString();
};
</script>

