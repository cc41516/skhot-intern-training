<template>
  <div>
    <q-expansion-item
        v-for="(errNum, i) in errRecord"
        :key="i"
        expand-separator
        :label="`Question ${errNum + 1} : ${errQuestions[i].statement}`"
      >
        <q-card>
          <q-card-section v-for="(option, index) in errQuestions[i].options">
            {{ option }}
            <q-icon v-if="index === errQuestions[i].answer" name="check" size="md" color="positive" />
            <q-icon v-else-if="index === errReply[i]" name="close" size="md" color="negative" />
          </q-card-section>
        </q-card>
      </q-expansion-item>
  </div>
</template>

<script setup lang="ts">
import { useChoiceStore } from "@/store/choice";
import { range } from "@/utils/common";

const store = useChoiceStore();
const errRecord: number[] = range(store.questionCount).filter(q => !store.isCorrect(q))
const errQuestions = errRecord.map(n => store.getQuestion(n))
const errReply = errRecord.map(n => store.getReply(n))

</script>
