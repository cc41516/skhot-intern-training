<template>
  <div>
    <QuestionStatement :content="statement" />
    <ChoiceOptions :options="options" :reply="reply" @select="updateReply" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";
import QuestionStatement from "@/components/QuestionStatement.vue";
import ChoiceOptions from "@/components/ChoiceOptions.vue";

interface Props {
  questionIndex: number;
  post?: boolean;
}
const props = defineProps<Props>();
const store = props.post ? usePostChoiceStore() : usePreChoiceStore();

const { statement, options } = store.getQuestion(props.questionIndex);
const reply = computed(() => store.getReply(props.questionIndex));

function updateReply(reply: number) {
  store.doQuestion(props.questionIndex, reply);
}
</script>
