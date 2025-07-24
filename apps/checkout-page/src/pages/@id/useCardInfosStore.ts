import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCardInfosStore = defineStore('cardInfos', () => {
  const holderName = ref('')
  const cardNumber = ref('')
  const month = ref('')
  const year = ref('')
  const cvv = ref('')

  function pay() {
    console.log('Processing payment with the following card details:')
    console.log(`Holder Name: ${holderName.value}`)
    console.log(`Card Number: ${cardNumber.value}`)
    console.log(`Expiration Date: ${month.value}/${year.value}`)
    console.log(`CVV: ${cvv.value}`)
  }

  return { holderName, cardNumber, month, year, cvv, pay }
})
