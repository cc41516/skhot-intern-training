<template>
  <div class="text-h6 q-my-md text-green">
    {{ content }}
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string;
}
defineProps<Props>();
</script>
