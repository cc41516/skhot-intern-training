<template>
  <q-chip outline square size="lg" color="black" class="cursor-pointer">
    {{ label }}
  </q-chip>
</template>

<script setup lang="ts">
interface Props {
  label: string;
}

defineProps<Props>();
</script>
