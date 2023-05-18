<template>
  <q-item class="text-subtitle1 q-py-md">
    <q-item-section>
      {{ `(${String.fromCharCode("A".charCodeAt(0) + index)})  ${option}` }}
    </q-item-section>
    <q-item-section side>
      <q-icon
        v-if="index === answer"
        name="o_circle"
        size="md"
        color="positive"
      />
      <q-icon
        v-else-if="index === reply"
        name="close"
        size="md"
        color="negative"
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
interface Props {
  index: number;
  option: string;
  answer: number;
  reply: number;
}
defineProps<Props>();
</script>
