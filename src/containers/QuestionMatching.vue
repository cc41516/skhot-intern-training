<template>
  <div>
    <QuestionStatement :content="statement" />
    <div v-if="isSubmitted" class="row text-h6 q-pa-md">
      <div class="col-3 text-green">綠色：正確答案</div>
      <div class="col-3 text-red">紅色：錯誤答案</div>
      <div class="col-3 text-blue">藍色：該選而未選</div>
    </div>
    <QuestionMatchingTable
      :cases="cases"
      :reply="reply"
      :isSubmitted="isSubmitted"
      @select="updateReply"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  usePreMatchingStore,
  usePostMatchingStore,
  MatchingCaseReply,
} from "@/store/matching";
import QuestionStatement from "@/components/QuestionStatement.vue";
import QuestionMatchingTable from "@/components/QuestionMatchingTable.vue";

interface Props {
  questionIndex: number;
  post?: boolean;
}
const props = defineProps<Props>();
const store = props.post ? usePostMatchingStore() : usePreMatchingStore();

const isSubmitted = computed(() => store.isSubmitted);
const { statement, cases } = store.getQuestion(props.questionIndex);
const reply = computed(() => store.getReply(props.questionIndex));

function updateReply(reply: MatchingCaseReply[]) {
  store.doQuestion(props.questionIndex, reply);
}
</script>
