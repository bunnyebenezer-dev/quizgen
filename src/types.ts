export type Question = {
  question: string;
  options: string[];
  answer: string;
};

export type Quiz = {
  id: string;
  title: string;
  questions: Question[];
  timer: number;
  expiry: string;
};