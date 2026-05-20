import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SummonerPage() {
    const { discordId } = useParams();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000/summoners/${discordId}`, {
            credentials: "include",
        })
            .then((r) => r.json())
            .then(setProfile);
    }, [discordId]);

    useEffect(() => {
        if (!profile?.matchIds) return;

        Promise.all(
            profile.matchIds.map((id) =>
                fetch(`http://localhost:3000/matches/match/${id}`, {
                    credentials: "include",
                }).then((r) => r.json())
            )
        ).then(setMatches);
    }, [profile]);

    if (!profile) return <h2>Caricamento...</h2>;

    const avatarUrl = profile.account?.puuid
        ? `https://ddragon.leagueoflegends.com/cdn/15.8.1/img/profileicon/${profile.summoner.profileIconId}.png`
        : null;

    return (
        <div style={{ padding: 20 }}>
            <div className="summoner-page-header">
                <button onClick={() => navigate("/dashboard")}>
                    ← Torna indietro
                </button>

                <h1>
                    {profile.account.gameName}#{profile.account.tagLine}
                </h1>

                <h2 style={{ marginTop: 30 }}>Ultime partite</h2>

                {matches.length === 0 && <p>Caricamento partite...</p>}
            </div>

            {matches.map((match) => {
                const info = match.participants ? match : match.info;

                const player = info.participants.find(
                    (p) => p.puuid === profile.account.puuid
                );

                return (
                    <div
                        key={match.matchId}
                        className="match-card"
                        style={{
                            background: player?.win ? "#e6ffe6" : "#ffe6e6",
                            display: "flex",
                            alignItems: "center",
                            gap: 15,
                            padding: 10,
                            marginBottom: 10,
                            cursor: "pointer",
                        }}
                        onClick={() => navigate(`/match/${match.matchId}`)}
                    >
                        <img
                            width={40}
                            height={40}
                            alt={player?.champion}
                            src={`https://ddragon.leagueoflegends.com/cdn/15.8.1/img/champion/${player?.champion}.png`}
                        />

                        <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: "bold" }}>
                                {player?.champion}
                            </p>

                            <p style={{ margin: 0 }}>
                                {player?.win ? "VICTORIA" : "SCONFITTA"}
                            </p>
                        </div>

                        <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0 }}>
                                KDA: {player?.kills}/{player?.deaths}/{player?.assists}
                            </p>

                            <p style={{ margin: 0 }}>
                                {Math.floor(match.gameDuration / 60)} min
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}