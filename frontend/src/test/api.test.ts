import { describe, it, expect, vi } from "vitest";
import { getPlayers, updatePlayer } from "../services/api";

describe("getPlayers", () => {
  it("returns players from the API", async () => {
    const mockPlayers = [
      {
        id: 1,
        name: "PlayerOne",
        hcim_rank: 1,
        skills: [],
        activities: [],
      },
    ];

    const mockFetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockPlayers),
      })
    );

    vi.stubGlobal("fetch", mockFetch);

    const players = await getPlayers();

    expect(players).toEqual(mockPlayers);

    expect(mockFetch).toHaveBeenCalledWith(
      "http://127.0.0.1:5000/api/players"
    );
  });
});

it("updates a player", async () => {
  const mockResponse = {
    player: {
      id: 1,
      name: "PlayerOne",
      hcim_rank: 1,
      skills: [],
      activities: [],
    },
    changes: {
      skills: [],
      activities: [],
    },
  };

  const mockFetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockResponse),
    })
  );

  vi.stubGlobal("fetch", mockFetch);

  const response = await updatePlayer("PlayerOne");

  expect(response).toEqual(mockResponse);

  expect(mockFetch).toHaveBeenCalledWith(
    expect.stringContaining("/api/players/PlayerOne/update"),
    { method: "POST" }
  );
});

it("uses the correct player name in the update URL", async () => {
  const mockFetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({}),
    })
  );

  vi.stubGlobal("fetch", mockFetch);

  await updatePlayer("IronPlayer");

  expect(mockFetch).toHaveBeenCalledWith(
    expect.stringContaining("/api/players/IronPlayer/update"),
    { method: "POST" }
  );
});