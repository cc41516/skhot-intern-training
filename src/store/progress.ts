import { defineStore } from "pinia";
import { ref } from "vue";

export const useProgressStore = defineStore("progress", () => {
  const isPreDone = ref(false);
  const isMidDone = ref(false);
  const isPostDone = ref(false);

  const didPre = () => {
    isPreDone.value = true;
  };

  const didMid = () => {
    isMidDone.value = true;
  };

  const didPost = () => {
    isPostDone.value = true;
  };

  return {
    isPreDone,
    isMidDone,
    isPostDone,

    didPre,
    didMid,
    didPost,
  };
});
