import { QuestionType, QuestionInfo, TestPhase } from "@/global";
import { useChoiceStore } from "@/store/choice";
import { useMatchingStore } from "@/store/matching";
import { useVideoStore } from "@/store/video";

export function range(n: number): number[] {
  return [...Array(n).keys()];
}

export function sum(arr: number[]): number {
  return arr.reduce((prev, curr) => prev + curr, 0);
}

export function shuffle(arr: Array<any>, seed: number = 1) {
  function random(seed: number): number {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(random(seed + i) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

export function getImageUrl(name: string) {
  return new URL(`../assets/images/${name}`, import.meta.url).href;
}

export function parseRoute(path: string): any {
  const segments = path.split("/");
  let testPhase: TestPhase;
  let questionType: QuestionType;
  let questionIndex: number = 0;
  let groupIndex: number = 0;

  switch (segments[1]) {
    case "pre-test":
      testPhase = TestPhase.Pre;
      break;
    case "mid-test":
      testPhase = TestPhase.Mid;
      break;
    case "post-test":
      testPhase = TestPhase.Post;
      break;
    default:
      testPhase = TestPhase.Pre;
  }

  if (segments[2].startsWith("choice")) {
    questionType = QuestionType.Choice;
    questionIndex = Number(segments[2].substring("choice".length));
  } else if (segments[2].startsWith("matching")) {
    questionType = QuestionType.Matching;
    questionIndex = Number(segments[2].substring("matching".length));
  } else {
    questionType = QuestionType.Video;
    groupIndex = Number(segments[2].substring("video".length));
    questionIndex = Number(segments[3].substring("question".length));
  }
  return {
    testPhase: testPhase,
    questionType: questionType,
    questionIndex: questionIndex - 1,
    groupIndex: groupIndex - 1,
  };
}

export function getQuestionCount(
  questionType: QuestionType,
  groupIndex: number | undefined = 0
): number {
  const choiceStore = useChoiceStore();
  const matchingStore = useMatchingStore();
  const videoStore = useVideoStore();

  switch (questionType) {
    case QuestionType.Choice:
      return choiceStore.questionCount;
    case QuestionType.Matching:
      return matchingStore.questionCount;
    case QuestionType.Video:
      return videoStore.groupQuestionCount(groupIndex);
  }
}
