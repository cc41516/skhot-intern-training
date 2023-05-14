<template>
  <PageWrapper>
    <div class="text-h2 q-py-lg">中間測驗</div>
    <div class="text-h5 text-bold">看完影片後，回答題組問題：</div>

    <q-list class="shadow-up-1">
      <q-expansion-item
        v-for="(info, groupIndex) in groupsInfo"
        :key="groupIndex"
      >
        <template v-slot:header>
          <q-item-section class="text-h6"> {{ info.topic }} </q-item-section>
          <q-item-section v-if="store.isGroupDone(groupIndex)" side>
            <q-icon name="done" color="secondary" />
          </q-item-section>
          <q-item-section v-else="store.isGroupDone(groupIndex)" side>
            未完成
          </q-item-section>
        </template>
        <ProgressOverviewItem
          @click="enterVideo(groupIndex, -1)"
          icon="smart_display"
          label="影片"
        />
        <ProgressOverviewItem
          v-for="(status, quesIndex) in info.doneStatus"
          @click="enterVideo(groupIndex, quesIndex)"
          icon="radio_button_checked"
          :label="`選擇題 ${quesIndex + 1}`"
          :isDone="status"
        />
      </q-expansion-item>
    </q-list>

    <div class="float-right">
      <q-btn
        label="提交"
        :color="canSubmit ? 'secondary' : 'negative'"
        @click="enterAnswer"
        class="q-py-sm"
      />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useVideoStore } from "@/store/video";
import { range } from "@/utils/common";
import PageWrapper from "@/containers/PageWrapper.vue";
import ProgressOverviewItem from "@/components/ProgressOverviewItem.vue";

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
const canSubmit = store.isAllDone;

function enterVideo(groupIndex: number, questionIndex: number) {
  // if questionIndex == -1, go to watch video
  router.push({
    name: "midTestVideo",
    params: {
      groupIndex: groupIndex + 1,
      questionIndex: questionIndex + 1,
    },
  });
}

function enterAnswer() {
  router.push({
    name: "midTestAnswer",
  });
}
</script>
