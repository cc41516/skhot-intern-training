export enum TestPhase {
  "Pre" = "pre",
  "Mid" = "mid",
  "Post" = "post",
}

export enum QuestionType {
  "Choice" = "choice",
  "Video" = "video",
  "Matching" = "matching",
}

export interface QuestionInfo {
  questionType: QuestionType;
  questionIndex: number;
  groupIndex?: number;
}
