import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import matchingJson from "@/assets/questions/Matching.json";
import { range, sum } from "@/utils/common";

interface MatchingQuestion {
  statement: string;
  cases: Array<{
    image: string;
    name: string;
    indications: string[];
  }>;
}

interface MatchingReply {
  names: string[];
  indications: Set<string>[];
}

const questions: MatchingQuestion[] = JSON.parse(JSON.stringify(matchingJson));
const _replies: MatchingReply[] = questions.map((q) => ({
  names: Array(q.cases.length).fill(""),
  indications: Array(q.cases.length).fill(new Set()),
}));
const replies = reactive(_replies);

export const useMatchingStore = defineStore("matching", () => {
  // Count API
  const questionCount: number = questions.length;
  function caseCount(index: number): number {
    return questions[index].cases.length;
  }
  function indicationCount(index: number): number {
    return sum(questions[index].cases.map((q) => q.indications.length));
  }

  // Done API
  function isDone(index: number): boolean {
    const blankCount: number = caseCount(index) + indicationCount(index);
    const doneCount: number =
      replies[index].names.filter((item) => item !== "").length +
      replies[index].indications.flat().length;
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

  function doQuestion(
    quesIndex: number,
    caseIndex: number,
    name?: string,
    indication?: string
  ) {
    if (name !== undefined) {
      replies[quesIndex].names[caseIndex] = name;
    }
    if (indication !== undefined) {
      replies[quesIndex].indications[caseIndex].add(indication);
    }
  }

  function getReply(index: number): MatchingReply {
    return replies[index]
  }

  // Correct API
  function isCorrect(index: number): boolean {
    const nameAnswer = questions[index].cases.map(q => q.name)
    const indicationAnswer = questions[index].cases.map(q => new Set(q.indications))
    return replies[index].names === nameAnswer && replies[index].indications === indicationAnswer;
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
});
