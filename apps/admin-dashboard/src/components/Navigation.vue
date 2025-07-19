<template>
  <nav class="bg-blue-600 text-white py-4 mb-8">
    <div class="max-w-6xl mx-auto flex justify-between items-center px-4">
      <h1 class="text-xl font-bold">RIPSTE Admin</h1>
      <div class="flex gap-4 items-center">
        <router-link to="/" class="hover:bg-white/20 px-3 py-2 rounded transition-colors">Home</router-link>
        <router-link to="/login" class="hover:bg-white/20 px-3 py-2 rounded transition-colors">Login</router-link>
        <router-link to="/signup" class="hover:bg-white/20 px-3 py-2 rounded transition-colors">Sign Up</router-link>
        <router-link to="/oauth-demo" class="hover:bg-white/20 px-3 py-2 rounded transition-colors">OAuth Demo</router-link>
        <button v-if="session.data" @click="signOut" class="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition-colors">
          Sign Out ({{ session.data.user.email }})
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { authClient } from "../lib/auth";

const session = authClient.useSession();

const signOut = async () => {
	await authClient.signOut();
};
</script>


