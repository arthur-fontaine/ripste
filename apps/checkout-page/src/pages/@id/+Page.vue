<template>
  <div>
    <p>{{ formattedAmount }}</p>
  </div>
</template>

<script lang="ts" setup>
import type { Data } from "./+data";
import { useData } from "vike-vue/useData";

const data = useData<Data>();

const formattedAmount = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: data.currency,
}).format(data.amount);
</script>
