<template>
  <q-chip
    v-if="label"
    outline
    square
    size="lg"
    :ripple="false"
    :class="draggable ? 'cursor-pointer' : 'no-pointer-events'"
  >
    {{ label }}
  </q-chip>
</template>

<script setup lang="ts">
interface Props {
  label?: string;
  draggable?: boolean;
}

defineProps<Props>();
</script>
