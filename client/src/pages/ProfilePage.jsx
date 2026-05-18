import { useEffect, useState } from "react";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/me", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then(setUser);
    }, []);

    useEffect(() => {
        if (!user?.discord_id) return;

        fetch(`http://localhost:3000/summoners/${user.discord_id}`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then(setProfile);
    }, [user]);

    if (!user) return <h2>Caricamento...</h2>;

    const avatarUrl = user.avatar
        ? `https://cdn.discordapp.com/avatars/${user.discord_id}/${user.avatar}.png`
        : null;

    return (
        <div style={{ padding: 20 }}>
            <a href="/dashboard">
                <button style={{ marginBottom: 20 }}>
                    Vai alla dashboard
                </button>
            </a>

            <h1>Profilo</h1>

            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt="avatar"
                        width={80}
                        height={80}
                        style={{ borderRadius: "50%" }}
                    />
                )}

                <div>
                    <h2>{user.username}</h2>

                    <p>
                        Riot ID:{" "}
                        <b>
                            {user.riot_summoner_name?.gameName}#
                            {user.riot_summoner_name?.tagLine}
                        </b>
                    </p>
                </div>
            </div>

            <h2 style={{ marginTop: 30 }}>Ultime partite</h2>

            {!profile?.matches && <p>Caricamento partite...</p>}

            {profile?.matches?.map((match) => {
                const info = match.info;
                const me = info.participants.find(
                    (p) => p.puuid === profile.account.puuid
                );

                return (
                    <div
                        key={info.gameId}
                        style={{
                            border: "1px solid #ddd",
                            margin: "10px 0",
                            padding: "10px",
                            borderRadius: "8px",
                            background: me?.win ? "#e6ffe6" : "#ffe6e6",
                        }}
                    >
                        <b>{me?.championName}</b>
                        <p>{me?.win ? "VICTORIA" : "SCONFITTA"}</p>
                        <p>
                            KDA: {me?.kills}/{me?.deaths}/{me?.assists}
                        </p>
                        <p>Durata: {Math.floor(info.gameDuration / 60)} min</p>
                    </div>
                );
            })}
        </div>
    );
}