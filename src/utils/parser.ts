export type Question = {
  type: "mcq" | "text";
  question: string;
  options: string[];
  answer: string;
};

export function parseQuestions(text: string): Question[] {
  const questions: Question[] = [];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  let currentQuestion = "";
  let options: string[] = [];
  let answer = "";

  function saveQuestion() {
    if (!currentQuestion) return;

    questions.push({
      type: options.length > 0 ? "mcq" : "text",
      question: currentQuestion,
      options,
      answer,
    });
  }

  for (const line of lines) {
    if (/^\d+\./.test(line)) {
      saveQuestion();

      currentQuestion = line.replace(/^\d+\.\s*/, "");
      options = [];
      answer = "";
    }

    else if (/^[A-D]\./.test(line)) {
      options.push(line.replace(/^[A-D]\.\s*/, ""));
    }

    else if (line.toLowerCase().startsWith("answer")) {
      answer = line.split(":")[1]?.trim() || "";
    }
  }

  saveQuestion();

  return questions;
}