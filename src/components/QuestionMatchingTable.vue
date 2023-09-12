<template>
  <div>
    <q-markup-table separator="cell" flat bordered class="q-mb-lg">
      <thead>
        <tr class="row">
          <th class="text-center col-3"><div class="text-h6">圖片</div></th>
          <th class="text-center col-2"><div class="text-h6">名稱</div></th>
          <th class="text-center col-4"><div class="text-h6">情境描述</div></th>
          <th class="text-center col-3"><div class="text-h6">適應症</div></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(caseReply, index) in currReply" :key="index" class="row">
          <td class="col-3 text-center">
            <img :src="images[index]" class="full-width" />
          </td>
          <draggable
            v-if="!isSubmitted"
            :list="caseReply.name"
            group="name"
            tag="td"
            :component-data="{
              className: 'col-2 column items-start scroll hide-scrollbar',
            }"
            @change="updateReply"
            v-bind="dragContainerOptions"
          >
            <template #item="{ element }">
              <MatchingChip :label="element" />
            </template>
          </draggable>
          <AnswerMatchingTd
            v-else
            :reply="caseReply.name"
            :answer="cases[index].name"
            class="col-2 column items-start scroll hide-scrollbar"
          />

          <draggable
            v-if="!isSubmitted"
            :list="caseReply.scenario"
            group="scenario"
            tag="td"
            :component-data="{
              className: 'col-4 column items-start scroll hide-scrollbar',
            }"
            @change="updateReply"
            v-bind="dragContainerOptions"
          >
            <template #item="{ element }">
              <MatchingChip :label="element" />
            </template>
          </draggable>
          <AnswerMatchingTd
            v-else
            :reply="caseReply.scenario"
            :answer="cases[index].scenario"
            class="col-4 column items-start scroll hide-scrollbar"
          />

          <draggable
            v-if="!isSubmitted"
            :list="caseReply.indication"
            group="indication"
            tag="td"
            :component-data="{
              className: 'col-3 column items-start scroll hide-scrollbar',
            }"
            @change="updateReply"
            v-bind="dragContainerOptions"
          >
            <template #item="{ element }">
              <MatchingChip :label="element" />
            </template>
          </draggable>
          <AnswerMatchingTd
            v-else
            :reply="caseReply.indication"
            :answer="cases[index].indication"
            class="col-3 column items-start scroll hide-scrollbar"
          />
        </tr>
      </tbody>
    </q-markup-table>

    <div class="row items-center">
      <div class="col-1 text-h6">名稱</div>
        <draggable
        :list="remainingNames"
        group="name"
        v-bind="dragContainerOptions"
        class="row col-11 q-my-lg"
        >
        <template #item="{ element }">
          <MatchingChip
          :label="element"
          :isSubmitted="isSubmitted"
          :color="isSubmitted ? 'red' : ''"
          />
        </template>
      </draggable>


      <div class="col-1 text-h6">情境描述</div>
      <draggable
        :list="remainingScenarios"
        group="scenario"
        v-bind="dragContainerOptions"
        class="row col-11 q-my-lg"
      >
        <template #item="{ element }">
          <MatchingChip
            :label="element"
            :isSubmitted="isSubmitted"
            :color="isSubmitted ? 'red' : ''"
          />
        </template>
      </draggable>

      <div class="col-1 text-h6">適應症</div>
      <draggable
        :list="remainingIndications"
        group="indication"
        v-bind="dragContainerOptions"
        class="row col-11 q-my-lg"
      >
        <template #item="{ element }">
          <MatchingChip
            :label="element"
            :isSubmitted="isSubmitted"
            :color="isSubmitted ? 'red' : ''"
          />
        </template>
      </draggable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef } from "vue";
import draggable from "vuedraggable";
import { MatchingCase, MatchingCaseReply } from "@/store/matching";
import AnswerMatchingTd from "./AnswerMatchingTd.vue";
import MatchingChip from "./MatchingChip.vue";
import { shuffle, getImageUrl } from "@/utils/common.ts";

interface Props {
  cases: MatchingCase[];
  reply: MatchingCaseReply[];
  isSubmitted: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "select", reply: MatchingCaseReply[]): void;
}>();
// currReply will fetch the reply from database at the beginning,
// and we can manipulate currReply to render the page, and when it changes, emit an event to update MatchingStore
const currReply = toRef(props, "reply");

const _allNames: string[] = getItems(props.cases, "name");
const _allIndications: string[] = getItems(props.cases, "indication");
const _allScenarios: string[] = getItems(props.cases, "scenario");
shuffle(_allNames);
shuffle(_allIndications);
shuffle(_allScenarios);
const _allReplyNames = computed(() => getItems(currReply.value, "name"));
const _allReplyIndications = computed(() =>
  getItems(currReply.value, "indication")
);
const _allReplyScenarios = computed(() =>
  getItems(currReply.value, "scenario")
);

const images: string[] = props.cases.map((c) => getImageUrl(c.image));
const remainingNames = computed(() =>
  _allNames.filter((item) => !_allReplyNames.value.includes(item))
);
const remainingIndications = computed(() =>
  _allIndications.filter((item) => !_allReplyIndications.value.includes(item))
);
const remainingScenarios = computed(() =>
  _allScenarios.filter((item) => !_allReplyScenarios.value.includes(item))
);

// draggable configurations
const dragContainerOptions = {
  itemKey: "",
  sort: false,
  ghostClass: "ghost",
  chosenClass: "chosen",
  animation: 200,
  forceFallback: true,
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
  emit("select", currReply.value);
}
</script>

<style scoped lang="scss">
.q-table tbody td:before {
  background: none;
}

.q-table tbody td {
  white-space: wrap;
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
