import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Quiz() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [score, setScore] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);


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
      setTimeLeft(data.timer * 60);
    }

    getQuiz();
  }, [id]);


  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [timeLeft]);


  function updateAnswer(index: number, value: string) {
    setAnswers({
      ...answers,
      [index]: value,
    });
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


    setScore(total);

    setSubmitting(false);
  }


  if (!quiz) {
    return (
      <div className="quiz-container">
        Loading quiz...
      </div>
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



      {score !== null && (

        <div className="score-card">

          <h2>
            Score: {score}/{quiz.questions.length}
          </h2>

          <p>
            {Math.round(
              (score / quiz.questions.length) * 100
            )}
            %
          </p>

        </div>

      )}

    </main>
  );
}

export default Quiz;