<template>
  <div class="max-w-4xl mx-auto p-8">
    <div class="bg-white rounded-lg shadow-md">
      <div class="border-b border-gray-200 p-6">
        <h1 class="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p class="text-gray-600 mt-2">Manage your account information and preferences</p>
      </div>

      <div class="p-6">
        <div class="mb-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
          
          <form v-if="session.data" @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-2">
                  First Name <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="firstName" 
                  v-model="profileForm.firstName" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-2">
                  Last Name <span class="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  id="lastName" 
                  v-model="profileForm.lastName" 
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input 
                type="tel" 
                id="phone" 
                v-model="profileForm.phone" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter your phone number (optional)"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div class="bg-gray-50 px-3 py-2 border border-gray-300 rounded-lg text-gray-600 flex items-center justify-between">
                <span>{{ session.data.user.email }}</span>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" 
                      :class="session.data.user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                  {{ session.data.user.emailVerified ? 'Verified' : 'Unverified' }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-1">Email cannot be changed. Contact support if needed.</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name Preview</label>
              <div class="bg-blue-50 px-3 py-2 border border-blue-200 rounded-lg text-blue-800">
                {{ computedFullName || 'Enter first and last name above' }}
              </div>
              <p class="text-sm text-gray-500 mt-1">This is how your name will appear throughout the system.</p>
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="submit" 
                :disabled="profileLoading || !isFormValid"
                class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="profileLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ profileLoading ? 'Saving...' : 'Save Changes' }}
              </button>
              
              <button 
                type="button" 
                @click="resetForm"
                :disabled="profileLoading"
                class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>

            <div v-if="profileError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="font-medium">Error updating profile</h4>
                <p class="mt-1">{{ profileError }}</p>
              </div>
            </div>
            
            <div v-if="profileSuccess" class="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="font-medium">Profile updated successfully!</h4>
                <p class="mt-1">{{ profileSuccess }}</p>
              </div>
            </div>
          </form>
        </div>

        <!-- Password Change Section -->
        <div class="border-t border-gray-200 pt-8 mt-8">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
          
          <form @submit.prevent="updatePassword" class="space-y-6 max-w-md">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Current Password <span class="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                id="currentPassword" 
                v-model="passwordForm.currentPassword" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter your current password"
              />
            </div>

            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-2">
                New Password <span class="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                id="newPassword" 
                v-model="passwordForm.newPassword" 
                required
                minlength="8"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Enter your new password"
              />
              <p class="text-sm text-gray-500 mt-1">Password must be at least 8 characters long.</p>
            </div>

            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password <span class="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="passwordForm.confirmPassword" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                :class="{ 'border-red-300': passwordMismatch }"
                placeholder="Confirm your new password"
              />
              <p v-if="passwordMismatch" class="text-sm text-red-600 mt-1">Passwords do not match.</p>
            </div>

            <div class="flex gap-4 pt-4">
              <button 
                type="submit" 
                :disabled="passwordLoading || passwordMismatch || !isPasswordFormValid"
                class="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="passwordLoading" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ passwordLoading ? 'Updating...' : 'Update Password' }}
              </button>
              
              <button 
                type="button" 
                @click="resetPasswordForm"
                :disabled="passwordLoading"
                class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                Reset
              </button>
            </div>

            <div v-if="passwordError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="font-medium">Error updating password</h4>
                <p class="mt-1">{{ passwordError }}</p>
              </div>
            </div>
            
            <div v-if="passwordSuccess" class="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg flex items-start gap-3">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.236 4.53L7.53 10.53a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
              </svg>
              <div>
                <h4 class="font-medium">Password updated successfully!</h4>
                <p class="mt-1">{{ passwordSuccess }}</p>
              </div>
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

const session = authClient.useSession();

const profileForm = ref({
	firstName: "",
	lastName: "",
	phone: "",
});
const profileLoading = ref(false);
const profileError = ref("");
const profileSuccess = ref("");

const passwordForm = ref({
	currentPassword: "",
	newPassword: "",
	confirmPassword: "",
});
const passwordLoading = ref(false);
const passwordError = ref("");
const passwordSuccess = ref("");

const computedFullName = computed(() => {
	const first = profileForm.value.firstName.trim();
	const last = profileForm.value.lastName.trim();
	return first && last ? `${first} ${last}` : "";
});

const isFormValid = computed(() => {
	return (
		profileForm.value.firstName.trim() && profileForm.value.lastName.trim()
	);
});

const passwordMismatch = computed(() => {
	return (
		passwordForm.value.newPassword &&
		passwordForm.value.confirmPassword &&
		passwordForm.value.newPassword !== passwordForm.value.confirmPassword
	);
});

const isPasswordFormValid = computed(() => {
	return (
		passwordForm.value.currentPassword &&
		passwordForm.value.newPassword &&
		passwordForm.value.confirmPassword &&
		passwordForm.value.newPassword.length >= 8 &&
		!passwordMismatch.value
	);
});

onMounted(() => {
	if (session.value.data?.user) {
		const user = session.value.data.user;
		if (user.name) {
			const nameParts = user.name.split(" ");
			profileForm.value.firstName = nameParts[0] || "";
			profileForm.value.lastName = nameParts.slice(1).join(" ") || "";
		}
	}
});

const resetForm = () => {
	if (session.value.data?.user) {
		const user = session.value.data.user;
		if (user.name) {
			const nameParts = user.name.split(" ");
			profileForm.value.firstName = nameParts[0] || "";
			profileForm.value.lastName = nameParts.slice(1).join(" ") || "";
		}
	}
	profileError.value = "";
	profileSuccess.value = "";
};

const resetPasswordForm = () => {
	passwordForm.value = {
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	};
	passwordError.value = "";
	passwordSuccess.value = "";
};

const updateProfile = async () => {
	profileLoading.value = true;
	profileError.value = "";
	profileSuccess.value = "";

	try {
		const fullName = computedFullName.value;

		await authClient.updateUser({
			name: fullName,
		});

		profileSuccess.value = "Profile updated successfully!";
	} catch (err: unknown) {
		console.error("Profile update failed:", err);
		profileError.value =
			err instanceof Error ? err.message : "Failed to update profile";
	} finally {
		profileLoading.value = false;
	}
};

const updatePassword = async () => {
	passwordLoading.value = true;
	passwordError.value = "";
	passwordSuccess.value = "";

	try {
		await authClient.changePassword({
			currentPassword: passwordForm.value.currentPassword,
			newPassword: passwordForm.value.newPassword,
		});

		passwordSuccess.value = "Password updated successfully!";
		resetPasswordForm();
	} catch (err: unknown) {
		console.error("Password update failed:", err);
		passwordError.value =
			err instanceof Error ? err.message : "Failed to update password";
	} finally {
		passwordLoading.value = false;
	}
};

setTimeout(() => {
	if (profileSuccess.value) profileSuccess.value = "";
	if (passwordSuccess.value) passwordSuccess.value = "";
}, 5000);
</script>