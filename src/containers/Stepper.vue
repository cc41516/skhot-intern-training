<template>
  <div class="row justify-end q-gutter-x-md">
    <q-btn
      v-if="
        questionIndex > 0 ||
        (questionIndex == 0 && questionType == QuestionType.Video)
      "
      flat
      color="secondary"
      @click="previous"
    >
      上一題
    </q-btn>
    <q-btn
      v-if="questionIndex < questionCount - 1"
      unelevated
      color="secondary"
      @click="next"
    >
      下一題
    </q-btn>
    <q-btn
      v-if="questionIndex === questionCount - 1"
      unelevated
      color="secondary"
      @click="done"
    >
      完成
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { parseRoute, getQuestionCount } from "@/utils/common";
import { QuestionType, TestPhase } from "@/global";
import router from "@/router";
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";
import { useVideoStore } from "@/store/video";
import { usePreMatchingStore, usePostMatchingStore } from "@/store/matching";

const { testPhase, questionType, questionIndex, groupIndex } = parseRoute();
const questionCount = getQuestionCount(questionType, groupIndex);
let phaseName: string = "";
let typeName: string = "";

switch (testPhase) {
  case TestPhase.Pre:
    phaseName = "preTest";
    break;
  case TestPhase.Mid:
    phaseName = "midTest";
    break;
  case TestPhase.Post:
    phaseName = "postTest";
    break;
}

switch (questionType) {
  case QuestionType.Choice:
    typeName = "Choice";
    break;
  case QuestionType.Matching:
    typeName = "Matching";
    break;
  case QuestionType.Video:
    typeName = "Video";
    break;
}

// Notice that store index is less than url index by 1
function previous() {
  router.push({
    name: phaseName + typeName,
    params: {
      questionIndex: questionIndex,
      groupIndex: groupIndex + 1,
    },
  });
}

function next() {
  router.push({
    name: phaseName + typeName,
    params: {
      questionIndex: questionIndex + 2,
      groupIndex: groupIndex + 1,
    },
  });
}

function done() {
  switch (testPhase) {
    case TestPhase.Pre:
      if (questionType === QuestionType.Choice) {
        usePreChoiceStore().submit();
      }
      if (questionType === QuestionType.Matching) {
        usePreMatchingStore().submit();
      }
      break;
    case TestPhase.Mid:
      if (questionType === QuestionType.Video) {
        useVideoStore().submit(groupIndex);
      }
      break;
    case TestPhase.Post:
      if (questionType === QuestionType.Choice) {
        usePostChoiceStore().submit();
      }
      if (questionType === QuestionType.Matching) {
        usePostMatchingStore().submit();
      }
      break;
  }
  router.push({ name: phaseName });
}
</script>
