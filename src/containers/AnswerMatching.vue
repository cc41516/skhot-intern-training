<template>
  <q-expansion-item
    v-for="(errNum, i) in errRecord"
    :key="i"
    expand-separator
    :content-inset-level="0.5"
    :label="`配合題 ${errNum + 1} : ${errQuestions[i].statement}`"
    header-class="text-h6"
  >
    <div class="text-subtitle1">你的答案</div>
    <AnswerMatchingTable :question="errQuestions[i]" :reply="errReplies[i]" />

    <div class="text-subtitle1">正確解答</div>
    <AnswerMatchingTable :question="errQuestions[i]" :reply="ansReplies[i]" />
  </q-expansion-item>
</template>

<script setup lang="ts">
import {
  usePreMatchingStore,
  usePostMatchingStore,
  MatchingQuestion,
  MatchingCaseReply,
} from "@/store/matching";
import { range } from "@/utils/common";
import AnswerMatchingTable from "@/components/AnswerMatchingTable.vue";

interface Props {
  post?: boolean;
}
const props = defineProps<Props>();
const store = props.post ? usePostMatchingStore() : usePreMatchingStore();

const errRecord: number[] = range(store.questionCount).filter(
  (q) => !store.isCorrect(q)
);
const errQuestions: MatchingQuestion[] = errRecord.map((n) =>
  store.getQuestion(n)
);
const errReplies: MatchingCaseReply[][] = errRecord.map((n) =>
  store.getReply(n)
);
const ansReplies: MatchingCaseReply[][] = errRecord.map((n) =>
  store.getAnswer(n)
);

</script>
