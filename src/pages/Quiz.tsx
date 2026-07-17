import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

const [candidateName, setCandidateName] = useState("");
const [candidateEmail, setCandidateEmail] = useState("");
const [studentId, setStudentId] = useState("");

const [alreadySubmitted, setAlreadySubmitted] = useState(false);
const [previousScore, setPreviousScore] = useState<any>(null);

  useEffect(() => {
    async function getQuiz() {
      const { data, error } = await supabase
        .from("quizzes")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.log(error);
        return;
      }

     setQuiz(data);
    }

    getQuiz();
  }, [id]);


  useEffect(() => {
  if (!started || timeLeft <= 0) return;

  const timer = setInterval(() => {
    setTimeLeft((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);

}, [started, timeLeft]);

useEffect(() => {
  if (
    started &&
    timeLeft === 0 &&
    score === null &&
    !submitting
  ) {
    submitQuiz();
  }
}, [timeLeft, started, score, submitting]);


  function updateAnswer(index: number, value: string) {
    setAnswers({
      ...answers,
      [index]: value,
    });
  }

  async function checkPreviousAttempt() {

  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", quiz.id)
    .eq("student_id", studentId)
    .maybeSingle();


  if (error) {
    console.log(error);
    return false;
  }


  if (data) {
    setPreviousScore(data);
    setAlreadySubmitted(true);
    return true;
  }


  return false;
}


  async function submitQuiz() {
  setSubmitting(true);

  let total = 0;

  quiz.questions.forEach((q: any, index: number) => {
    const selected = (answers[index] || "")
      .trim()
      .toLowerCase();

    const correct = q.answer
      .trim()
      .toLowerCase();

    if (selected === correct) {
      total++;
    }
  });

  const percentage = Math.round(
    (total / quiz.questions.length) * 100
  );

  const { error } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: quiz.id,
      candidate_name: candidateName,
      candidate_email: candidateEmail,
      student_id: studentId,
      answers,
      score: total,
      total_questions: quiz.questions.length,
      percentage,
      submitted_at: new Date().toISOString(),
    });

  if (error) {
    console.error(error);
    alert("Failed to save your results.");
    setSubmitting(false);
    return;
  }

 setSubmitting(false);

navigate("/review", {
  state: {
    quiz,
    answers,
    score: total,
  },
});
}


  if (!quiz) {
    return (
      <div className="quiz-container">
        Loading quiz...
      </div>
    );
  }

  if (!started) {
    if (alreadySubmitted) {
  return (
    <main className="quiz-container">

      <section className="score-card">

        <h1>
          Quiz Already Completed
        </h1>

        <p>
          You have already submitted this quiz.
        </p>

        <h2>
          Score: {previousScore.score}/
          {previousScore.total_questions}
        </h2>

        <p>
          You cannot retake this quiz.
        </p>

      </section>

    </main>
  );
}
  return (
    <main className="quiz-container">

      <section className="question-card">

        <h1 className="quiz-title">
          {quiz.title}
        </h1>

        <p>
          Please enter your details before starting the quiz.
        </p>

        <input
          className="answer-input"
          type="text"
          placeholder="Full Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />

        <input
          className="answer-input"
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <input
          className="answer-input"
          type="email"
          placeholder="Email (Optional)"
          value={candidateEmail}
          onChange={(e) => setCandidateEmail(e.target.value)}
        />

        <button
          className="button submit-button"
          disabled={
            candidateName.trim() === "" ||
            studentId.trim() === ""
          }
          onClick={async () => {

  const exists = await checkPreviousAttempt();

  if (exists) {
    return;
  }


  setTimeLeft(quiz.timer * 60);
  setStarted(true);

}}
        >
          Start Quiz
        </button>

      </section>

    </main>
  );
}

  return (
    <main className="quiz-container">

      <section className="quiz-header">

        <h1 className="quiz-title">
          {quiz.title}
        </h1>


        <div className="timer">
          Time Left:{" "}
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60)
            .toString()
            .padStart(2, "0")}
        </div>

      </section>



      {quiz.questions.map((q: any, index: number) => (

        <section
          className="question-card"
          key={index}
        >

          <h2 className="question-title">
            {index + 1}. {q.question}
          </h2>


          {q.type === "mcq" ? (

            q.options.map((option: string) => (

              <label
                className="option"
                key={option}
              >

                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={
                    answers[index] === option
                  }
                  onChange={() =>
                    updateAnswer(
                      index,
                      option
                    )
                  }
                />

                {option}

              </label>

            ))

          ) : (

            <input
              className="answer-input"
              type="text"
              placeholder="Type your answer..."
              value={answers[index] || ""}
              onChange={(e) =>
                updateAnswer(
                  index,
                  e.target.value
                )
              }
            />

          )}

        </section>

      ))}



      <button
        className="button submit-button"
        onClick={submitQuiz}
        disabled={submitting}
      >
        {submitting
          ? "Submitting..."
          : "Submit Quiz"}
      </button>



     

    </main>
  );
}

export default Quiz;