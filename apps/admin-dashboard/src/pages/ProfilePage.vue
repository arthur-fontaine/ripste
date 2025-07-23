<template>
  <div class="max-w-4xl mx-auto p-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="border-b border-gray-200 p-6">
        <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p class="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>

      <div class="p-6">
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          
          <form v-if="session.data" @submit.prevent="updateProfile" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div class="bg-gray-50 px-3 py-2 border border-gray-300 rounded-lg text-gray-600">
                {{ session.data.user.email }}
                <span class="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ session.data.user.emailVerified ? 'Verified' : 'Unverified' }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-1">Email cannot be changed. Contact support if needed.</p>
            </div>

            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                id="name" 
                v-model="profileForm.name" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter your full name"
              />
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="submit" 
                :disabled="profileLoading"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                {{ profileLoading ? 'Saving...' : 'Save Changes' }}
              </button>
              
              <button 
                type="button" 
                @click="resetForm"
                class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Reset
              </button>
            </div>

            <div v-if="profileError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
              {{ profileError }}
            </div>
            
            <div v-if="profileSuccess" class="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
              {{ profileSuccess }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { authClient } from "../lib/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const session = authClient.useSession();

// États pour le formulaire de profil
const profileForm = ref({
  name: "",
});
const profileLoading = ref(false);
const profileError = ref("");
const profileSuccess = ref("");

// États pour le changement de mot de passe
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const passwordLoading = ref(false);
const passwordError = ref("");
const passwordSuccess = ref("");

const signOutLoading = ref(false);

onMounted(() => {
  if (session.value.data) {
    profileForm.value.name = session.value.data.user.name || "";
  }
});

const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleString();
};

const resetForm = () => {
  if (session.value.data) {
    profileForm.value.name = session.value.data.user.name || "";
  }
  profileError.value = "";
  profileSuccess.value = "";
};

const updateProfile = async () => {
  profileLoading.value = true;
  profileError.value = "";
  profileSuccess.value = "";

  try {
    // Ici vous devriez appeler votre API pour mettre à jour le profil
    // Exemple d'appel fictif :
    // await authClient.updateProfile({ name: profileForm.value.name });
    
    // Simulation d'un délai
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    profileSuccess.value = "Profile updated successfully!";
  } catch (err: unknown) {
    console.error("Profile update failed:", err);
    profileError.value = err instanceof Error ? err.message : "Failed to update profile";
  } finally {
    profileLoading.value = false;
  }
};

</script>