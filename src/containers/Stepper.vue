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
      @click="toggleDonePrompt()"
    >
      完成
    </q-btn>

    <q-dialog v-model="donePrompt">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-subtitle1">點擊完成之後就會提交這一大題的答案，確定嗎？</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="secondary" v-close-popup />
          <q-btn flat label="確定" color="secondary" v-close-popup @click="done" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
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
const donePrompt = ref(false)

const preChoiceStore = usePreChoiceStore()
const postChoiceStore = usePostChoiceStore()
const videoStore = useVideoStore()
const preMatchingStore = usePreMatchingStore()
const postMatchingStore = usePostMatchingStore()

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
        preChoiceStore.submit();
      }
      if (questionType === QuestionType.Matching) {
        preMatchingStore.submit();
      }
      break;
    case TestPhase.Mid:
      if (questionType === QuestionType.Video) {
        videoStore.submit(groupIndex);
      }
      break;
    case TestPhase.Post:
      if (questionType === QuestionType.Choice) {
        postChoiceStore.submit();
      }
      if (questionType === QuestionType.Matching) {
        postMatchingStore.submit();
      }
      break;
  }
  router.push({ name: phaseName });
}

function toggleDonePrompt() {
  switch (testPhase) {
    case TestPhase.Pre:
      if (questionType === QuestionType.Choice && !preChoiceStore.isSubmitted) {
        donePrompt.value = !donePrompt.value;
      }
      if (questionType === QuestionType.Matching && !preMatchingStore.isSubmitted) {
        donePrompt.value = !donePrompt.value;
      }
      break;
      case TestPhase.Mid:
        if (questionType === QuestionType.Video && !videoStore.isSubmitted(groupIndex)) {
        donePrompt.value = !donePrompt.value;
      }
      break;
    case TestPhase.Post:
    if (questionType === QuestionType.Choice && !postChoiceStore.isSubmitted) {
        donePrompt.value = !donePrompt.value;
      }
      if (questionType === QuestionType.Matching && !postMatchingStore.isSubmitted) {
        donePrompt.value = !donePrompt.value;
      }
      break;
  }
}
</script>
