<template>
  <PageWrapper>
    <div class="row justify-between">
      <!-- questionIndex is -1 means watching video page -->
      <ProgressChip
        v-if="questionIndex === -1"
        :label="`Video ${groupIndex + 1}`"
      />
      <ProgressChip v-else :label="`Question ${questionIndex + 1}`" />
      <q-btn flat label="Back" @click="toPhase" />
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
import router from "@/router/index.ts";

interface Props {
  testPhase: TestPhase;
  questionType: QuestionType;
  questionIndex: number;
  groupIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  groupIndex: 0,
});

function toPhase() {
  let phaseName: string;
  if (props.testPhase === TestPhase.Pre) {
    phaseName = "preTest";
  } else if (props.testPhase === TestPhase.Mid) {
    phaseName = "midTest";
  } else {
    phaseName = "postTest";
  }

  router.push({ name: phaseName });
}
</script>
