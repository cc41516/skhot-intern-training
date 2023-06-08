<template>
  <div>
    <QuestionStatement :content="statement" />
    <QuestionChoiceOptions
      :options="options"
      :reply="reply"
      :answer="answer"
      :isSubmitted="isSubmitted"
      @select="updateReply"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";
import QuestionStatement from "@/components/QuestionStatement.vue";
import QuestionChoiceOptions from "@/components/QuestionChoiceOptions.vue";

interface Props {
  questionIndex: number;
  post?: boolean;
}
const props = defineProps<Props>();
const store = props.post ? usePostChoiceStore() : usePreChoiceStore();

const { statement, options } = store.getQuestion(props.questionIndex);
const reply = computed(() => store.getReply(props.questionIndex));
const answer: number = store.getAnswer(props.questionIndex);
const isSubmitted = computed(() => store.isSubmitted);

function updateReply(reply: number) {
  store.doQuestion(props.questionIndex, reply);
}
</script>
