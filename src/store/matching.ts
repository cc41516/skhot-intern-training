import { defineStore } from "pinia";
import { reactive, computed, ref } from "vue";
import matchingJson from "@/assets/questions/Matching.json";
import { equalSet, range, sum } from "@/utils/common";
import { TestPhase } from "@/global";
import { updateUser, getUser } from "@/server/controller";

export interface MatchingCase {
  image: string;
  name: string[];
  indication: string[];
}

export interface MatchingQuestion {
  statement: string;
  cases: MatchingCase[];
}

export interface MatchingCaseReply {
  name: string[];
  indication: string[];
}

const questions: MatchingQuestion[] = JSON.parse(JSON.stringify(matchingJson));

function createReply(): MatchingCaseReply[][] {
  return questions.map((q) =>
    q.cases.map(() => ({
      name: [],
      indication: [],
    }))
  );
}

function createMatchingStore(phase: TestPhase) {
  // Define main variables
  const id = localStorage.getItem("id");
  const _replies: MatchingCaseReply[][] = reactive(createReply());
  const _isSubmitted = ref(false);

  // Count API
  const questionCount: number = questions.length;
  function caseCount(index: number): number {
    return questions[index].cases.length;
  }
  function indicationCount(index: number): number {
    return sum(questions[index].cases.map((q) => q.indication.length));
  }

  // Done API
  function isDone(index: number): boolean {
    const blankCount: number = caseCount(index) + indicationCount(index);
    const doneCount: number =
      _replies[index].map((item) => item.name).flat().length +
      _replies[index].map((item) => item.indication).flat().length;
    return blankCount === doneCount;
  }

  const doneCount = computed(() => {
    let count = 0;
    range(questionCount).forEach((i) => {
      if (isDone(i)) count++;
    });
    return count;
  });

  const isAllDone = computed(() => doneCount.value == questionCount);

  // Question API
  function getQuestion(index: number): MatchingQuestion {
    return questions[index];
  }

  function doQuestion(quesIndex: number, reply: MatchingCaseReply[]) {
    if (_isSubmitted.value) return;
    _replies[quesIndex] = reply;
    _updateDatabase();
  }

  function getReply(index: number): MatchingCaseReply[] {
    return _replies[index];
  }

  // Correct API
  function getAnswer(index: number): MatchingCaseReply[] {
    return questions[index].cases.map((c) => ({
      name: [c.name[0]],
      indication: c.indication,
    }));
  }

  function isCorrect(index: number): boolean {
    const nameReply = _replies[index].map((q) => new Set(q.name));
    const nameAnswer = questions[index].cases.map((q) => new Set(q.name));
    const indicationReply = _replies[index].map((q) => new Set(q.indication));
    const indicationAnswer = questions[index].cases.map(
      (q) => new Set(q.indication)
    );

    for (let i = 0; i < nameAnswer.length; i++) {
      if (!equalSet(nameReply[i], nameAnswer[i])) return false;
      if (!equalSet(indicationReply[i], indicationAnswer[i])) return false;
    }

    return true;
  }

  const score = computed(() => {
    let score = 0;
    range(questionCount).map((i) => {
      if (isDone(i) && isCorrect(i)) score++;
    });
    return score;
  });

  // Submit API
  const isSubmitted = computed(() => _isSubmitted.value);

  function submit() {
    _isSubmitted.value = true;
    _updateDatabase();
  }

  // Clear API
  function reset() {
    _replies.forEach((_, index, arr) => {
      arr[index] = Array(questions[index].cases.length).fill({
        name: [],
        indication: [],
      });
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
          if (user?.preMatching?.length !== 0) {
            _replies.forEach((_, index, arr) => {
              arr[index] = user?.preMatching?.[index]!
            })
            _isSubmitted.value = user?.preMatchingSubmitted!;
          }
          break;
        case TestPhase.Post:
          if (user?.postMatching?.length !== 0) {
            _replies.forEach((_, index, arr) => {
              arr[index] = user?.postMatching?.[index]!
            })
            _isSubmitted.value = user?.postMatchingSubmitted!;
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
          preMatching: _replies,
          preMatchingSubmitted: _isSubmitted.value,
          preMatchingScore: score.value,
        });
        break;
      case TestPhase.Post:
        await updateUser(id, {
          postMatching: _replies,
          postMatchingSubmitted: _isSubmitted.value,
          postMatchingScore: score.value,
        });
        break;
    }
  }

  _initialize();

  return {
    questionCount,
    caseCount,
    indicationCount,

    isDone,
    doneCount,
    isAllDone,

    getQuestion,
    doQuestion,
    getReply,

    getAnswer,
    isCorrect,
    score,

    isSubmitted,
    submit,

    reset,
  };
}

export const usePreMatchingStore = defineStore("preMatching", () =>
  createMatchingStore(TestPhase.Pre)
);
export const usePostMatchingStore = defineStore("postMatching", () =>
  createMatchingStore(TestPhase.Post)
);
