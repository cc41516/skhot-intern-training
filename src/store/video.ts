import { defineStore } from "pinia";
import { reactive, computed, ref } from "vue";
import videoJson from "@/assets/questions/Video.json";
import { range } from "@/utils/common";

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
  (_, quesIndex) => range(questionsGroups[quesIndex].questions.length).fill(-1)
);

export const useVideoStore = defineStore("video", () => {
  // Define main variables
  const _replies = reactive(_initReplies);
  const _isSubmitted = ref(false);

  // Count API
  const groupCount: number = questionsGroups.length;

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
    _replies[groupIndex][quesIndex] = reply;
  }

  function getReply(groupIndex: number, quesIndex: number): number {
    return _replies[groupIndex][quesIndex];
  }

  function getAnswer(groupIndex: number, quesIndex: number): number {
    if (quesIndex === -1) { // watching video
      return -1;
    }
    return questionsGroups[groupIndex].questions[quesIndex].answer;
  }

  // Submit API
  const isSubmitted = computed(() => _isSubmitted.value);

  function submit() {
    _isSubmitted.value = true;
  }

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
    submit,
  };
});
