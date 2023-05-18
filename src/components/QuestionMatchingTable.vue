<template>
  <div>
    <q-markup-table separator="cell" flat bordered class="q-mb-lg">
      <thead>
        <tr class="row">
          <th class="text-center col-3"><div class="text-h6">圖片</div></th>
          <th class="text-center col-3"><div class="text-h6">名稱</div></th>
          <th class="text-center col-6"><div class="text-h6">適應症</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(reply, index) in currReply" :key="index" class="row">
          <td class="col-3 text-center">
            <img :src="images[index]" class="full-width" />
          </td>
          <draggable
            :list="reply.name"
            :group="{
              name: 'name',
              put: checkPutName,
            }"
            tag="td"
            :component-data="{ className: 'col-3 scroll hide-scrollbar' }"
            @change="updateReply"
            v-bind="dragContainerOptions"
          >
            <template #item="{ element }">
              <MatchingChip :label="element" />
            </template>
          </draggable>
          <draggable
            :list="reply.indication"
            group="indication"
            tag="td"
            :component-data="{
              className: 'col-6 column items-start scroll hide-scrollbar',
            }"
            @change="updateReply"
            v-bind="dragContainerOptions"
          >
            <template #item="{ element }">
              <MatchingChip :label="element" />
            </template>
          </draggable>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="row items-center rounded-borders">
      <div class="col-1 text-h6">名稱</div>
      <draggable
        :list="remainingNames"
        group="name"
        v-bind="dragContainerOptions"
        class="col-11 q-my-lg"
      >
        <template #item="{ element }">
          <MatchingChip :label="element" />
        </template>
      </draggable>
      <div class="col-1 text-h6">適應症</div>
      <draggable
        :list="remainingIndications"
        group="indication"
        v-bind="dragContainerOptions"
        class="col-11 q-my-lg"
      >
        <template #item="{ element }">
          <MatchingChip :label="element" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import draggable from "vuedraggable";
import { MatchingCase, MatchingCaseReply } from "@/store/matching";
import MatchingChip from "./MatchingChip.vue";
import { shuffle, getImageUrl } from "@/utils/common.ts";

interface Props {
  cases: MatchingCase[];
  reply: MatchingCaseReply[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "select", reply: MatchingCaseReply[]): void;
}>();

// manipulate currReply to render the page, and when it changes, emit an event to update MatchingStore
const currReply: MatchingCaseReply[] = reactive(props.reply);

const _allNames: string[] = getItems(props.cases, "name");
const _allIndications: string[] = getItems(props.cases, "indication");
shuffle(_allNames);
shuffle(_allIndications);
const _allReplyNames: string[] = getItems(currReply, "name");
const _allReplyIndications: string[] = getItems(currReply, "indication");

const images: string[] = props.cases.map((c) => getImageUrl(c.image));
const remainingNames: string[] = reactive(
  _allNames.filter((item) => !_allReplyNames.includes(item))
);
const remainingIndications: string[] = reactive(
  _allIndications.filter((item) => !_allReplyIndications.includes(item))
);

// draggable configurations
const dragContainerOptions = {
  itemKey: "",
  ghostClass: "ghost",
  chosenClass: "chosen",
  animation: 200,
  onStart: () => (drag.value = true),
  onEnd: () => (drag.value = false),
};

const drag = ref(false);

function checkPutName(to: any, from: any) {
  const sameGroupName = from.options.group.name == to.options.group.name;
  const toEmpty = !to.el.children.length;
  return sameGroupName && toEmpty;
}

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

<style scoped lang="scss">
.q-table tbody td:before {
  background: none;
}

.ghost {
  opacity: 0.5;
}

.chosen {
  border: 2px solid $secondary;
}

.no-move {
  transition: transform 0s;
}
</style>
