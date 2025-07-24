import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiClient } from '../../apiClient.ts'
import type { Data } from './+data';
import { useData } from 'vike-vue/useData';

export const useCardInfosStore = defineStore('cardInfos', () => {
  const data = useData<Data>();

  const holderName = ref('')
  const cardNumber = ref('')
  const month = ref('')
  const year = ref('')
  const cvv = ref('')

  function pay() {
    if (!holderName.value || !cardNumber.value || !month.value || !year.value || !cvv.value) {
      throw new Error('All fields are required')
    }

    const cardType = detectCardType(cardNumber.value)
    apiClient.payments['submit-card-infos'].$post({
      json: {
        provider: cardType,
        cardNumber: cardNumber.value,
        holderName: holderName.value,
        month: Number(month.value),
        year: Number(year.value),
        cvv: cvv.value
      },
      param: {
        uri: data.uri,
      }
    })
  }

  return { holderName, cardNumber, month, year, cvv, pay }
})

function detectCardType(number: string) {
  const cleaned = number.replace(/\D/g, '');

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(cleaned)) return 'visa';
  if (/^5[1-5][0-9]{14}$/.test(cleaned) || /^2(2[2-9]|[3-6][0-9]|7[01])[0-9]{12}$/.test(cleaned)) return 'mastercard';
  if (/^3[47][0-9]{13}$/.test(cleaned)) return 'amex';

  throw new Error('Unsupported card type');
}
