<template>
  <PageWrapper>
    <div class="text-h2 q-py-lg">前測</div>
    <div class="text-h5 text-bold">請依序完成下列題目：</div>

    <q-list class="shadow-up-1">
      <ProgressOverviewItem
        v-for="(status, index) in choiceDoneStatus"
        :key="index"
        @click="enterChoice(index)"
        icon="radio_button_checked"
        :label="`選擇題 ${index + 1}`"
        :isDone="status"
      />

      <ProgressOverviewItem
        v-for="(status, index) in matchingDoneStatus"
        :key="index"
        @click="enterMatching(index)"
        icon="swap_horiz"
        :label="`配合題 ${index + 1}`"
        :isDone="status"
        :iconProps="{ size: 'lg' }"
      />
    </q-list>

    <div class="float-right">
      <q-btn
        label="提交"
        :color="canSubmit ? 'secondary' : 'negative'"
        @click="enterAnswer"
        class="q-py-sm"
      />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useChoiceStore } from "@/store/choice";
import { useMatchingStore } from "@/store/matching";
import { range } from "@/utils/common";
import PageWrapper from "@/containers/PageWrapper.vue";
import ProgressOverviewItem from "@/components/ProgressOverviewItem.vue";

const router = useRouter();
const choiceStore = useChoiceStore();
const choiceDoneStatus: boolean[] = range(choiceStore.questionCount).map((q) =>
  choiceStore.isDone(q)
);
const matchingStore = useMatchingStore();
const matchingDoneStatus: boolean[] = range(matchingStore.questionCount).map(
  (q) => matchingStore.isDone(q)
);
const canSubmit: boolean = choiceStore.isAllDone && matchingStore.isAllDone;

function enterChoice(index: number) {
  router.push({
    name: "preTestChoice",
    params: {
      questionIndex: index + 1,
    },
  });
}

function enterMatching(index: number) {
  router.push({
    name: "preTestMatching",
    params: {
      questionIndex: index + 1,
    },
  });
}

function enterAnswer() {
  router.push({
    name: "preTestAnswer",
  });
}
</script>
