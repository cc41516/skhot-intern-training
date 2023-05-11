<template>
  <div>
    <div v-if="questionIndex === 0">
      <QuestionStatement content="請看完下列影片，再回答後續問題。" />
      <q-video :src="video" :ratio="16/9"/>
    </div>
    <div v-else>
    <QuestionStatement :content="statement" />
    <ChoiceOptions :options="options" :reply="reply" @select="updateReply" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useVideoStore } from "@/store/video";
import QuestionStatement from "@/components/QuestionStatement.vue";
import ChoiceOptions from "@/components/ChoiceOptions.vue";

interface Props {
  groupIndex: number;
  questionIndex: number;
}
const props = defineProps<Props>();
const store = useVideoStore();

const { video } = store.getGroup(props.groupIndex);
const { statement, options } = store.getQuestion(
  props.groupIndex,
  props.questionIndex
);

const reply = computed(() =>
  store.getReply(props.groupIndex, props.questionIndex)
);

function updateReply(reply: number) {
  store.doQuestion(props.groupIndex, props.questionIndex, reply);
}
</script>
