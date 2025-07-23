<template>
  <div>
    <p>{{ data.id }}</p>
  </div>
</template>

<script lang="ts" setup>
import type { Data } from "./+data";
import { useData } from "vike-vue/useData";

const data = useData<Data>();
</script>
