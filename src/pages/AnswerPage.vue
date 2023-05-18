<template>
  <PageWrapper>
    <div class="row justify-between items-center">
      <div class="text-h2 q-py-lg">解答</div>
      <div><q-btn flat label="Home" to="/home" /></div>
    </div>

    <div class="text-h5 text-bold">以下為錯誤題目：</div>

    <div v-if="testPhase === TestPhase.Pre">
      <ChoiceAnswer />
    </div>
    <div v-if="testPhase === TestPhase.Mid">
      <VideoAnswer />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { TestPhase } from "@/global";
import ChoiceAnswer from "@/containers/ChoiceAnswer.vue";
import VideoAnswer from "@/containers/VideoAnswer.vue";
import PageWrapper from "@/containers/PageWrapper.vue";

interface Props {
  testPhase: TestPhase;
}
defineProps<Props>();
</script>
