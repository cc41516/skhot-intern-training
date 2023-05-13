<template>
  <div>
    <div>Answer</div>
    <q-btn flat label="Home" to="/home" />
    <div v-if="testPhase === TestPhase.Pre">
        <ChoiceAnswer />
    </div>
    <div v-if="testPhase === TestPhase.Mid">
        <VideoAnswer />
    </div>
  </div>
</template>

<script setup lang="ts">
import { TestPhase } from "@/global";
import ChoiceAnswer from "@/containers/ChoiceAnswer.vue";
import VideoAnswer from "@/containers/VideoAnswer.vue";

interface Props {
  testPhase: TestPhase;
}

defineProps<Props>();
</script>
