import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabase";

function Results() {
  const { id } = useParams();

  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function getResults() {
      const { data, error } = await supabase
        .from("quiz_attempts")
        .select("*")
        .eq("quiz_id", id)
        .order("submitted_at", {
          ascending: false,
        });


      if (error) {
        console.log(error);
        setLoading(false);
        return;
      }


      setAttempts(data || []);
      setLoading(false);
    }


    getResults();

  }, [id]);


  if (loading) {
    return (
      <main className="results-container">
        Loading results...
      </main>
    );
  }


  const totalAttempts = attempts.length;


  const average =
    totalAttempts > 0
      ? Math.round(
          attempts.reduce(
            (sum, item) =>
              sum + item.percentage,
            0
          ) / totalAttempts
        )
      : 0;


  const highest =
    totalAttempts > 0
      ? Math.max(
          ...attempts.map(
            (item) => item.percentage
          )
        )
      : 0;



  return (
    <main className="results-container">


      <section className="results-header">

        <h1 className="results-title">
          Quiz Results
        </h1>


        <div className="stats-grid">

          <div className="stat-card">

            <div className="stat-label">
              Total Attempts
            </div>

            <div className="stat-value">
              {totalAttempts}
            </div>

          </div>



          <div className="stat-card">

            <div className="stat-label">
              Average Score
            </div>

            <div className="stat-value">
              {average}%
            </div>

          </div>



          <div className="stat-card">

            <div className="stat-label">
              Highest Score
            </div>

            <div className="stat-value">
              {highest}%
            </div>

          </div>


        </div>

      </section>



      <section className="results-card">


        {attempts.length === 0 ? (

          <div className="empty-state">
            No attempts yet.
          </div>

        ) : (


          <table className="results-table">

            <thead>

              <tr>

                <th>
                  Name
                </th>

                <th>
                  Email
                </th>

                <th>
                  Score
                </th>

                <th>
                  Percentage
                </th>

                <th>
                  Submitted
                </th>

              </tr>

            </thead>


            <tbody>


              {attempts.map((attempt) => (

                <tr key={attempt.id}>

                  <td>
                    {attempt.candidate_name}
                  </td>


                  <td>
                    {attempt.candidate_email}
                  </td>


                  <td>
                    {attempt.score}/
                    {attempt.total_questions}
                  </td>


                  <td>
                    {attempt.percentage}%
                  </td>


                  <td>
                    {new Date(
                      attempt.submitted_at
                    ).toLocaleString()}
                  </td>


                </tr>

              ))}


            </tbody>


          </table>

        )}


      </section>


    </main>
  );
}


export default Results;