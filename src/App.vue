<script setup lang="ts">
import { useQuasar } from "quasar";
const $q = useQuasar();
$q.dark.set(true);
</script>

<template>
  <router-view :key="$route.fullPath" />
</template>

<style lang="scss">
body {
  background-color: #f1fafa;
}
</style>
