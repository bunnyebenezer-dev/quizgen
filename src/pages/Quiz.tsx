import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabase";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const answersRef = useRef<any>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [expired, setExpired] = useState(false);

const [candidateName, setCandidateName] = useState("");
const [candidateEmail, setCandidateEmail] = useState("");
const [studentId, setStudentId] = useState("");

const [alreadySubmitted, setAlreadySubmitted] = useState(false);
const [previousScore, setPreviousScore] = useState<any>(null);

useEffect(() => {
  answersRef.current = answers;
}, [answers]);

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

const now = new Date();
const expiry = new Date(data.expiry);

if (now > expiry) {
  setExpired(true);
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
    !submitted &&
    !submitting
  ) {
    submitQuiz();
  }
}, [timeLeft, started, submitted, submitting]);


useEffect(() => {
  if (!started || submitted || submitting || !quiz) {
    return;
  }

  const expiryTime = new Date(quiz.expiry).getTime();
  const now = Date.now();

  const delay = expiryTime - now;

  if (delay <= 0) {
    setSubmitted(true);
    submitQuiz();
    return;
  }

  const timeout = setTimeout(() => {
    setSubmitted(true);
    submitQuiz();
  }, delay);

  return () => clearTimeout(timeout);

}, [started, submitted, submitting, quiz]);


function renderQuestion(text: string) {
  const codeRegex = /```(?:cpp|c\+\+)?\n([\s\S]*?)```/;

  const match = text.match(codeRegex);

  if (!match) {
    return <>{text}</>;
  }

  const before = text.replace(codeRegex, "").trim();

  return (
    <>
      {before && <p>{before}</p>}

      <pre
        style={{
          background: "#1e293b",
          color: "#f8fafc",
          padding: "16px",
          borderRadius: "10px",
          overflowX: "auto",
          fontFamily: "Consolas, monospace",
          fontSize: "15px",
          lineHeight: 1.5,
          marginTop: "12px",
        }}
      >
        <code>{match[1]}</code>
      </pre>
    </>
  );
}


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

if (submitted || submitting) {
  return;
}

  setSubmitting(true);

  let total = 0;

  quiz.questions.forEach((q: any, index: number) => {
    const selected = (answersRef.current[index] || "")
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
      answers: answersRef.current,
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
setSubmitted(true);

navigate("/review", {
  state: {
    quiz,
    answers: answersRef.current,
    score: total,
  },
});
}


if (expired) {
  return (
    <main className="quiz-container">
      <section className="score-card">
        <h1>Quiz Closed</h1>

        <p>
          This quiz has expired and is no longer available.
        </p>

        <p>
          Please contact your instructor if you believe this is an error.
        </p>
      </section>
    </main>
  );
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


  const now = new Date();
const expiry = new Date(quiz.expiry);

if (now > expiry) {
  setExpired(true);
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

          <div className="question-title">
  <strong>{index + 1}.</strong>

  {renderQuestion(q.question)}
</div>


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