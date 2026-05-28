import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/summoners`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(async (res) => {
                const json = await res.json();

                if (!res.ok) {
                    throw new Error(json?.message || "Errore server");
                }

                return json;
            })
            .then((json) => {
                console.log("RAW DASHBOARD DATA:", json);
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
        <div
            className="dashboard-container"
        >
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <a href="/profile">
                    <button style={{ marginBottom: 20 }}>
                        Vai al tuo profilo
                    </button>
                </a>
            </div>

            {data.map((player) => (
                <div
                    className="member-card"
                    key={player.discordId}
                    onClick={() => navigate(`/player/${player.discordId}`)}
                >
                    <img
                        width={50}
                        height={50}
                        style={{ borderRadius: "50%" }}
                        alt="lol profile icon"
                        src={
                            player.summoner?.profileIconId
                                ? `https://ddragon.leagueoflegends.com/cdn/15.8.1/img/profileicon/${player.summoner.profileIconId}.png`
                                : `https://ddragon.leagueoflegends.com/cdn/15.8.1/img/profileicon/1.png`
                        }
                    />
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