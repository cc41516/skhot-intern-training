<template>
  <div class="column items-center">
    <div class="text-center text-h4 q-my-xl">
      新光職能治療副木課程整合式線上學習平台<br/>
      後台管理系統
    </div>
    <div v-if="!isAdmin" class="row">
      <q-input outlined v-model="password" label="請輸入密碼" type="password" @keyup.enter="confirm" />
      <q-btn label="確認" @click="confirm" class="q-mx-md" />
    </div>
    <div v-if="isAdmin">
      <q-table :rows="users" :columns="columns" row-key="name" flat>
        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <q-btn flat :label="props.value" no-caps @click="intoUser(props.row.id)" size="md" color="secondary" />
          </q-td>
        </template>
        <template v-slot:body-cell-delete="props">
          <q-td :props="props">
            <q-btn flat label="刪除紀錄" @click="onDeleting(props.row.id)" size="md" color="negative" />
          </q-td>
      </template>

      </q-table>
    </div>
    <q-btn label="清除所有使用者" @click="myDeleteAllUsers" color="negative" />

    <q-dialog v-model="deleteUserPrompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div>注意：一旦刪除資料，便無法再復原。</div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="取消" color="secondary" v-close-popup />
          <q-btn flat label="確定" color="negative" v-close-popup @click="myDeleteUser(toBeDeletedId)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router";
import {
  getAllUsers,
  deleteUser,
  deleteAllUsers,
} from "../server/controller.ts";
import { QTableColumn } from 'quasar'
import { usePreChoiceStore, usePostChoiceStore } from "@/store/choice";
import { useVideoStore } from "@/store/video";
import { usePreMatchingStore, usePostMatchingStore } from "@/store/matching";
import { hash } from "@/utils/common.ts"
import { User } from "@/server/controller.ts"

const router = useRouter();

const password = ref('')
const isAdmin = ref(false)
const deleteUserPrompt = ref(false)
const toBeDeletedId = ref('')

let users: User[] = reactive([])
const bodyStyle: string = 'font-size: 14px' 
const headerStyle: string = 'font-size: 16px' 
let columns: QTableColumn[] = [
  {name: 'name', label: '姓名', align: 'center', field: 'name'},
  {name: 'graduateYear', label: '畢業學年度', field: 'graduateYear', sortable: true},
  {name: 'order', label: '梯次', field: 'order', sortable: true},
  {name: 'preChoiceScore', label: '前測（選擇題）', field: 'preChoiceScore', sortable: true},
  {name: 'postChoiceScore', label: '前測（配合題）', field: 'postChoiceScore', sortable: true},
  {name: 'videoScore', label: '影片題組', field: 'videoScore', sortable: true},
  {name: 'preMatchingScore', label: '後測（選擇題）', field: 'preMatchingScore', sortable: true},
  {name: 'postMatchingScore', label: '後測（配合題）', field: 'postMatchingScore', sortable: true},
  {name: 'delete', label: '', field: 'name'}
]
columns = columns.map(c => {
  return {...c, style: bodyStyle, headerStyle: headerStyle}
})

onMounted(() => {
  const admin = sessionStorage.getItem('admin')
  if (admin === 'true') {
    isAdmin.value = true
    getData()
  }
})

async function confirm() {
  const hashed = await hash(password.value)
  if (hashed === '3047f3a934444a243ccc5ffd525889cec829954435f82992a0d6f9153763c798') {
    isAdmin.value = true
    sessionStorage.setItem('admin', 'true')
    getData()
  }
}

async function getData() {
  try {
    const res = await getAllUsers() ?? []
    users.length = res.length
    res.forEach((val, index) => {
      users[index] = val
    })
  } catch (error) {
    console.log(error)
  }
}

function intoUser(id: string) {
  localStorage.setItem('id', id)
  router.push({name: 'home'})
}

function onDeleting(id: string) {
  toBeDeletedId.value = id
  deleteUserPrompt.value = true
}

async function myDeleteUser(id: string) {
  await deleteUser(id);
  await getData()
  if (id === localStorage.getItem('id')) {
    clear()
  }
  toBeDeletedId.value = ''
}

async function myDeleteAllUsers() {
  await deleteAllUsers();
  await getData()
  clear()
}

function clear() {
  localStorage.clear();
  usePreChoiceStore().reset();
  usePostChoiceStore().reset();
  useVideoStore().reset();
  usePreMatchingStore().reset();
  usePostMatchingStore().reset();
}


</script>


<style scoped>
th td {
  font-size: 20px;
  color: blueviolet;
}
</style>