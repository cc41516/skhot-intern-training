<template>
  <div>
    <QuestionStatement :content="statement" />
    <q-video v-if="questionIndex === -1" :src="video" :ratio="16 / 9" />
    <QuestionChoiceOptions
      v-else
      :options="options"
      :reply="reply"
      :answer="answer"
      :isSubmitted="isSubmitted"
      @select="updateReply"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useVideoStore } from "@/store/video";
import QuestionStatement from "@/components/QuestionStatement.vue";
import QuestionChoiceOptions from "@/components/QuestionChoiceOptions.vue";

interface Props {
  groupIndex: number;
  questionIndex: number;
}
const props = defineProps<Props>();
const store = useVideoStore();

const { video } = store.getGroup(props.groupIndex);
let statement: string = "請看完下列影片，再回答後續問題。"; // watching video
let options: string[] = [];
const answer: number = store.getAnswer(props.groupIndex, props.questionIndex);
const isSubmitted = computed(() => store.isSubmitted(props.groupIndex));

if (props.questionIndex >= 0) {
  // questions
  ({ statement, options } = store.getQuestion(
    props.groupIndex,
    props.questionIndex
  ));
}

const reply = computed(() =>
  store.getReply(props.groupIndex, props.questionIndex)
);

function updateReply(reply: number) {
  store.doQuestion(props.groupIndex, props.questionIndex, reply);
}
</script>
