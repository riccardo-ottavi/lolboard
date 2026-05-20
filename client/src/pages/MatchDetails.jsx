import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MatchDetails() {
    const { matchId } = useParams();
    const [match, setMatch] = useState(null);
    const [error, setError] = useState(null);

    const summonerSpells = {
        1: "SummonerBoost",     // Cleanse
        3: "SummonerExhaust",
        4: "SummonerFlash",
        6: "SummonerHaste",     // Ghost
        7: "SummonerHeal",
        11: "SummonerSmite",
        12: "SummonerTeleport",
        13: "SummonerMana",     // Clarity
        14: "SummonerDot",      // Ignite
        21: "SummonerBarrier",
        32: "SummonerSnowball",
    };

    const roleMap = {
        TOP: "TOP",
        JUNGLE: "JUNGLE",
        MIDDLE: "MID",
        BOTTOM: "ADC",
        UTILITY: "SUPPORT",
    };

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
            <div className="match-details-header">
                <h1>Match Details</h1>

                <a href="/dashboard"><button>Torna alla dashboard</button></a>

                <h2>
                    {match.gameMode} — {Math.floor(match.gameDuration / 60)} min
                </h2>

                <h3>Participants</h3>
            </div>

            <div className="match-partecipants-container">
                {match.participants.map((p, i) => (
                    <div
                        className="match-partecipant-card"
                        key={i}
                        style={{
                            background: p.win ? "#e6ffe6" : "#ffe6e6",
                        }}
                    >
                        <b>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <img
                                    width={40}
                                    height={40}
                                    alt={p.champion}
                                    src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${p.champion}.png`}
                                />

                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <b>
                                        {p.champion} (Lv {p.level ?? "?"})
                                    </b>

                                    <span
                                        style={{
                                            padding: "2px 6px",
                                            borderRadius: 6,
                                            fontSize: 12,
                                            fontWeight: "bold",
                                            background:
                                                p.role === "TOP"
                                                    ? "#f39c12"
                                                    : p.role === "JUNGLE"
                                                        ? "#27ae60"
                                                        : p.role === "MIDDLE"
                                                            ? "#9b59b6"
                                                            : p.role === "BOTTOM"
                                                                ? "#3498db"
                                                                : "#e67e22",
                                            color: "white",
                                        }}
                                    >
                                        {roleMap[p.role] ?? p.role}
                                    </span>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                    {(p.spells || []).map((spellId, idx) => {
                                        const spell = summonerSpells[spellId];
                                        if (!spell) return null;

                                        return (
                                            <img
                                                key={idx}
                                                width={18}
                                                height={18}
                                                alt={spell}
                                                src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/spell/${spell}.png`}
                                            />
                                        );
                                    })}
                                </div>
                                <b>
                                    {p.summonerName}#{p.tagLine}
                                </b>
                            </div>
                        </b>

                        <p>
                            KDA: {p.kills}/{p.deaths}/{p.assists}{" "}
                            <b>({p.kda ?? "?"})</b>
                        </p>

                        <p>Gold: {p.goldEarned ?? "?"}</p>

                        <p>CS: {p.cs ?? "?"}</p>

                        <p>Damage: {p.damage?.toLocaleString() ?? "?"}</p>

                        <p>Vision Score: {p.vision ?? "?"}</p>

                        <p>Team: {p.team === 100 ? "Blue" : "Red"}</p>

                        <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
                            {(p.items || []).map((itemId, idx) =>
                                itemId ? (
                                    <img
                                        key={idx}
                                        width={32}
                                        height={32}
                                        alt="item"
                                        src={`https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/${itemId}.png`}
                                    />
                                ) : null
                            )}
                        </div>

                        <p style={{ fontWeight: "bold" }}>
                            {p.win ? "VICTORIA" : "SCONFITTA"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}