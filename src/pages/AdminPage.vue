<template>
  <div class="column items-center">
    <div class="text-center text-h4 q-my-xl">
      新光職能治療副木課程整合式線上學習平台<br/>
      後台管理系統
    </div>

    <q-btn label="所有使用者" @click="myGetAllUsers" />
    <q-btn label="使用者" @click="myGetUser" />
    <q-btn label="刪除使用者" @click="myDeleteUser" />
    <q-btn label="刪除所有使用者" @click="myDeleteAllUsers" />
    <q-btn label="更新使用者" @click="myUpdateUser" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  deleteAllUsers,
} from "../server/controller.ts";
import { usePreChoiceStore } from "@/store/choice";

const router = useRouter();

async function myGetAllUsers() {
  let users = await getAllUsers();
  console.log(users?.map((u) => u.name));
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
    usePreChoiceStore().reset();
    localStorage.clear();
  }
}

async function myDeleteAllUsers() {
  await deleteAllUsers();
  usePreChoiceStore().reset();
  localStorage.clear()
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
