<template>
  <q-chip
    v-if="label"
    outline
    square
    size="lg"
    :ripple="false"
    :color="color"
    :class="isSubmitted ? 'no-pointer-events' : 'cursor-pointer'"
  >
    {{ label }}
  </q-chip>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  color?: string;
  isSubmitted?: boolean
}

defineProps<Props>();
</script>
