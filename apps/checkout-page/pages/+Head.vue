<!-- https://vike.dev/Head -->

<template>
  <link rel="icon" :href="logoUrl" />

  <link rel="stylesheet" :href="tailwindCss" />
</template>

<script setup lang="ts">
import logoUrl from "../assets/logo.svg";

import * as tailwindCss from "../layouts/tailwind.css";
</script>
