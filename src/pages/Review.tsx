import { useLocation } from "react-router-dom";

function Review() {
  const { state } = useLocation();

  if (!state) {
  return (
    <main className="quiz-container">

      <section className="score-card">
        <h2>No review available.</h2>

        <p>
          This review session does not exist or has expired.
        </p>

        <p>
          You may now close this page.
        </p>
      </section>

    </main>
  );
}

  const {
    quiz,
    answers,
    score,
  } = state;

  return (
    <main className="quiz-container">

      <section className="score-card">
        <h1>Quiz Complete</h1>

        <h2>
          {score}/{quiz.questions.length}
        </h2>

        <p>
          {Math.round(
            (score / quiz.questions.length) * 100
          )}
          %
        </p>
      </section>

      {quiz.questions.map((q: any, index: number) => {

        const userAnswer =
          answers[index] || "Not answered";

        const correct =
          userAnswer.trim().toLowerCase() ===
          q.answer.trim().toLowerCase();

        return (

          <section
            key={index}
            className="question-card"
            style={{
              borderLeft: correct
                ? "6px solid #16a34a"
                : "6px solid #dc2626",
            }}
          >

            <h2>
              {index + 1}. {q.question}
            </h2>

            <p>

              <strong>Your Answer:</strong>

              {" "}

              {userAnswer}

            </p>

            <p>

              <strong>Correct Answer:</strong>

              {" "}

              {q.answer}

            </p>

          </section>

        );

      })}

      <section
  className="score-card"
  style={{ marginTop: "2rem" }}
>
  <h2>Quiz Submitted Successfully</h2>

  <p>
    Thank you for participating.
  </p>

  <p>
    You may now close this page.
  </p>
</section>

    </main>
  );
}

export default Review;