<template>
  <q-card
    bordered
    :class="disabled ? 'disabled' : 'permitted'"
  >
    <q-card-section class="q-pa-lg">
      <q-img :src="image" />
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="text-h6 q-pb-sm">{{ title }}</div>
      <div class="text-caption1">{{ description }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  image: string;
  disabled?: boolean;
}
defineProps<Props>();
</script>

<style scoped lang="scss">
.disabled {
  cursor: not-allowed;
  background-color: $grey-5;
}

.permitted:hover {
  background-color: $grey-1;
}
</style>