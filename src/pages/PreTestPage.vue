<template>
    <div>
      <div class="h2">Pre-Test Map</div>
      <div v-for="(status, index) in choiceDoneStatus" :key="index">
        <q-btn @click="enterChoice(index)">
          <div>選擇題 {{ index + 1 }} {{ status }}</div>
        </q-btn>
      </div>
      <div v-for="(status, index) in matchingDoneStatus" :key="index">
        <q-btn @click="enterMatching(index)">
          <div>配合題 {{ index + 1 }} {{ status }}</div>
        </q-btn>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from "vue-router";
  import { useChoiceStore } from "@/store/choice";
  import { useMatchingStore } from "@/store/matching";
  import { range } from "@/utils/common";
  
  const router = useRouter();
  const choiceStore = useChoiceStore();
  const choiceDoneStatus: boolean[] = range(choiceStore.questionCount).map((q) =>
  choiceStore.isDone(q)
  );
  const matchingStore = useMatchingStore();
  const matchingDoneStatus: boolean[] = range(matchingStore.questionCount).map((q) =>
    matchingStore.isDone(q)
  );

  function enterChoice(index: number) {
    router.push({
      name: "preTestChoice",
      params: {
        questionIndex: index + 1,
      },
    });
  }

  function enterMatching(index: number) {
    router.push({
      name: "preTestMatching",
      params: {
        questionIndex: index + 1,
      },
    });
  }
  </script>
  