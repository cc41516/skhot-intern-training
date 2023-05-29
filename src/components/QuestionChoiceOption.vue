<template>
  <q-btn
    rounded
    unelevated
    align="between"
    :ripple="false"
    size="xl"
    @click="selectOption"
    class="transparent-border"
    :class="{
      'selected-option': isSelected && answer.hide,
      'wrong-option': showWrong,
      'correct-option': showCorrect && reply === answer.answer,
    }"
  >
    <div class="text-body1 text-weight-regular">
      <q-avatar color="secondary" font-size="1.2rem" class="q-mr-xl">{{
        symbol
      }}</q-avatar>
      {{ content }}
    </div>
    <div v-if="showCorrect" class="text-green text-body1">正確答案</div>
    <div v-if="showWrong" class="text-negative text-body1">錯誤選項</div>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ChoiceAnswer } from "@/global";

interface Props {
  content: string;
  index: number;
  reply: number;
  answer: ChoiceAnswer;
}

const props = defineProps<Props>();
const symbol = String.fromCharCode("A".charCodeAt(0) + props.index);
const isSelected = computed(() => props.index == props.reply);
const showCorrect: boolean =
  !props.answer.hide && props.index === props.answer.answer;
const showWrong: boolean =
  !props.answer.hide &&
  props.index === props.reply &&
  props.index !== props.answer.answer;

const emit = defineEmits<{
  (e: "select", val: number): void;
}>();

function selectOption() {
  emit("select", props.index);
}
</script>

<style scoped lang="scss">
.transparent-border {
  border: 2px solid transparent;
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
