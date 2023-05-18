<template>
  <div class="column q-gutter-y-lg">
    <QuestionChoiceOption
      v-for="(option, index) in options"
      :content="option"
      :index="index"
      :reply="reply"
      @select="updateReply"
    />
  </div>
</template>

<script setup lang="ts">
import QuestionChoiceOption from "@/components/QuestionChoiceOption.vue";

interface Props {
  options: string[];
  reply: number;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "select", reply: number): void;
}>();

function updateReply(reply: number) {
  emit("select", reply);
}
</script>
