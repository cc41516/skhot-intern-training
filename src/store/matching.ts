import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import matchingJson from "@/assets/questions/Matching.json";
import { range, sum } from "@/utils/common";
import { TestPhase } from "@/global";

export interface MatchingCase {
  image: string;
  name: string;
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
const preReplies = reactive(createReply());
const postReplies = reactive(createReply());

function createReply(): MatchingCaseReply[][] {
  return questions.map((q) =>
    range(q.cases.length).map(() => ({
      name: [],
      indication: [],
    }))
  );
}

function createMatchingStore(replies: MatchingCaseReply[][]) {
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
      replies[index].map((item) => item.name).flat().length +
      replies[index].map((item) => item.indication).flat().length;
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
    replies[quesIndex] = reply;
  }

  function getReply(index: number): MatchingCaseReply[] {
    return replies[index];
  }

  // Correct API
  function isCorrect(index: number): boolean {
    const nameReply = replies[index].map((q) => new Set(q.name));
    const nameAnswer = questions[index].cases.map((q) => new Set(q.name));
    const indicationReply = replies[index].map((q) => new Set(q.indication));
    const indicationAnswer = questions[index].cases.map(
      (q) => new Set(q.indication)
    );
    return nameReply === nameAnswer && indicationReply === indicationAnswer;
  }

  function correctStatus(): boolean[] {
    return range(questionCount).map((i) => isCorrect(i));
  }

  const score = computed(() => {
    correctStatus().reduce((acc, cur) => acc + Number(cur), 0);
  });

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

    isCorrect,
    correctStatus,
    score,
  };
}

export const usePreMatchingStore = defineStore("preMatching", () =>
  createMatchingStore(preReplies)
);
export const usePostMatchingStore = defineStore("postMatching", () =>
  createMatchingStore(postReplies)
);
