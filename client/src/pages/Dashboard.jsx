import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/summoners", {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Errore nel fetch");
        }
        return res.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Caricamento...</h2>;
  if (error) return <h2>Errore: {error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Summoners</h1>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}