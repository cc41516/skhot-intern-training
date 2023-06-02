<template>
  <PageWrapper>
    <div class="row justify-between items-center">
      <div class="text-h2 q-py-lg">{{ post ? "後測" : "前測" }}</div>
      <div><q-btn flat label="Home" to="/home" /></div>
    </div>
    <div class="text-h5 text-bold">請依序完成下列題目：</div>

    <div v-if="choiceStore.isSubmitted" class="text-h6 text-secondary">
      得分：{{ `${choiceStore.score} / ${choiceStore.questionCount}` }}
    </div>
    <q-list class="shadow-up-1">
      <ProgressOverviewItem
        v-for="index in range(choiceStore.questionCount)"
        :key="index"
        @click="enterChoice(index)"
        icon="radio_button_checked"
        :label="`選擇題 ${index + 1}`"
        :isDone="choiceStore.isDone(index)"
        :isCorrect="choiceStore.isCorrect(index)"
        :isSubmitted="choiceStore.isSubmitted"
      />
    </q-list>

    <div v-if="matchingStore.isSubmitted" class="text-h6 text-secondary">
      得分：{{ `${matchingStore.score} / ${matchingStore.questionCount}` }}
    </div>
    <q-list class="shadow-up-1">
      <ProgressOverviewItem
        v-for="index in range(matchingStore.questionCount)"
        :key="index"
        @click="enterMatching(index)"
        icon="swap_horiz"
        :label="`配合題 ${index + 1}`"
        :isDone="matchingStore.isDone(index)"
        :isCorrect="matchingStore.isCorrect(index)"
        :isSubmitted="matchingStore.isSubmitted"
        :iconProps="{ size: 'lg' }"
      />
    </q-list>

    <div class="float-right">
      <q-btn
        label="繼續"
        :color="allSubmit ? 'secondary' : 'negative'"
        @click="nextPhase"
        class="q-py-sm"
      />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";
import { usePreMatchingStore, usePostMatchingStore } from "@/store/matching";
import { range } from "@/utils/common";
import PageWrapper from "@/containers/PageWrapper.vue";
import ProgressOverviewItem from "@/containers/ProgressOverviewItem.vue";

interface Props {
  post?: boolean;
}

const props = defineProps<Props>();
const router = useRouter();
const choiceStore = props.post ? usePostChoiceStore() : usePreChoiceStore();
const matchingStore = props.post
  ? usePostMatchingStore()
  : usePreMatchingStore();
const allSubmit: boolean = choiceStore.isSubmitted && matchingStore.isSubmitted;
console.log(choiceStore.getReply(0));

function enterChoice(index: number) {
  router.push({
    name: props.post ? "postTestChoice" : "preTestChoice",
    params: {
      questionIndex: index + 1,
    },
  });
}

function enterMatching(index: number) {
  router.push({
    name: props.post ? "postTestMatching" : "preTestMatching",
    params: {
      questionIndex: index + 1,
    },
  });
}

function nextPhase() {
  if (allSubmit) {
    router.push({
      name: props.post ? "home" : "midTest",
    });
  }
}
</script>
