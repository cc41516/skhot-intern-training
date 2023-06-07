<template>
  <div class="column items-center">
    <div class="text-h4 q-my-xl">新光職能治療副木課程整合式線上學習平台</div>
    <div>嗨，{{ name }}。請依序完成「前測」、「影片題組」以及「後測」。</div>
    <div class="q-my-lg" />
    <q-btn unelevated label="前測" @click="startTest" class="text-h5" />
    <q-btn unelevated label="影片題組" @click="startMidTest" class="text-h5" />
    <q-btn unelevated label="後測" @click="startPostTest" class="text-h5" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getUser } from "@/server/controller";

const router = useRouter();
const name = ref('')

onMounted(async () => {
  const id = localStorage.getItem('id')
  if (id !== null) {
    try {
      const user = await getUser(id)
      name.value = user?.name ?? ''
    } catch (error) {
      console.log(error)
    }
  }
})

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
