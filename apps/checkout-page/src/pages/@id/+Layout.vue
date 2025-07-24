<template>
  <div class="checkout">
    <aside class="checkout__hero" aria-label="Brand illustration">
      <div class="checkout__logo-container">
        <img v-if="data.displayData.logo" :src="data.displayData.logo.url" :alt="data.displayData.logo.alt || 'Logo'"
          class="checkout__logo" />
      </div>
    </aside>

    <div class="checkout__content">
      <slot />
      <p v-if="data.displayData.settings?.showPoweredBy ?? true" class="checkout__powered-by">
        Powered by <a href="https://ripste.com" target="_blank" rel="noopener noreferrer">Ripste</a>
      </p>
    </div>
  </div>

  <component :is="'style'">{{ data.style }}</component>
</template>

<script lang="ts" setup>
import type { Data } from "./+data";
import { useData } from "vike-vue/useData";

const data = useData<Data>();
</script>
