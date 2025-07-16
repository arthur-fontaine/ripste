<template>
  <div class="max-w-4xl mx-auto p-8">
    <div class="bg-white p-8 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold text-center mb-8 text-gray-900">OAuth OIDC Demo</h1>
      
      <div class="mb-8 pb-8 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Step 1: Create Account & Register OAuth App</h2>
        <div class="flex flex-col gap-4">
          <p class="text-gray-600">First, you need to create an account and register an OAuth application.</p>
          <div class="flex gap-4 flex-wrap">
            <router-link to="/signup" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">Create Account</router-link>
            <button @click="registerApp" :disabled="registeringApp" class="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer disabled:cursor-not-allowed">
              {{ registeringApp ? 'Registering...' : 'Register OAuth App' }}
            </button>
          </div>
          
          <div v-if="appRegistered" class="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 class="text-green-800 font-semibold mb-2">App Registered Successfully!</h3>
            <p class="text-green-700 mb-1"><strong>Client ID:</strong> {{ clientId }}</p>
            <p class="text-green-700 mb-3"><strong>Client Secret:</strong> {{ clientSecret }}</p>
            <p class="bg-yellow-100 border border-yellow-300 text-yellow-800 p-2 rounded text-sm">⚠️ Save these credentials securely - the client secret won't be shown again!</p>
          </div>
        </div>
      </div>

      <div class="mb-8 pb-8 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Step 2: Test OAuth Flow</h2>
        <div class="flex flex-col gap-4">
          <p class="text-gray-600">Test the complete OAuth authorization flow:</p>
          
          <div class="flex flex-col gap-2">
            <label for="client-id" class="font-medium text-gray-700">Client ID:</label>
            <input 
              type="text" 
              id="client-id" 
              v-model="testClientId" 
              placeholder="Enter your client ID"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="redirect-uri" class="font-medium text-gray-700">Redirect URI:</label>
            <input 
              type="url" 
              id="redirect-uri" 
              v-model="redirectUri" 
              placeholder="https://example.com"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button @click="startOAuthFlow" :disabled="!testClientId" class="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-colors disabled:cursor-not-allowed w-fit">
            Start OAuth Flow
          </button>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-gray-700 font-medium mb-2">What happens next:</h3>
            <ol class="list-decimal list-inside text-gray-600 space-y-1">
              <li>You'll be redirected to the authorization page</li>
              <li>If not logged in, you'll go to the login page first</li>
              <li>After login, you'll see the consent page</li>
              <li>After consent, you'll be redirected with an authorization code</li>
            </ol>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Current Session</h2>
        <div class="flex flex-col gap-4">
          <div v-if="session.data" class="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <h3 class="text-gray-700 font-medium mb-2">Logged in as:</h3>
            <pre class="bg-white p-4 rounded border border-gray-300 overflow-x-auto text-sm">{{ JSON.stringify(session.data, null, 2) }}</pre>
          </div>
          <div v-else class="text-center text-gray-600">
            <p class="mb-4">Not currently logged in</p>
            <router-link to="/login" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors">Sign In</router-link>
          </div>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authClient } from "../lib/auth";

const session = authClient.useSession();

const registeringApp = ref(false);
const appRegistered = ref(false);
const clientId = ref("");
const clientSecret = ref("");
const testClientId = ref("");
const redirectUri = ref("https://example.com");
const error = ref("");

const registerApp = async () => {
	registeringApp.value = true;
	error.value = "";

	try {
		const response = await authClient.oauth2.register({
			client_name: "Test OAuth App",
			redirect_uris: [redirectUri.value],
		});

		if (response.data) {
			appRegistered.value = true;
			clientId.value = response.data.client_id;
			clientSecret.value = response.data.client_secret;
			testClientId.value = response.data.client_id;
		} else if (response.error) {
			error.value = response.error.message || "Failed to register app";
		}
	} catch (err: any) {
		console.error("App registration failed:", err);
		error.value = err.message || "An error occurred during app registration";
	} finally {
		registeringApp.value = false;
	}
};

const startOAuthFlow = () => {
	if (!testClientId.value) {
		error.value = "Please enter a client ID";
		return;
	}

	const authUrl = new URL(`http://localhost:3000/auth/oauth2/authorize`);
	authUrl.searchParams.set("client_id", testClientId.value);
	authUrl.searchParams.set("response_type", "code");
	authUrl.searchParams.set("redirect_uri", redirectUri.value);
	authUrl.searchParams.set("scope", "openid profile email");

	// Navigate to the authorization URL
	(window as any).location.href = authUrl.toString();
};
</script>


