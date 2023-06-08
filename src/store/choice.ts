import { defineStore } from "pinia";
import { reactive, computed, ref } from "vue";
import choiceJson from "@/assets/questions/Choice.json";
import { range } from "@/utils/common";
import { TestPhase } from "@/global";
import { updateUser, getUser } from "@/server/controller";

export interface ChoiceQuestion {
  statement: string;
  options: string[];
  answer: number;
}
export interface ChoiceQuestions extends Array<ChoiceQuestion> {}

const questions: ChoiceQuestions = JSON.parse(JSON.stringify(choiceJson));
const answers: number[] = questions.map((q) => q.answer);

function createChoiceStore(phase: TestPhase) {
  // Define main variables
  const id = localStorage.getItem("id");
  const _replies: number[] = reactive(Array(questions.length).fill(-1));
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
    _updateDatabase();
  }

  function getReply(index: number): number {
    return _replies[index];
  }

  function getAnswer(index: number): number {
    return answers[index];
  }

  // Submit API
  const isSubmitted = computed(() => _isSubmitted.value);

  function submit() {
    _isSubmitted.value = true;
    _updateDatabase();
  }

  // Clear API
  function reset() {
    _replies.forEach((_, index, arr) => {
      arr[index] = -1;
    });
    _isSubmitted.value = false;
  }

  // Query and update database
  async function _initialize() {
    if (id === null) return;

    try {
      const user = await getUser(id);
      switch (phase) {
        case TestPhase.Pre:
          if (user?.preChoice?.length !== 0) {
            _replies.forEach((_, index, arr) => {
              arr[index] = user?.preChoice?.[index] ?? -1;
            });
            _isSubmitted.value = user?.preChoiceSubmitted!;
          }
          break;
        case TestPhase.Post:
          if (user?.postChoice?.length !== 0) {
            _replies.forEach((_, index, arr) => {
              arr[index] = user?.postChoice?.[index] ?? -1;
            });
            _isSubmitted.value = user?.postChoiceSubmitted!;
          }
          break;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function _updateDatabase() {
    if (id === null) return;

    switch (phase) {
      case TestPhase.Pre:
        await updateUser(id, {
          preChoice: _replies,
          preChoiceSubmitted: _isSubmitted.value,
          preChoiceScore: score.value,
        });
        break;
      case TestPhase.Post:
        await updateUser(id, {
          postChoice: _replies,
          postChoiceSubmitted: _isSubmitted.value,
          postChoiceScore: score.value,
        });
        break;
    }
  }

  _initialize();

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

    reset,
  };
}

export const usePreChoiceStore = defineStore("preChoice", () =>
  createChoiceStore(TestPhase.Pre)
);
export const usePostChoiceStore = defineStore("postChoice", () =>
  createChoiceStore(TestPhase.Post)
);
