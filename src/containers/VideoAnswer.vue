<template>
  <div>
    <q-expansion-item
      v-for="(errNums, errG, _index) in errRecord"
      :key="_index"
      expand-separator
      :label="store.getGroup(errG).topic"
    >
      <q-expansion-item
        v-for="errNum in errNums"
        :header-inset-level="1"
        :label="`Question ${errNum + 1} : ${store.getQuestion(errG, errNum).statement}`"
      >
        <q-card>
          <q-card-section v-for="(option, index) in store.getQuestion(errG, errNum).options">
            {{ option }}
            <q-icon
              v-if="index === store.getQuestion(errG, errNum).answer"
              name="check"
              size="md"
              color="positive"
            />
            <q-icon
              v-else-if="index === store.getReply(errG, errNum)"
              name="close"
              size="md"
              color="negative"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-expansion-item>
  </div>
</template>

<script setup lang="ts">
import { useVideoStore } from "@/store/video";

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
