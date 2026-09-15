const API_URL = import.meta.env.VITE_API_URL;

export function getPlayers() {
  return fetch(`${API_URL}/api/players`)
    .then((response) => response.json());
}

export function updatePlayer(playerName: string) {
  return fetch(
    `${API_URL}/api/players/${playerName}/update`,
    { method: "POST" }
  ).then((response) => response.json());
}