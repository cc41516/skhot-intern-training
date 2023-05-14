<template>
  <div>
    <q-item clickable>
      <q-item-section avatar class="items-center">
        <q-icon :name="icon" color="secondary" v-bind="iconProps" />
      </q-item-section>
      <q-item-section>{{ label }}</q-item-section>
      <q-item-section v-if="isDone === 'Not_A_Question'" />
      <q-item-section v-else-if="isDone" side>
        <q-icon name="done" color="secondary" />
      </q-item-section>
      <q-item-section v-else="isDone" side> 未作答 </q-item-section>
    </q-item>
    <q-separator />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  label: string;
  isDone?: boolean | string;
  iconProps?: object;
}
const props = withDefaults(defineProps<Props>(), {
  isDone: 'Not_A_Question'
});
</script>
