<template>
  <q-chip
    v-if="label"
    outline
    square
    size="lg"
    :ripple="false"
    :class="noPointer ? '' : 'cursor-pointer'"
  >
    {{ label }}
  </q-chip>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  noPointer?: boolean;
}

defineProps<Props>();
</script>
