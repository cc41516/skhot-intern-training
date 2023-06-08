<template>
  <td :class="class">
    <MatchingChip
      v-for="element in compared"
      :key="element[0]"
      :label="element[0]"
      :isSubmitted="true"
      :color="chipColor(element[1])"
    />
  </td>
</template>

<script setup lang="ts">
import MatchingChip from "./MatchingChip.vue";

interface Props {
  reply: string[];
  answer: string[];
  className?: string
}
type AnswerComparison = [string, "correct" | "wrong" | "missing"];

const props = defineProps<Props>();
const compared: AnswerComparison[] = comparedCaseEntryList(
  props.reply,
  props.answer
);

function comparedCaseEntryList(
  reply: string[],
  answer: string[]
): AnswerComparison[] {
  let compared: AnswerComparison[] = [];

  reply.forEach((val) => {
    if (answer.includes(val)) {
      compared.push([val, "correct"]);
    } else {
      compared.push([val, "wrong"]);
    }
  });

  answer.forEach((val) => {
    if (!reply.includes(val)) {
      compared.push([val, "missing"]);
    }
  });

  return compared;
}

function chipColor(result: "correct" | "wrong" | "missing"): string {
  if (result === "correct") return "green";
  else if (result === "wrong") return "red";
  else return "blue";
}
</script>
