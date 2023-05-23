<template>
  <PageWrapper>
    <div class="row justify-between items-center">
      <div class="text-h2 q-py-lg">解答</div>
      <div><q-btn flat label="Home" to="/home" /></div>
    </div>

    <div v-if="testPhase === TestPhase.Pre">
      <AnswerScore :content="`選擇題得分：${preChoiceStore.score} / ${preChoiceStore.questionCount}`" />
    </div>
    <div v-else-if="testPhase === TestPhase.Post">
      <AnswerScore :content="`選擇題得分：${postChoiceStore.score} / ${postChoiceStore.questionCount}`" />
    </div>
        
    <div class="text-h5 text-bold">以下為錯誤題目：</div>

    <div v-if="testPhase === TestPhase.Pre">
      <AnswerChoice />
      <AnswerMatching />
    </div>
    <div v-if="testPhase === TestPhase.Mid">
      <AnswerVideo />
    </div>
    <div v-if="testPhase === TestPhase.Post">
      <AnswerChoice post />
      <AnswerMatching post />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { TestPhase } from "@/global";
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";
import AnswerChoice from "@/containers/AnswerChoice.vue";
import AnswerVideo from "@/containers/AnswerVideo.vue";
import AnswerMatching from "@/containers/AnswerMatching.vue";
import AnswerScore from "@/components/AnswerScore.vue";
import PageWrapper from "@/containers/PageWrapper.vue";

interface Props {
  testPhase: TestPhase;
}
defineProps<Props>();

const preChoiceStore = usePreChoiceStore();
const postChoiceStore = usePostChoiceStore();
</script>
