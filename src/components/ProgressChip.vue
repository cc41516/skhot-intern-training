<template>
  <q-chip color="teal-5" text-color="white">
    Question {{ value }}
  </q-chip>
</template>

<script setup lang="ts">
interface Props {
    value: number,
}

defineProps<Props>()
</script>
