<template>
  <PageWrapper>
    <div class="column items-center">
      <div class="text-center text-h4 q-my-xl">
        新光職能治療副木課程整合式線上學習平台<br />
        後台管理系統
      </div>
      <div v-if="!isAdmin" class="row">
        <q-input
          outlined
          v-model="password"
          label="請輸入密碼"
          type="password"
          @keyup.enter="confirm"
        />
        <q-btn flat label="確認" @click="confirm" class="q-mx-md" />
      </div>
      <div v-if="isAdmin">
        <q-table :rows="users" :columns="columns" row-key="name" flat>
          <template v-slot:body-cell-name="props">
            <q-td :props="props">
              <q-btn
                flat
                :label="props.value"
                no-caps
                @click="intoUser(props.row.id)"
                size="md"
                color="secondary"
              />
            </q-td>
          </template>
          <template v-slot:body-cell-feedbacks="props">
            <q-td :props="props">
              <div v-if="props.value.length === 0"> - </div>
              <div v-else>
                <q-btn
                flat
                  :label="`${props.value.length} 則`"
                  @click="onShowingFeedback(props.value)"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-delete="props">
            <q-td :props="props">
              <q-btn
                flat
                label="刪除紀錄"
                @click="onDeletingUser(props.row.id)"
                size="md"
                color="negative"
              />
            </q-td>
          </template>
        </q-table>
      </div>

      <q-dialog v-model="deleteUserPrompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div>注意：一旦刪除資料，便無法再復原。</div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="取消" color="secondary" v-close-popup />
            <q-btn
              flat
              label="確定"
              color="negative"
              v-close-popup
              @click="myDeleteUser(toBeDeletedId)"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="showFeedbacksPrompt">
        <q-card class="q-pa-md">
          <q-list separator>
            <q-item v-for="(feedback, index) in toBeShowedFeedbacks" :key="index">
              {{ feedback }}
            </q-item>
          </q-list>
        </q-card>
      </q-dialog>
    </div>
  </PageWrapper>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllUsers, deleteUser } from "../server/controller.ts";
import { QTableColumn } from "quasar";
import PageWrapper from "@/containers/PageWrapper.vue";
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";
import { useVideoStore } from "@/store/video";
import { usePreMatchingStore, usePostMatchingStore } from "@/store/matching";
import { hash } from "@/utils/common.ts";
import { User } from "@/server/controller.ts";

interface FinalScoredUser extends User {
  preScore?: number;
  midScore?: number;
  postScore?: number;
}

const router = useRouter();

const preChoiceStore = usePreChoiceStore();
const postChoiceStore = usePostChoiceStore();
const videoStore = useVideoStore();
const preMatchingStore = usePreMatchingStore();
const postMatchingStore = usePostMatchingStore();

const password = ref("");
const isAdmin = ref(false);
const deleteUserPrompt = ref(false);
const toBeDeletedId = ref("");
const showFeedbacksPrompt = ref(false);
const toBeShowedFeedbacks = ref(Array<string>());

let users: FinalScoredUser[] = reactive([]);
const bodyStyle: string = "font-size: 14px";
const headerStyle: string = "font-size: 16px";
let columns: QTableColumn[] = [
  { name: "name", label: "姓名", field: "name" },
  {
    name: "internYear",
    label: "畢業學年度",
    field: "internYear",
    sortable: true,
  },
  { name: "order", label: "梯次", field: "order", sortable: true },
  {
    name: "preScore",
    label: `前測（${
      preChoiceStore.questionCount + preMatchingStore.allCaseCount
    }分）`,
    field: "preScore",
    sortable: true,
  },
  {
    name: "midScore",
    label: `影片題組（${videoStore.allQuestionCount}分）`,
    field: "midScore",
    sortable: true,
  },
  {
    name: "postScore",
    label: `後測（${
      postChoiceStore.questionCount + postMatchingStore.allCaseCount
    }分）`,
    field: "postScore",
    sortable: true,
  },
  {
    name: "feedbacks",
    label: `意見回饋`,
    field: "feedbacks",
  },
  { name: "delete", label: "", field: "name" },
];
columns = columns.map((c) => {
  return { ...c, align: 'center', style: bodyStyle, headerStyle: headerStyle };
});

onMounted(() => {
  clear();
  const admin = sessionStorage.getItem("admin");
  if (admin === "true") {
    isAdmin.value = true;
    getData();
  }
});

async function confirm() {
  const hashed = await hash(password.value);
  if (
    hashed ===
    "3047f3a934444a243ccc5ffd525889cec829954435f82992a0d6f9153763c798"
  ) {
    isAdmin.value = true;
    sessionStorage.setItem("admin", "true");
    getData();
  }
}

async function getData() {
  try {
    const res = (await getAllUsers()) ?? [];
    users.length = res.length;
    res.forEach((val, index) => {
      users[index] = val;
      users[index].preScore = val.preChoiceScore! + val.preMatchingScore!;
      users[index].midScore = val.videoScore!;
      users[index].postScore = val.postChoiceScore! + val.postMatchingScore!;
    });
  } catch (error) {
    console.log(error);
  }
}

function intoUser(id: string) {
  localStorage.setItem("id", id);
  router.push({ name: "home" });
}

function onDeletingUser(id: string) {
  toBeDeletedId.value = id;
  deleteUserPrompt.value = true;
}

function onShowingFeedback(feedbacks: string[]) {
  toBeShowedFeedbacks.value = feedbacks;
  showFeedbacksPrompt.value = true;
}

async function myDeleteUser(id: string) {
  await deleteUser(id);
  await getData();
  if (id === localStorage.getItem("id")) {
    clear();
  }
  toBeDeletedId.value = "";
}

function clear() {
  localStorage.clear();
  preChoiceStore.reset();
  postChoiceStore.reset();
  videoStore.reset();
  preMatchingStore.reset();
  postMatchingStore.reset();
}
</script>

<style scoped>
th td {
  font-size: 20px;
  color: blueviolet;
}
</style>
