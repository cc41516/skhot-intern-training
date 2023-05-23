<template>
  <q-markup-table separator="cell" flat bordered class="q-mb-lg">
    <thead>
      <tr class="row flex-center">
        <th class="col-3"><div class="text-subtitle1">圖片</div></th>
        <th class="col-3"><div class="text-subtitle1">名稱</div></th>
        <th class="col-6"><div class="text-subtitle1">適應症</div></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(caseReply, index) in reply" :key="index" class="row">
        <td class="col-3 text-center">
          <img :src="images[index]" class="full-width" />
        </td>
        <td class="col-3 scroll hide-scrollbar">
          <MatchingChip :label="caseReply.name[0]" />
        </td>
        <td class="col-6 column items-start scroll hide-scrollbar">
          <MatchingChip
            v-for="indication in caseReply.indication"
            :key="indication"
            :label="indication"
          />
        </td>
      </tr>
    </tbody>
  </q-markup-table>
</template>


<script setup lang="ts">
import { MatchingCaseReply, MatchingQuestion } from "@/store/matching";
import { getImageUrl } from "@/utils/common";
import MatchingChip from "@/components/MatchingChip.vue";

interface Props {
  question: MatchingQuestion;
  reply: MatchingCaseReply[];
}
const props = defineProps<Props>();
const images = props.question.cases.map((c) => getImageUrl(c.image));
</script>


<style scoped lang="scss">
.q-table tbody td:before {
  background: none;
}
</style>