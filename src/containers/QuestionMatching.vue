<template>
  <div>
    <QuestionStatement :content="statement" />
    <QuestionMatchingTable :cases="cases" :reply="reply" @select="updateReply" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { usePreMatchingStore, usePostMatchingStore, MatchingCaseReply } from "@/store/matching";
import QuestionStatement from "@/components/QuestionStatement.vue";
import QuestionMatchingTable from "@/components/QuestionMatchingTable.vue";

interface Props {
  questionIndex: number;
  post?: boolean;
}
const props = defineProps<Props>();
const store = props.post ? usePostMatchingStore() : usePreMatchingStore();

const { statement, cases } = store.getQuestion(props.questionIndex)
const reply = computed(() => store.getReply(props.questionIndex));

function updateReply(reply: MatchingCaseReply[]) {
  store.doQuestion(props.questionIndex, reply);
}
</script>
