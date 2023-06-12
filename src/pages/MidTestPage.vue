<template>
  <PageWrapper>
    <div class="row justify-between items-center">
      <div class="text-h2 q-py-lg">影片題組</div>
      <div><q-btn flat label="Home" to="/home" /></div>
    </div>
    <div class="text-h5 text-bold q-py-md">看完影片後，回答題組問題：</div>

    <div v-if="store.isAllSubmitted" class="text-h6 text-secondary">
      得分：{{ `${store.allScore} / ${store.allQuestionCount}` }}
    </div>
    <q-list>
      <q-expansion-item
        v-for="groupIndex in range(store.groupCount)"
        :key="groupIndex"
        headerClass="bg-grey-3"
      >
        <template v-slot:header>
          <q-item-section class="text-h6">
            {{ store.getGroup(groupIndex).topic }}
          </q-item-section>
          <q-item-section side>
            <div v-if="store.isSubmitted(groupIndex)" class="text-green">
              已完成
            </div>
            <div v-else-if="store.isGroupDone(groupIndex)" class="text-orange">
              未提交
            </div>
            <div v-else>未完成</div>
          </q-item-section>
        </template>
        <ProgressOverviewItem
          @click="enterVideo(groupIndex, -1)"
          icon="smart_display"
          label="影片"
          naq
        />
        <ProgressOverviewItem
          v-for="quesIndex in range(store.groupQuestionCount(groupIndex))"
          @click="enterVideo(groupIndex, quesIndex)"
          icon="format_list_bulleted"
          :label="`選擇題 ${quesIndex + 1}`"
          :isDone="store.isDone(groupIndex, quesIndex)"
          :isCorrect="store.isCorrect(groupIndex, quesIndex)"
          :isSubmitted="store.isSubmitted(groupIndex)"
        />
      </q-expansion-item>
    </q-list>

    <div class="float-right">
      <q-btn
        label="繼續"
        :color="allSubmit ? 'secondary' : 'negative'"
        @click="nextPhase"
        class="q-py-sm"
      />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useVideoStore } from "@/store/video";
import { range } from "@/utils/common";
import PageWrapper from "@/containers/PageWrapper.vue";
import ProgressOverviewItem from "@/containers/ProgressOverviewItem.vue";

const router = useRouter();
const store = useVideoStore();
const allSubmit = computed(() => store.isAllSubmitted);

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

function nextPhase() {
  if (allSubmit.value) {
    router.push({
      name: "postTest",
    });
  }
}
</script>
