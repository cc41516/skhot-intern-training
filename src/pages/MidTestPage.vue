<template>
  <div>
    <div class="h2">Pre-Test Map</div>
    <div v-for="(info, groupIndex) in groupsInfo" :key="info.topic">
      <div>{{ info.topic }}</div>
      <div v-for="(status, quesIndex) in info.doneStatus">
        <q-btn @click="enterVideo(groupIndex, quesIndex)">
          <div>Question {{ quesIndex + 1 }} {{ status }}</div>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useVideoStore } from "@/store/video";
import { range } from "@/utils/common";

interface GroupInfo {
  topic: string;
  doneStatus: boolean[];
}

const router = useRouter();
const store = useVideoStore();
const groupsInfo: GroupInfo[] = range(store.groupCount).map((i) => ({
  topic: store.getGroup(i).topic,
  doneStatus: range(store.groupQuestionCount(i)).map((q) => store.isDone(i, q)),
}));

function enterVideo(groupIndex: number, questionIndex: number) {
  router.push({
    name: "midTestVideo",
    params: {
      groupIndex: groupIndex + 1,
      questionIndex: questionIndex + 1,
    },
  });
}
</script>
