import { useState, useEffect } from "react";

export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/summoners", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then(setData);
    }, []);

    if (!data) return <h2>Caricamento...</h2>;

    return (
    <div style={{ padding: "20px" }}>
        {data.map((player) => (
            <div key={player.discordId}>
                <h1>
                    {player.account.gameName}#{player.account.tagLine}
                </h1>

                <h2>Rank</h2>
                <p>{player.rank?.tier || "UNRANKED"}</p>

                <h2>Level</h2>
                <p>{player.summoner.summonerLevel}</p>

                <hr />
            </div>
        ))}
    </div>
);
}