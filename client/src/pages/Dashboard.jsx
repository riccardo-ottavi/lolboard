import { useEffect, useState } from "react";

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/summoners", {
            credentials: "include",
        })
            .then(async (res) => {
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json?.message || "Errore server");
                }

                return json;
            })
            .then((json) => {
                if (!Array.isArray(json)) {
                    throw new Error("Risposta non valida dal server");
                }

                setData(json.filter(Boolean));
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <h2 style={{ padding: 20 }}>Caricamento...</h2>;
    }

    if (error) {
        return (
            <div style={{ padding: 20, color: "red" }}>
                <h2>Errore</h2>
                <p>{error}</p>
            </div>
        );
    }

    if (data.length === 0) {
        return <h2 style={{ padding: 20 }}>Nessun giocatore trovato</h2>;
    }

    return (
        <div style={{ padding: 20 }}>

            <a href="/profile">
                <button style={{ marginBottom: 20 }}>
                    Vai al profilo
                </button>
            </a>

            <h1>Dashboard Summoners</h1>

            {data.map((player) => (
                <div
                    key={player.discordId}
                    style={{
                        border: "1px solid #ddd",
                        margin: "10px 0",
                        padding: "10px",
                        borderRadius: "8px",
                    }}
                >
                    <h2>
                        {player.account?.gameName ?? "Unknown"}#
                        {player.account?.tagLine ?? ""}
                    </h2>

                    <p>
                        <b>Level:</b>{" "}
                        {player.summoner?.summonerLevel ?? "?"}
                    </p>

                    <p>
                        <b>Rank:</b>{" "}
                        {player.rank?.tier ?? "UNRANKED"}
                        {player.rank?.rank ? ` ${player.rank.rank}` : ""}
                    </p>
                </div>
            ))}
        </div>
    );
}