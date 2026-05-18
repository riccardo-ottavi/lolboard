import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MatchDetails() {
    const { matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/matches/match/${matchId}`, {
            credentials: "include",
        })
            .then(async (res) => {
                const json = await res.json();
                if (!res.ok) throw new Error(json.message || "Errore match");
                return json;
            })
            .then(setMatch)
            .catch(setError);
    }, [matchId]);

    if (error) {
        return <h2 style={{ color: "red" }}>{error.message}</h2>;
    }

    if (!match) {
        return <h2>Caricamento match...</h2>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Match Details</h1>

            <h2>
                {match.gameMode} — {Math.floor(match.gameDuration / 60)} min
            </h2>

            <h3>Participants</h3>

            {match.participants.map((p, i) => (
                <div
                    key={i}
                    style={{
                        border: "1px solid #ddd",
                        margin: "10px 0",
                        padding: "10px",
                        borderRadius: "8px",
                        background: p.win ? "#e6ffe6" : "#ffe6e6",
                    }}
                >
                    <b>{p.champion}</b>

                    <p>
                        KDA: {p.kills}/{p.deaths}/{p.assists}
                    </p>

                    <p>Team: {p.team === 100 ? "Blue" : "Red"}</p>

                    <p>{p.win ? "VICTORIA" : "SCONFITTA"}</p>
                </div>
            ))}
        </div>
    );
}