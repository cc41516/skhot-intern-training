<template>
  <div class="row justify-center q-pt-xl">
    <div class="col-8 q-gutter-lg">
      <div class="row justify-between">
        <ProgressChip :value="questionIndex + 1" />
        <q-btn flat label="Home" to="/home" />
      </div>
      <div>
        <ChoiceQuestion
          v-if="questionType === QuestionType.Choice"
          :question-index="questionIndex"
        />
        <VideoQuestion
          v-else-if="questionType === QuestionType.Video"
          :group-index="groupIndex"
          :question-index="questionIndex"
        />
        <MatchingQuestion
          v-else-if="questionType === QuestionType.Matching"
          :question-index="questionIndex"
        />
      </div>
      <q-separator />
      <Stepper />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import ProgressChip from "@/components/ProgressChip.vue";
import Stepper from "@/containers/Stepper.vue";

import ChoiceQuestion from "@/containers/ChoiceQuestion.vue";
import VideoQuestion from "@/containers/VideoQuestion.vue";
import MatchingQuestion from "@/containers/MatchingQuestion.vue";

import { QuestionType, TestPhase } from "@/global";
import { getQuestionCount } from "@/utils/common";

interface Props {
  testPhase: TestPhase
  questionType: QuestionType;
  questionIndex: number;
  groupIndex?: number;
}
const props = withDefaults(defineProps<Props>(), {
  groupIndex: 0,
});

</script>
