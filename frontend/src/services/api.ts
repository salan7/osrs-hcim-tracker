export function getPlayers() {
  return fetch("http://127.0.0.1:5000/api/players")
    .then((response) => response.json());
}

export function updatePlayer(playerName: string) {
  return fetch(
    `http://127.0.0.1:5000/api/players/${playerName}/update`,
    {
      method: "POST",
    }
  ).then((response) => response.json());
}