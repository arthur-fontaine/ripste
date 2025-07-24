<template>
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
        <input id="card-name" type="text" required autocomplete="cc-name" class="checkout__input" placeholder="John Doe"
          v-model="cardInfos.holderName" />
      </div>

      <div class="checkout__field">
        <label for="card-number" class="checkout__label">Card number</label>
        <input id="card-number" type="text" required autocomplete="cc-number" inputmode="numeric"
          placeholder="1234 5678 9012 3456" v-model="cardInfos.cardNumber" class="checkout__input" />
      </div>

      <div class="checkout__grid">
        <div class="checkout__field">
          <label for="exp-date" class="checkout__label">Exp. date</label>
          <div class="checkout__exp-group">
            <input id="exp-month" type="text" required placeholder="MM" inputmode="numeric" maxlength="2"
              autocomplete="cc-exp-month" v-model="cardInfos.month" class="checkout__input checkout__input--left" />
            <span class="checkout__exp-separator">/</span>
            <input id="exp-year" type="text" required placeholder="YYYY" inputmode="numeric" maxlength="4" minlength="2"
              autocomplete="cc-exp-year" v-model="cardInfos.year" class="checkout__input checkout__input--right" />
          </div>
        </div>

        <div class="checkout__field">
          <label for="cvv" class="checkout__label">CVV</label>
          <input id="cvv" type="text" required inputmode="numeric" autocomplete="cc-csc" v-model="cardInfos.cvv"
            placeholder="123" class="checkout__input" maxlength="4" minlength="3" />
        </div>
      </div>

      <button type="submit" class="checkout__button" @click.prevent="cardInfos.pay">
        {{ data.displayData.customTexts?.payButton || 'Pay' }}&nbsp;
        <span class="checkout__amount">{{ formattedAmount }}</span>
      </button>
    </form>
  </main>
</template>

<script lang="ts" setup>
import type { Data } from './+data';
import { useData } from 'vike-vue/useData';
import { useCardInfosStore } from './useCardInfosStore';

const data = useData<Data>();
const cardInfos = useCardInfosStore();

const formattedAmount = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: data.currency
}).format(data.amount);

cardInfos.$subscribe((_, state) => {
  if (state.payResult.status === 'success') {
    window.location.href = `${window.location.pathname}/success`;
  } else if (state.payResult.status === 'error') {
  }
});
</script>
