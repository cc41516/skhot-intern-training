<template>
  <div class="column items-center">
    <div class="row text-h3 q-my-xl">新光職能治療副木課程整合式線上學習平台</div>
    <q-input outlined v-model="name" label="請輸入姓名" />
    <div class="q-my-lg" />
    <q-btn unelevated label="前測" @click="startTest" class="text-h5" />
    <q-btn unelevated label="影片題組" @click="startMidTest" class="text-h5" />
    <q-btn unelevated label="後測" @click="startPostTest" class="text-h5" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");

function startTest() {
  router.push({ name: "preTest" });
}

function startMidTest() {
  router.push({ name: "midTest" });
}

function startPostTest() {
  router.push({ name: "postTest" });
}
</script>
