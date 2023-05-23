import { defineStore } from "pinia";
import { reactive, computed, ref } from "vue";
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

function createChoiceStore() {
  // Define main variables
  const _replies: number[] = reactive(range(questions.length).fill(-1));
  const _isSubmitted = ref(false);

  // Count API
  const questionCount: number = questions.length;

  // Done API
  function isDone(index: number): boolean {
    return _replies[index] !== -1;
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
    return _replies[index] === answers[index];
  }

  const score = computed(() => {
    let score = 0;
    range(questionCount).map((i) => {
      if (isDone(i) && isCorrect(i)) score++;
    });
    return score;
  });

  // Question API
  function getQuestion(index: number): ChoiceQuestion {
    return questions[index];
  }

  function doQuestion(index: number, reply: number) {
    if (_isSubmitted.value) return;
    _replies[index] = reply;
  }

  function getReply(index: number): number {
    return _replies[index];
  }

  function getAnswer(index: number): number {
    return answers[index];
  }

  // Submit API
  const isSubmitted = computed(() => _isSubmitted.value)

  function submit() {
    _isSubmitted.value = true;
  }

  return {
    questionCount,

    isDone,
    doneCount,
    isAllDone,

    isCorrect,
    score,

    getQuestion,
    doQuestion,
    getReply,
    getAnswer,

    isSubmitted,
    submit,
  };
}

export const usePreChoiceStore = defineStore("preChoice", () =>
  createChoiceStore()
);
export const usePostChoiceStore = defineStore("postChoice", () =>
  createChoiceStore()
);
