<template>
  <div class="column items-center">
    <div class="row text-h3 q-my-xl">OT Training for Intern</div>
    <q-input outlined v-model="name" label="請輸入姓名" />
    <q-btn unelevated label="前測" @click="startTest" />
    <q-btn unelevated label="影片題組" @click="startMidTest" />
    <q-btn unelevated label="後測" @click="startPostTest" />
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
