<template>
  <q-expansion-item
    v-for="(errNum, i) in errRecord"
    :key="i"
    expand-separator
    :content-inset-level="0.5"
    :label="`Question ${errNum + 1} : ${errQuestions[i].statement}`"
    header-class="text-h6"
  >
    <q-list v-for="(option, index) in errQuestions[i].options">
      <AnswerOptionItem
        :index="index"
        :option="option"
        :answer="errQuestions[i].answer"
        :reply="errReply[i]"
      />
    </q-list>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";
import { range } from "@/utils/common";
import AnswerOptionItem from "@/components/AnswerOptionItem.vue";

interface Props {
  post?: boolean;
}
const props = defineProps<Props>();
const store = props.post ? usePostChoiceStore() : usePreChoiceStore();
const errRecord: number[] = range(store.questionCount).filter(
  (q) => !store.isCorrect(q)
);
const errQuestions = errRecord.map((n) => store.getQuestion(n));
const errReply = errRecord.map((n) => store.getReply(n));
</script>

<style scoped lang="scss">
.q-item:hover {
  background-color: $grey-10;
}
</style>
