<script setup>

import { ref } from 'vue'

let counters = ref([])
function incrementCounter(counter) {
  counter.value += 1
}

function decrementCounter(counter) {
  counter.value -= 1
}

function addCounter() {
  counters.value.push(ref(0))
}
</script>

<template>
  <main class="flex justify-center items-center flex-col gap-3">
    <h1>home</h1>

    <button @click="addCounter">Add Counter</button>

    <div class="flex justify-center items-center gap-3" v-for="(counter, index) in counters" :key="index">
      <button class="p-2 border rounded" @click="incrementCounter(counter)">+</button>
      <span>{{ counter }}</span>
      <button class="p-2 border rounded" @click="decrementCounter(counter)">-</button>
    </div>
  </main>
</template>
