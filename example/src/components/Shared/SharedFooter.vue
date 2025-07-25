<script setup>
const socialLinks = [
	{ name: "Facebook", icon: "facebook", url: "#" },
	{ name: "Twitter", icon: "twitter", url: "#" },
	{ name: "Instagram", icon: "instagram", url: "#" },
	{ name: "YouTube", icon: "youtube", url: "#" },
];

const footerSections = [
	{
		title: "À propos",
		links: [
			{ text: "Notre histoire", url: "#" },
			{ text: "Comment ça marche", url: "#" },
			{ text: "Authenticité", url: "#" },
			{ text: "Presse", url: "#" },
			{ text: "Carrières", url: "#" },
		],
	},
	{
		title: "Aide",
		links: [
			{ text: "Centre d'aide", url: "#" },
			{ text: "Expédition", url: "#" },
			{ text: "Retours", url: "#" },
			{ text: "Nous contacter", url: "#" },
			{ text: "FAQ", url: "#" },
		],
	},
	{
		title: "Catégories populaires",
		links: [
			{ text: "Sneakers", url: "#" },
			{ text: "Streetwear", url: "#" },
			{ text: "Électronique", url: "#" },
			{ text: "Cartes à collectionner", url: "#" },
			{ text: "Accessoires", url: "#" },
		],
	},
	{
		title: "Ressources",
		links: [
			{ text: "Blog", url: "#" },
			{ text: "Guide des tailles", url: "#" },
			{ text: "Tendances du marché", url: "#" },
			{ text: "Nouveautés", url: "#" },
			{ text: "Partenaires", url: "#" },
		],
	},
];

function getSocialIcon(iconName) {
	switch (iconName) {
		case "facebook":
			return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.14 7.17h-3.87V4.8c0-.82.23-1.35 1.35-1.35h2.48V0h-3.41c-3.15 0-4.12 2.14-4.12 4.72v2.45H8.11v3.4h2.47V20h3.69v-9.43h3.17l.47-3.4z" />
              </svg>`;
		case "twitter":
			return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 5.8a8.5 8.5 0 0 1-2.36.64 4.13 4.13 0 0 0 1.81-2.27 8.29 8.29 0 0 1-2.6 1 4.13 4.13 0 0 0-7.09 3.74 11.65 11.65 0 0 1-8.45-4.3 4.13 4.13 0 0 0 1.27 5.5A4.1 4.1 0 0 1 2.8 9.6v.05a4.14 4.14 0 0 0 3.31 4.07 4.15 4.15 0 0 1-1.87.07A4.13 4.13 0 0 0 8.08 17 8.33 8.33 0 0 1 2 18.34 11.62 11.62 0 0 0 8.29 20 11.59 11.59 0 0 0 20 8.45c0-.17 0-.35-.01-.53A8.32 8.32 0 0 0 22 5.8z" />
              </svg>`;
		case "instagram":
			return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85 0 3.2-.01 3.58-.07 4.85-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07-3.2 0-3.58-.01-4.85-.07-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85 0-3.2.01-3.58.07-4.85.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.15.63c-.78.3-1.44.7-2.1 1.36-.66.66-1.06 1.32-1.36 2.1-.3.75-.5 1.63-.56 2.9-.06 1.28-.07 1.69-.07 4.95 0 3.26.01 3.67.07 4.95.06 1.27.26 2.15.56 2.9.3.78.7 1.44 1.36 2.1.66.66 1.32 1.06 2.1 1.36.75.3 1.63.5 2.9.56 1.28.06 1.69.07 4.95.07 3.26 0 3.67-.01 4.95-.07 1.27-.06 2.15-.26 2.9-.56.78-.3 1.44-.7 2.1-1.36.66-.66 1.06-1.32 1.36-2.1.3-.75.5-1.63.56-2.9.06-1.28.07-1.69.07-4.95 0-3.26-.01-3.67-.07-4.95-.06-1.27-.26-2.15-.56-2.9-.3-.78-.7-1.44-1.36-2.1-.66-.66-1.32-1.06-2.1-1.36-.75-.3-1.63-.5-2.9-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.84-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
              </svg>`;
		case "youtube":
			return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.5 6.19a3 3 0 0 0-2.1-2.1c-1.9-.51-9.4-.51-9.4-.51s-7.51 0-9.4.51a3 3 0 0 0-2.1 2.1 31.55 31.55 0 0 0-.5 5.81 31.55 31.55 0 0 0 .5 5.81 3 3 0 0 0 2.1 2.1c1.9.51 9.4.51 9.4.51s7.51 0 9.4-.51a3 3 0 0 0 2.1-2.1 31.55 31.55 0 0 0 .5-5.81 31.55 31.55 0 0 0-.5-5.81zM9.75 15.36V8.64l6.25 3.36-6.25 3.36z" />
              </svg>`;
		default:
			return "";
	}
}
</script>

<template>
  <footer class="bg-gray-900 text-gray-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        <div class="lg:col-span-1">
          <div class="mb-4">
            <h2 class="text-xl font-bold text-white">StockX Clone</h2>
          </div>
          <p class="text-sm text-gray-400 mb-4">
            L'endroit idéal pour acheter et vendre des sneakers, du streetwear, de l'électronique et plus encore.
          </p>
          
          <div class="flex space-x-4 mt-6">
            <a 
              v-for="social in socialLinks" 
              :key="social.name" 
              :href="social.url" 
              class="text-gray-400 hover:text-white transition-colors"
              :title="social.name"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span v-html="getSocialIcon(social.icon)"></span>
              <span class="sr-only">{{ social.name }}</span>
            </a>
          </div>
        </div>
        
        <div 
          v-for="section in footerSections" 
          :key="section.title"
          class="lg:col-span-1"
        >
          <h3 class="text-sm font-semibold text-white tracking-wider uppercase mb-4">
            {{ section.title }}
          </h3>
          <ul class="space-y-2">
            <li v-for="link in section.links" :key="link.text">
              <a :href="link.url" class="text-sm text-gray-400 hover:text-white transition-colors">
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-6 md:mb-0">
            <h3 class="text-sm font-semibold text-white mb-2">Téléchargez notre application</h3>
            <p class="text-xs text-gray-400">
              Achetez, vendez et découvrez les dernières tendances où que vous soyez.
            </p>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="block">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" class="h-10">
            </a>
            <a href="#" class="block">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" class="h-10">
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <div class="bg-gray-950 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div class="text-xs text-gray-400 mb-4 md:mb-0">
          &copy; {{ new Date().getFullYear() }} StockX Clone. Tous droits réservés.
        </div>
        <div class="flex space-x-6">
          <a href="#" class="text-xs text-gray-400 hover:text-white transition-colors">Conditions d'utilisation</a>
          <a href="#" class="text-xs text-gray-400 hover:text-white transition-colors">Politique de confidentialité</a>
          <a href="#" class="text-xs text-gray-400 hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </div>
  </footer>
</template>