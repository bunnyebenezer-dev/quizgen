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
    .map((line) => line.trim());

  let currentQuestion = "";
  let options: string[] = [];
  let answer = "";
  let type: "mcq" | "text" = "text";

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line === "") continue;

    // New question
    if (/^\d+\./.test(line)) {
      if (currentQuestion) {
        questions.push({
          question: currentQuestion.trim(),
          options,
          answer,
          type,
        });
      }

      currentQuestion = line.replace(/^\d+\.\s*/, "");
      options = [];
      answer = "";
      type = "text";
    }

    // MCQ option
    else if (/^[A-D]\./.test(line)) {
      options.push(line.replace(/^[A-D]\.\s*/, ""));
      type = "mcq";
    }

    // Answer
    else if (line.toLowerCase().startsWith("answer")) {
      answer = line.split(":")[1]?.trim() || "";
    }

    // Any other line belongs to the question
    else {
      currentQuestion += "\n" + line;
    }
  }

  // Last question
  if (currentQuestion) {
    questions.push({
      question: currentQuestion.trim(),
      options,
      answer,
      type,
    });
  }

  return questions;
}