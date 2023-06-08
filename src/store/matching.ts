import { defineStore } from "pinia";
import { reactive, computed, ref } from "vue";
import matchingJson from "@/assets/questions/Matching.json";
import { equalArray, range, sum } from "@/utils/common";
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
  const allCaseCount = computed(() => {
    return range(questionCount).reduce((prev, curr) => prev + caseCount(curr), 0);
  })
  function indicationCount(index: number): number {
    return sum(questions[index].cases.map((q) => q.indication.length));
  }

  // Done API
  function isDone(index: number): boolean {
    const _blankCount: number = caseCount(index) + indicationCount(index);
    const _doneCount: number =
      _replies[index].map((item) => item.name).flat().length +
      _replies[index].map((item) => item.indication).flat().length;
    return _blankCount === _doneCount;
  }

  function isPartiallyDone(index: number): boolean {
    const _blankCount: number = caseCount(index) + indicationCount(index);
    const _doneCount: number =
      _replies[index].map((item) => item.name).flat().length +
      _replies[index].map((item) => item.indication).flat().length;
    return _doneCount > 0 && _doneCount < _blankCount
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

  function isCaseCorrect(quesIndex: number, caseIndex: number): boolean {
    const nameReply: string[] = _replies[quesIndex][caseIndex].name;
    const nameAnswer: string[] = questions[quesIndex].cases[caseIndex].name;
    const indicationReply: string[] = _replies[quesIndex][caseIndex].indication;
    const indicationAnswer = questions[quesIndex].cases[caseIndex].indication;

    return (
      equalArray(nameReply.sort(), nameAnswer.sort()) &&
      equalArray(indicationReply.sort(), indicationAnswer.sort())
    );
  }

  function isCorrect(quesIndex: number): boolean {
    return range(questions[quesIndex].cases.length).every((_, index) => {
      return isCaseCorrect(quesIndex, index);
    });
  }

  function score(quesIndex: number): number {
    let score: number = 0;
    range(questions[quesIndex].cases.length).map((i) => {
      if (isCaseCorrect(quesIndex, i)) score++;
    });
    return score;
  }

  const allScore = computed(() => {
    return range(questionCount).reduce((prev, curr) => prev + score(curr), 0);
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
              arr[index] = user?.preMatching?.[index]!;
            });
            _isSubmitted.value = user?.preMatchingSubmitted!;
          }
          break;
        case TestPhase.Post:
          if (user?.postMatching?.length !== 0) {
            _replies.forEach((_, index, arr) => {
              arr[index] = user?.postMatching?.[index]!;
            });
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
          preMatchingScore: allScore.value,
        });
        break;
      case TestPhase.Post:
        await updateUser(id, {
          postMatching: _replies,
          postMatchingSubmitted: _isSubmitted.value,
          postMatchingScore: allScore.value,
        });
        break;
    }
  }

  _initialize();

  return {
    questionCount,
    caseCount,
    allCaseCount,
    indicationCount,

    isDone,
    isPartiallyDone,
    doneCount,
    isAllDone,

    getQuestion,
    doQuestion,
    getReply,

    getAnswer,
    isCaseCorrect,
    isCorrect,
    score,
    allScore,

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
