<template>
  <div
    @click="selectOption"
    class="row items-center option-border cursor-pointer q-pa-md"
    :class="{
      'selected-option': isSelected && !isSubmitted,
      'wrong-option': showWrong,
      'correct-option': showCorrect && reply === answer,
    }"
  >
    <div class="col-1 text-weight-regular">
      <q-avatar color="secondary" font-size="1.4rem">{{ symbol }}</q-avatar>
    </div>
    <div class="col-9 text-h6">
      {{ content }}
    </div>
    <div class="col-2 text-right">
      <div v-if="showCorrect" class="text-green text-body1">正確答案</div>
      <div v-if="showWrong" class="text-negative text-body1">錯誤選項</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  content: string;
  index: number;
  reply: number;
  answer: number;
  isSubmitted: boolean;
}

const props = defineProps<Props>();
const symbol = String.fromCharCode("A".charCodeAt(0) + props.index);
const isSelected = computed(() => props.index === props.reply);
const showCorrect = computed(
  () => props.isSubmitted && props.index === props.answer
);
const showWrong = computed(
  () =>
    props.isSubmitted &&
    props.index === props.reply &&
    props.index !== props.answer
);

const emit = defineEmits<{
  (e: "select", val: number): void;
}>();

function selectOption() {
  emit("select", props.index);
}
</script>

<style scoped lang="scss">
.option-border {
  border: 2px solid transparent;
  border-radius: 999px;
}
.option-border:hover {
  background-color: $grey-10;
}
.selected-option {
  border-color: $secondary;
  transition: all 0.8s ease;
}
.selected-icon {
  animation: fadeIn 0.8s;
}
.wrong-option {
  border-color: $negative;
}
.correct-option {
  border-color: $secondary;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
