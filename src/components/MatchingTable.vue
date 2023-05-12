<template>
  <div>
    <q-markup-table separator="cell" flat bordered class="q-mb-lg">
      <thead>
        <tr>
          <th class="text-center"><div class="text-h5">圖片</div></th>
          <th class="text-center"><div class="text-h5">名稱</div></th>
          <th class="text-center"><div class="text-h5">適應症</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reply, index) in currReply" :key="index">
          <td class="text-center">{{ images[index] }}</td>
          <draggable
            tag="td"
            :list="reply.name"
            group="name"
            item-key=""
            @change="updateReply"
          >
            <template #item="{ element }">
              <q-chip size="lg"> {{ element }} </q-chip>
            </template>
          </draggable>
          <draggable
            tag="td"
            :list="reply.indication"
            group="indication"
            item-key=""
            @change="updateReply"
          >
            <template #item="{ element }">
              <q-chip size="lg"> {{ element }} </q-chip>
            </template>
          </draggable>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="row items-center">
      <div class="col-1 text-h6">名稱</div>
      <draggable
        :list="remainingNames"
        group="name"
        item-key=""
        class="col-11 q-my-lg"
      >
        <template #item="{ element }">
          <q-chip size="lg"> {{ element }} </q-chip>
        </template>
      </draggable>
      <div class="col-1 text-h6">適應症</div>
      <draggable
        :list="remainingIndications"
        group="indication"
        item-key=""
        class="col-11 q-my-lg"
      >
        <template #item="{ element }">
          <q-chip size="lg"> {{ element }} </q-chip>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import draggable from "vuedraggable";
import { MatchingCase, MatchingCaseReply } from "@/store/matching";

interface Props {
  cases: MatchingCase[];
  reply: MatchingCaseReply[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "select", reply: MatchingCaseReply[]): void;
}>();

// manipulate this variable to render the page, and when it changes, emit an event to update MatchingStore
const currReply: MatchingCaseReply[] = reactive(props.reply);

const _allNames: string[] = getItems(props.cases, "name");
const _allIndications: string[] = getItems(props.cases, "indication");
const _allReplyNames: string[] = getItems(currReply, "name");
const _allReplyIndications: string[] = getItems(currReply, "indication");

const images: string[] = props.cases.map((c) => c.image);
const remainingNames: string[] = reactive(
  _allNames.filter((item) => !_allReplyNames.includes(item))
);
const remainingIndications: string[] = reactive(
  _allIndications.filter((item) => !_allReplyIndications.includes(item))
);

function getItems(
  arr: MatchingCase[] | MatchingCaseReply[],
  key: string
): string[] {
  if (arr.length > 0 && key in arr[0]) {
    return arr.map((c) => c[key as keyof (typeof arr)[0]]).flat();
  }
  return [];
}

function updateReply() {
  emit("select", currReply);
}
</script>
