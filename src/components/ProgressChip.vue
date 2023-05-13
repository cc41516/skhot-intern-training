<template>
  <q-chip color="teal-5" text-color="white" :label="label" />
</template>

<script setup lang="ts">
defineProps<{
  label: string;
}>();
</script>
