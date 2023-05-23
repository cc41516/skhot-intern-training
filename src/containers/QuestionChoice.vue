<template>
  <div>
    <QuestionStatement :content="statement" />
    <QuestionChoiceOptions :options="options" :reply="reply" :answer="answer" @select="updateReply" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";
import QuestionStatement from "@/components/QuestionStatement.vue";
import QuestionChoiceOptions from "@/components/QuestionChoiceOptions.vue";
import { ChoiceAnswer } from "@/global";

interface Props {
  questionIndex: number;
  post?: boolean;
}
const props = defineProps<Props>();
const store = props.post ? usePostChoiceStore() : usePreChoiceStore();

const { statement, options } = store.getQuestion(props.questionIndex);
const reply = computed(() => store.getReply(props.questionIndex));
const answer: ChoiceAnswer = {
  hide: !store.isSubmitted,
  answer: store.getAnswer(props.questionIndex),
}

function updateReply(reply: number) {
  store.doQuestion(props.questionIndex, reply);
}
</script>
