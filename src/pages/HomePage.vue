<template>
  <PageWrapper>
    <div class="text-h4 text-center q-my-xl">
      新光職能治療副木課程整合式線上學習平台
    </div>
    <div class="row justify-between">
      <TestPhaseCard
        title="前測"
        description="4道選擇題・1道配合題"
        :image="getImageUrl('choice.png')"
        class="col-3 cursor-pointer"
        @click="startPreTest"
      />
      <TestPhaseCard
        title="影片題組"
        description="5個選擇題組"
        :image="getImageUrl('video.png')"
        class="col-3 cursor-pointer"
        @click="startMidTest"
        :disabled="!preTestDone"
      />
      <TestPhaseCard
        title="後測"
        description="4道選擇題・1道配合題"
        :image="getImageUrl('choice.png')"
        class="col-3 cursor-pointer"
        @click="startPostTest"
        :disabled="!preTestDone || !midTestDone"
      />
    </div>
    <div v-if="postTestDone">
      <div class="text-h6 text-center q-py-lg">
        恭喜你完成所有的學習測驗了！
      </div>
      <div class="row justify-center q-pa-md">
        <q-input v-model="feedback" label="意見回饋" filled autogrow />
        <q-btn flat label="提交" @click="submitFeedback" class="q-mx-md" />
      </div>
    </div>

    <q-dialog v-model="firstTimeLoginPrompt">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-subtitle1 text-center">
            嗨，{{ name }}。請依序完成「前測」、「影片題組」以及「後測」。
          </div>
        </q-card-section>

        <q-card-section align="right">
          <q-btn flat label="OK" color="secondary" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog>
  </PageWrapper>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { getImageUrl, getPhaseDoneStatus } from "@/utils/common";
import { getUser, User, updateUserFeedback } from "@/server/controller";
import PageWrapper from "@/containers/PageWrapper.vue";
import TestPhaseCard from "@/components/TestPhaseCard.vue";

const router = useRouter();
const $q = useQuasar();

const name = ref("");
const firstTimeLoginPrompt = ref(false);
let user: User | undefined;
const preTestDone = ref(false);
const midTestDone = ref(false);
const postTestDone = ref(false);
const feedback = ref("");

onMounted(async () => {
  const id = localStorage.getItem("id");
  const loggedIn = localStorage.getItem("loggedIn");
  const admin = sessionStorage.getItem("admin");
  if (id !== null) {
    try {
      user = await getUser(id);
      name.value = user?.name ?? "";
      const phaseDone = await getPhaseDoneStatus();
      preTestDone.value = phaseDone.preTestDone;
      midTestDone.value = phaseDone.midTestDone;
      postTestDone.value = phaseDone.postTestDone;
    } catch (error) {
      console.log(error);
    }
  }

  if (loggedIn === null && admin === null) {
    firstTimeLoginPrompt.value = true;
    localStorage.setItem("loggedIn", "true");
  }
});

function startPreTest() {
  router.push({ name: "preTest" });
}

function startMidTest() {
  if (preTestDone.value) {
    router.push({ name: "midTest" });
  }
}

function startPostTest() {
  if (preTestDone.value && midTestDone.value) {
    router.push({ name: "postTest" });
  }
}

async function submitFeedback() {
  const id = localStorage.getItem("id");
  if (id !== null && feedback.value.trim().length > 0) {
    try {
      const succeed = await updateUserFeedback(id, feedback.value);
      if (succeed) {
        feedback.value = "";
        $q.notify({
          position: 'top',
          message: "成功提交回饋",
          color: "secondary",
          timeout: 1000,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
</script>
