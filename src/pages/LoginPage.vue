<template>
  <div class="column items-center">
    <div class="text-h4 q-my-xl">新光職能治療副木課程整合式線上學習平台</div>
    <q-form greedy @submit="submit" class="q-gutter-y-md">
      <div class="row">
        <div>*姓名</div>
        <q-input
          outlined
          v-model="name"
          ref="validName"
          class="full-width"
          :rules="[(val) => !!val.trim() || '必填欄位']"
        />
      </div>
      <div class="row">
        <div>*畢業學年度</div>
        <q-input
          outlined
          v-model="graduateYear"
          ref="validGraduateYear"
          class="full-width"
          :rules="[
            (val) => !!val.trim() || '必填欄位',
            (val) => !isNaN(val) || '請輸入數字',
          ]"
        />
      </div>
      <div class="row">
        <div>*梯次</div>
        <q-select
          outlined
          v-model="order"
          :options="[1, 2, 3]"
          class="full-width"
        />
      </div>
      <div>
        <q-btn
          type="submit"
          color="secondary"
          class="full-width q-py-sm q-mt-lg"
          >確認</q-btn
        >
      </div>
    </q-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createUser } from "../server/controller.ts";

const router = useRouter();

const name = ref("");
const graduateYear = ref("");
const order = ref(1);

async function submit() {
  let id = await createUser(
    name.value,
    Number(graduateYear.value),
    order.value
  );
  if (id !== null) {
    localStorage.setItem("id", id);
    console.log(`Successfully created a new user ${name.value}.`);
  } else {
    console.log("Failed to create a new user.");
  }
  router.push({ name: "home" });
}
</script>
