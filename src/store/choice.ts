import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import choiceJson from "@/assets/questions/Choice.json";
import { range } from "@/utils/common";

export interface ChoiceQuestion {
  statement: string;
  options: string[];
  answer: number;
}
export interface ChoiceQuestions extends Array<ChoiceQuestion> {}

const questions: ChoiceQuestions = JSON.parse(JSON.stringify(choiceJson));
const answers: number[] = questions.map((q) => q.answer);
const replies: number[] = reactive(range(questions.length).fill(-1)); // default val -1 means not answered

export const useChoiceStore = defineStore("choice", () => {
  // Count API
  const questionCount: number = questions.length;

  // Done API
  function isDone(index: number): boolean {
    return replies[index] !== -1;
  }
  const doneCount = computed(() => {
    let count = 0;
    range(questionCount).forEach((i) => {
      if (isDone(i)) count++;
    });
    return count;
  });
  const isAllDone = computed(() => doneCount.value == questionCount);

  // Correct API
  function isCorrect(index: number): boolean {
    return replies[index] === answers[index];
  }

  function correctStatus(): boolean[] {
    return range(questionCount).map((i) => isCorrect(i));
  }

  const score = computed(() => {
    correctStatus().reduce((acc, cur) => acc + Number(cur), 0);
  });

  // Question API
  function getQuestion(index: number): ChoiceQuestion {
    return questions[index];
  }

  function doQuestion(index: number, reply: number) {
    replies[index] = reply;
  }

  function getReply(index: number): number {
    return replies[index];
  }

  function getAnswer(index: number): number {
    return answers[index]
  }

  return {
    questionCount,

    isDone,
    doneCount,
    isAllDone,

    isCorrect,
    correctStatus,
    score,

    getQuestion,
    doQuestion,
    getReply,
    getAnswer,
  };
});
