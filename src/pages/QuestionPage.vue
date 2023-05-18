<template>
  <PageWrapper>
    <div class="row justify-between">
      <!-- questionIndex == -1 means watching video page -->
      <ProgressChip
        v-if="questionIndex === -1"
        :label="`Video ${groupIndex + 1}`"
      />
      <ProgressChip v-else :label="`Question ${questionIndex + 1}`" />
      <q-btn flat label="Home" to="/home" />
    </div>
    <div>
      <QuestionChoice
        v-if="questionType === QuestionType.Choice"
        :question-index="questionIndex"
        :post="testPhase === TestPhase.Post"
      />
      <QuestionVideo
        v-else-if="questionType === QuestionType.Video"
        :group-index="groupIndex"
        :question-index="questionIndex"
      />
      <QuestionMatching
        v-else-if="questionType === QuestionType.Matching"
        :question-index="questionIndex"
        :post="testPhase === TestPhase.Post"
      />
    </div>
    <q-separator />
    <Stepper />
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from "@/containers/PageWrapper.vue";
import Stepper from "@/containers/Stepper.vue";
import QuestionChoice from "@/containers/QuestionChoice.vue";
import QuestionVideo from "@/containers/QuestionVideo.vue";
import QuestionMatching from "@/containers/QuestionMatching.vue";
import ProgressChip from "@/components/ProgressChip.vue";
import { QuestionType, TestPhase } from "@/global";

interface Props {
  testPhase: TestPhase;
  questionType: QuestionType;
  questionIndex: number;
  groupIndex?: number;
}

withDefaults(defineProps<Props>(), {
  groupIndex: 0,
});
</script>
