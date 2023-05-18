<template>
  <q-expansion-item
    v-for="(errNums, errG, _index) in errRecord"
    :key="_index"
    expand-separator
    :label="store.getGroup(errG).topic"
    header-class="text-h6"
  >
    <q-expansion-item
      v-for="errNum in errNums"
      :header-inset-level="0.5"
      :content-inset-level="1"
      :label="`Question ${errNum + 1} : ${
        store.getQuestion(errG, errNum).statement
      }`"
      header-class="text-subtitle1"
    >
      <q-list
        v-for="(option, index) in store.getQuestion(errG, errNum).options"
      >
        <AnswerChoiceOption
          :index="index"
          :option="option"
          :answer="store.getQuestion(errG, errNum).answer"
          :reply="store.getReply(errG, errNum)"
        />
      </q-list>
    </q-expansion-item>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { useVideoStore } from "@/store/video";
import AnswerChoiceOption from "@/components/AnswerChoiceOption.vue";

interface Dict<T> {
  [Key: number]: T;
}

const store = useVideoStore();
let errRecord: Dict<number[]> = {};

for (let i = 0; i < store.groupCount; i++) {
  for (let j = 0; j < store.groupQuestionCount(i); j++) {
    if (!store.isCorrect(i, j)) {
      if (i in errRecord) {
        errRecord[i].push(j);
      } else {
        errRecord[i] = [j];
      }
    }
  }
}
</script>

<style scoped lang="scss">
.q-item:hover {
  background-color: $grey-10;
  transition: color 0.3s, background-color 0.3s;
}
</style>
