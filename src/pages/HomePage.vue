<template>
  <div class="column items-center">
    <div class="row text-h3 q-my-xl">
      新光職能治療副木課程整合式線上學習平台
    </div>
    <q-input outlined v-model="name" label="請輸入姓名" />
    <div class="q-my-lg" />
    <q-btn label="確認" @click="myCreateUser" />
    <q-btn label="所有使用者" @click="myGetAllUsers" />
    <q-btn label="使用者" @click="myGetUser" />
    <q-btn label="刪除使用者" @click="myDeleteUser" />
    <q-btn label="刪除所有使用者" @click="myDeleteAllUsers" />
    <q-btn label="更新使用者" @click="myUpdateUser" />
    <q-btn unelevated label="前測" @click="startTest" class="text-h5" />
    <q-btn unelevated label="影片題組" @click="startMidTest" class="text-h5" />
    <q-btn unelevated label="後測" @click="startPostTest" class="text-h5" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} from "../server/controller.ts";
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";

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

async function myCreateUser() {
  let id = await createUser(name.value);
  if (id !== null) {
    localStorage.setItem("id", id);
    console.log(`Successfully created a new user ${name.value}.`);
  } else {
    console.log("Failed to create a new user.");
  }
}

async function myGetAllUsers() {
  let users = await getAllUsers();
  console.log(users?.map(u => u.name));
}

async function myGetUser() {
  let id = localStorage.getItem("id");
  if (id !== null) {
    let user = await getUser(id);
    console.log(user);
  }
}

async function myDeleteUser() {
  let id = localStorage.getItem("id");
  if (id !== null) {
    deleteUser(id);
    usePreChoiceStore().reset()
    localStorage.clear()
  }
}

async function myDeleteAllUsers() {
  await deleteAllUsers();
}

async function myUpdateUser() {
  let id = localStorage.getItem("id");
  if (id !== null) {
    updateUser(id, {
      preChoice: [1, 2, 3],
    });
  }
}
</script>
