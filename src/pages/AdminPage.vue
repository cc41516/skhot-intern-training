<template>
  <div class="column items-center">
    <div class="text-center text-h4 q-my-xl">
      新光職能治療副木課程整合式線上學習平台<br/>
      後台管理系統
    </div>
    <div v-if="!isAdmin" class="row">
      <q-input outlined v-model="password" label="請輸入密碼" type="password" />
      <q-btn label="確認" @click="confirm" />
    </div>
    <div v-if="isAdmin">
      <q-table :rows="users" :columns="columns" row-key="name" flat>
        <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <q-btn unelevated :label="props.value" no-caps @click="intoUser(props.row.id)" size="md" />
        </q-td>
      </template>
      </q-table>
    </div>
    <q-btn label="清除使用者" @click="myDeleteUser" />
    <q-btn label="清除所有使用者" @click="myDeleteAllUsers" />
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
import { usePreChoiceStore } from "@/store/choice";
import { hash } from "@/utils/common.ts"
import { User } from "@/server/controller.ts"

const router = useRouter();

const password = ref('')
const isAdmin = ref(false)

let users: User[] = reactive([])
const bodyStyle: string = 'font-size: 12px' 
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

</script>


<style scoped>
th td {
  font-size: 20px;
  color: blueviolet;
}
</style>