<template>
  <div class="text-h5 text-weight-bold text-left q-my-xl">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string;
}

defineProps<Props>();
</script>
