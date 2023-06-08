import { defineStore } from "pinia";
import { reactive, computed, ref } from "vue";
import videoJson from "@/assets/questions/Video.json";
import { range } from "@/utils/common";
import { updateUser, getUser } from "@/server/controller";
import { usePreChoiceStore } from "./choice";

export interface VideoQuestion {
  topic: string;
  video: string;
  questions: Array<{
    statement: string;
    options: string[];
    answer: number;
  }>;
}
export interface VideoQuestions extends Array<VideoQuestion> {}

const questionsGroups: VideoQuestions = JSON.parse(JSON.stringify(videoJson));
const _initReplies: number[][] = range(questionsGroups.length).map(
  (_, quesIndex) => Array(questionsGroups[quesIndex].questions.length).fill(-1)
);

export const useVideoStore = defineStore("video", () => {
  // Count API
  const groupCount: number = questionsGroups.length;

  // Define main variables
  const id = localStorage.getItem("id");
  const _replies: number[][] = reactive(_initReplies);
  const _isSubmitted: boolean[] = reactive(Array(groupCount).fill(false));

  function groupQuestionCount(groupIndex: number): number {
    return questionsGroups[groupIndex].questions.length;
  }
  const allQuestionCount = computed(() => {
    return range(groupCount).reduce((prev, curr) => {
      return prev + groupQuestionCount(curr);
    }, 0);
  });

  // Done API
  function isDone(groupIndex: number, quesIndex: number): boolean {
    return _replies[groupIndex][quesIndex] !== -1;
  }

  function groupDoneCount(groupIndex: number): number {
    let count = 0;
    range(groupQuestionCount(groupIndex)).forEach((i) => {
      if (isDone(groupIndex, i)) count++;
    });
    return count;
  }
  function isGroupDone(groupIndex: number): boolean {
    return groupDoneCount(groupIndex) === groupQuestionCount(groupIndex);
  }

  const allDoneCount = computed(() =>
    range(groupCount).reduce((prev, curr) => prev + groupDoneCount(curr), 0)
  );

  const isAllDone = computed(
    () => allDoneCount.value === allQuestionCount.value
  );

  // Correct API
  function isCorrect(groupIndex: number, quesIndex: number): boolean {
    return (
      _replies[groupIndex][quesIndex] ===
      questionsGroups[groupIndex].questions[quesIndex].answer
    );
  }

  function groupScore(groupIndex: number): number {
    let score = 0;
    range(groupQuestionCount(groupIndex)).map((i) => {
      if (isDone(groupIndex, i) && isCorrect(groupIndex, i)) score++;
    });
    return score;
  }
  const allScore = computed(() => {
    return range(groupCount).reduce((prev, curr) => prev + groupScore(curr), 0);
  });

  // Question API
  function getGroup(groupIndex: number): VideoQuestion {
    return questionsGroups[groupIndex];
  }

  function getQuestion(groupIndex: number, quesIndex: number) {
    return questionsGroups[groupIndex].questions[quesIndex];
  }

  function doQuestion(groupIndex: number, quesIndex: number, reply: number) {
    if (isSubmitted(groupIndex)) return;
    _replies[groupIndex][quesIndex] = reply;
    _updateDatabase();
  }

  function getReply(groupIndex: number, quesIndex: number): number {
    return _replies[groupIndex][quesIndex];
  }

  function getAnswer(groupIndex: number, quesIndex: number): number {
    // watching video
    if (quesIndex === -1) {
      return -1;
    }
    return questionsGroups[groupIndex].questions[quesIndex].answer;
  }

  // Submit API
  function isSubmitted(groupIndex: number) {
    return _isSubmitted[groupIndex];
  }

  const isAllSubmitted = computed(() => _isSubmitted.every((s) => s));

  function submit(groupIndex: number) {
    _isSubmitted[groupIndex] = true;
    _updateDatabase();
  }

  // Clear API
  function reset() {
    for (let i in range(groupCount)) {
      _replies[i] = Array(_replies[i].length).fill(-1)
      _isSubmitted[i] = false
    }
  }

  // Query and update database
  async function _initialize() {
    if (id === null) return;

    try {
      const user = await getUser(id);
      if (user?.video?.length !== 0) {
        for (let i in range(groupCount)) {
          _replies[i] = user?.video?.[i]!
          _isSubmitted[i] = user?.videoSubmitted?.[i]!
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function _updateDatabase() {
    if (id === null) return;

    await updateUser(id, {
      video: _replies,
      videoSubmitted: _isSubmitted,
      videoScore: allScore.value,
    });
  }

  _initialize();

  return {
    groupCount,
    groupQuestionCount,
    allQuestionCount,

    isDone,
    groupDoneCount,
    isGroupDone,
    allDoneCount,
    isAllDone,

    isCorrect,
    groupScore,
    allScore,

    getGroup,
    getQuestion,
    doQuestion,
    getReply,
    getAnswer,

    isSubmitted,
    isAllSubmitted,
    submit,

    reset,
  };
});
