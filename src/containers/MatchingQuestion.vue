<template>
  <div>
    <QuestionStatement :content="statement" />
    <MatchingTable :cases="cases" :reply="reply" @select="updateReply" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useMatchingStore, MatchingCaseReply } from "@/store/matching";
import QuestionStatement from "@/components/QuestionStatement.vue";
import MatchingTable from "@/components/MatchingTable.vue";

interface Props {
  questionIndex: number;
}
const props = defineProps<Props>();
const store = useMatchingStore();

const { statement, cases } = store.getQuestion(props.questionIndex)
const reply = computed(() => store.getReply(props.questionIndex));

function updateReply(reply: MatchingCaseReply[]) {
  store.doQuestion(props.questionIndex, reply);
}
</script>
