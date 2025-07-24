<template>
  <div class="checkout">
    <aside class="checkout__hero" aria-label="Brand illustration">
      <div class="checkout__logo-container">
        <img v-if="data.displayData.logo" :src="data.displayData.logo.url" :alt="data.displayData.logo.alt || 'Logo'"
          class="checkout__logo" />
      </div>
    </aside>

    <main class="checkout__form-container">
      <section class="checkout__info" aria-labelledby="checkout-title">
        <h1 id="checkout-title" class="checkout__title">
          {{ data.displayData.title || 'Checkout' }}
        </h1>
        <p class="checkout__description">
          {{ data.displayData.description || '' }}
        </p>
      </section>

      <form class="checkout__form" novalidate>
        <div class="checkout__field">
          <label for="card-name" class="checkout__label">Name on card</label>
          <input id="card-name" type="text" required autocomplete="cc-name" class="checkout__input" />
        </div>

        <div class="checkout__field">
          <label for="card-number" class="checkout__label">Card number</label>
          <input id="card-number" type="text" required autocomplete="cc-number" inputmode="numeric"
            class="checkout__input" />
        </div>

        <div class="checkout__grid">
          <div class="checkout__field">
            <label for="exp-date" class="checkout__label">Exp. date</label>
            <input id="exp-date" type="text" required placeholder="MM/YY" autocomplete="cc-exp"
              class="checkout__input" />
          </div>

          <div class="checkout__field">
            <label for="cvv" class="checkout__label">CVV</label>
            <input id="cvv" type="text" required inputmode="numeric" autocomplete="cc-csc" class="checkout__input" />
          </div>
        </div>

        <button type="submit" class="checkout__button">
          {{ data.displayData.customTexts?.payButton || 'Pay' }}&nbsp;
          <span class="checkout__amount">{{ formattedAmount }}</span>
        </button>

        <p v-if="data.displayData.settings?.showPoweredBy ?? true" class="checkout__powered-by">
          Powered by <a href="https://ripste.com" target="_blank" rel="noopener noreferrer">Ripste</a>
        </p>
      </form>
    </main>
  </div>

  <component :is="'style'">{{ data.style }}</component>
</template>

<script lang="ts" setup>
import type { Data } from './+data';
import { useData } from 'vike-vue/useData';

const data = useData<Data>();

const formattedAmount = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: data.currency
}).format(data.amount);
</script>
