import { useState } from "react";
import { parseQuestions } from "./utils/parser";
import { supabase } from "./supabase";

function App() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState("");
  const [timer, setTimer] = useState(30);
  const [expiry, setExpiry] = useState("");
  const [quizLink, setQuizLink] = useState("");
const [loading, setLoading] = useState(false);

  async function generateQuiz() {
  setLoading(true);

  const quizQuestions = parseQuestions(questions);

  const quizId = Math.random()
    .toString(36)
    .substring(2, 8);

  const { error } = await supabase
    .from("quizzes")
    .insert({
      id: quizId,
      title,
      questions: quizQuestions,
      timer,
      expiry,
    });

  if (error) {
    console.log(error);
    setLoading(false);
    return;
  }

  setQuizLink(
    `${window.location.origin}/quiz/${quizId}`
  );

  setLoading(false);
}
  return (
    <main className="app-container">

      <section className="card">

        <h1 className="page-title">
          Create Quiz
        </h1>

        <p className="page-description">
          Create a quiz and share it with candidates.
        </p>


        <div className="form-group">
          <label className="label">
            Quiz Title
          </label>

          <input
            className="input"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>


        <div className="form-group">
          <label className="label">
            Questions
          </label>

          <textarea
            className="textarea"
            rows={12}
            value={questions}
            onChange={(e) =>
              setQuestions(e.target.value)
            }
          />
        </div>


        <div className="form-group">
          <label className="label">
            Timer (minutes)
          </label>

          <input
            className="input"
            type="number"
            value={timer}
            onChange={(e) =>
              setTimer(Number(e.target.value))
            }
          />
        </div>


        <div className="form-group">
          <label className="label">
            Expiry Date
          </label>

          <input
            className="input"
            type="datetime-local"
            value={expiry}
            onChange={(e) =>
              setExpiry(e.target.value)
            }
          />
        </div>


        <button
  className="button"
  onClick={generateQuiz}
  disabled={loading}
>
  {loading ? "Creating Quiz..." : "Generate Quiz"}
</button>


        {quizLink && (
          <div className="success-card">

            <h3>
              Quiz Created Successfully
            </h3>

            <p>
              Quiz Link
            </p>

            <a
              className="link"
              href={quizLink}
            >
              {quizLink}
            </a>


            <p>
              Results Dashboard
            </p>

            <a
              className="link"
              href={`/results/${quizLink.split("/").pop()}`}
            >
              Open Results
            </a>

          </div>
        )}

      </section>

    </main>
  );
}

export default App;