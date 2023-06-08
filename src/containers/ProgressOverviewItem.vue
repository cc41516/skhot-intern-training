<template>
  <div>
    <q-item clickable>
      <q-item-section avatar class="items-center">
        <q-icon :name="icon" color="secondary" v-bind="iconProps" />
      </q-item-section>
      <q-item-section>{{ label }}</q-item-section>
      <q-item-section side>
        <div v-if="naq" />
        <div v-else-if="!isSubmitted">
          <div v-if="isPartiallyDone" class="text-yellow">未完成</div>
          <div v-else-if="!isDone">未作答</div>
          <div v-else class="text-yellow">未提交</div>
        </div>
        <div v-else>
          <div v-if="isCorrect" class="text-green">正確</div>
          <div v-else-if="isPartiallyDone" class="text-red">未完成</div>
          <div v-else class="text-red">錯誤</div>
        </div>
      </q-item-section>
    </q-item>
    <q-separator />
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  label: string;
  isDone?: boolean;
  isPartiallyDone?: boolean;
  isCorrect?: boolean;
  isSubmitted?: boolean;
  naq?: boolean; // not a question, eg. watching video
  iconProps?: object;
}
defineProps<Props>();
</script>
