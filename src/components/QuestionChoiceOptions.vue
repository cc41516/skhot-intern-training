<template>
  <div class="column q-gutter-y-lg">
    <QuestionChoiceOption
      v-for="(option, index) in options"
      :key="index"
      :content="option"
      :index="index"
      :reply="reply"
      :answer="answer"
      @select="updateReply"
    />
  </div>
</template>

<script setup lang="ts">
import QuestionChoiceOption from "@/components/QuestionChoiceOption.vue";
import { ChoiceAnswer } from "@/global"

interface Props {
  options: string[];
  reply: number;
  answer: ChoiceAnswer;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "select", reply: number): void;
}>();

function updateReply(reply: number) {
  emit("select", reply);
}
</script>
