<template>
  <nav class="bg-blue-600 text-white py-4 mb-8">
    <div class="max-w-6xl mx-auto flex justify-between items-center px-4">
      <router-link to="/" class="flex items-center gap-3">
        <img src="../assets/logo_admin.png" alt="RIPSTE Logo" class="h-12 w-auto" />
      </router-link>
      <div class="flex gap-4 items-center">
        <template v-if="session.data">
          <router-link to="/" class="hover:bg-white/20 px-3 py-2 rounded transition-colors">Home</router-link>
          
          <div class="relative" v-click-outside="() => showUserMenu = false">
            <button 
              @click="showUserMenu = !showUserMenu"
              class="flex items-center gap-2 hover:bg-white/20 px-3 py-2 rounded transition-colors"
            >
              <span>{{ session.data.user.email }}</span>
              <svg class="w-4 h-4" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <router-link 
                to="/profile" 
                class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                @click="showUserMenu = false"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Profile Settings
                </span>
              </router-link>
              
              <button 
                @click="signOut" 
                class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors border-t border-gray-100"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                  </svg>
                  Sign Out
                </span>
              </button>
            </div>
          </div>
        </template>
        
        <template v-else>
          <router-link to="/login" class="hover:bg-white/20 px-3 py-2 rounded transition-colors">Login</router-link>
          <router-link to="/signup" class="hover:bg-white/20 px-3 py-2 rounded transition-colors">Sign Up</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authClient } from "../lib/auth";
import {useRouter} from "vue-router";

const session = authClient.useSession();
const showUserMenu = ref(false);

const router = useRouter();

const signOut = async () => {
	showUserMenu.value = false;
	await authClient.signOut();
  await router.push("/login");
};
</script>