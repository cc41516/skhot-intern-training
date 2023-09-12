<template>
  <q-card
    v-if="label"
    flat
    bordered
    :color="color"
    :class="{
      'no-pointer-events': isSubmitted,
      'cursor-pointer': !isSubmitted,
      'bg-green-3': color == 'green',
      'bg-red-3': color == 'red',
      'bg-blue-3': color == 'blue',
    }"
    class="text-subtitle1 q-ma-sm q-pa-sm"
  >
    {{ label }}
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  color?: string;
  isSubmitted?: boolean
}

defineProps<Props>();
</script>
