import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

const { mockUpdatePlayer } = vi.hoisted(() => ({
  mockUpdatePlayer: vi.fn(),
}));

vi.mock("../services/api", () => ({
  getPlayers: vi.fn().mockResolvedValue([
  {
    id: 1,
    name: "PlayerOne",
    hcim_rank: 100,
    skills: [],
    activities: [],
  },
  {
    id: 2,
    name: "BobTheIron",
    hcim_rank: 200,
    skills: [],
    activities: [],
  },
  ]), 
  updatePlayer: mockUpdatePlayer,
}));

import Home from "../pages/Home";

describe("Home", () => {
  it("fetches and displays players", async () => {
    render(<Home searchQuery="" />);

    await waitFor(() => {
      expect(screen.getByText("PlayerOne")).toBeInTheDocument();
    });
  });

  it("displays the loading indicator while players are loading", async () => {
  render(<Home searchQuery="" />);

  expect(
    screen.getByLabelText("Loading players")
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText("PlayerOne")).toBeInTheDocument();
  });
  });

 it("only displays players matching the search query", async () => {
  render(<Home searchQuery="bob" />);

  await waitFor(() => {
    expect(screen.getByText("BobTheIron")).toBeInTheDocument();
  });

  expect(screen.queryByText("PlayerOne")).not.toBeInTheDocument();
  });

  it("calls updatePlayer when a player is clicked", async () => {
  mockUpdatePlayer.mockResolvedValue({
    player: {
      id: 1,
      name: "PlayerOne",
      hcim_rank: 100,
      skills: [],
      activities: [],
    },
    changes: null,
  });

  render(<Home searchQuery="" />);

  await waitFor(() => {
    expect(screen.getByText("PlayerOne")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("PlayerOne"));

  await waitFor(() => {
  expect(mockUpdatePlayer).toHaveBeenCalledWith("PlayerOne");
    });
  });

  it("opens the player dialog with the updated player", async () => {
  mockUpdatePlayer.mockResolvedValue({
    player: {
      id: 1,
      name: "PlayerOne",
      hcim_rank: 50,
      skills: [],
      activities: [],
    },
    changes: null,
  });

  render(<Home searchQuery="" />);

  await waitFor(() => {
    expect(screen.getByText("PlayerOne")).toBeInTheDocument();
  });

 fireEvent.click(screen.getByText("PlayerOne"));

  await waitFor(() => {
    expect(screen.getByText("HCIM Rank: 50")).toBeInTheDocument();
  });
  });

  it("displays changes returned from the player update", async () => {
  mockUpdatePlayer.mockResolvedValue({
    player: {
      id: 1,
      name: "PlayerOne",
      hcim_rank: 50,
      skills: [],
      activities: [],
    },
    changes: {
      skills: [
        {
          id: 7,
          name: "Fishing",
          xp_gained: 5000,
          old_level: 76,
          new_level: 77,
        },
      ],
      activities: [],
    },
  });

  render(<Home searchQuery="" />);

  await waitFor(() => {
    expect(screen.getByText("PlayerOne")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("PlayerOne"));

  await waitFor(() => {
    expect(screen.getByText("Fishing: +5000 XP")).toBeInTheDocument();
  });
  });

  it("closes the player dialog when it is closed", async () => {
  mockUpdatePlayer.mockResolvedValue({
    player: {
      id: 1,
      name: "PlayerOne",
      hcim_rank: 50,
      skills: [],
      activities: [],
    },
    changes: null,
  });

  render(<Home searchQuery="" />);

  await waitFor(() => {
    expect(screen.getByText("PlayerOne")).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText("PlayerOne"));

  await waitFor(() => {
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  fireEvent.keyDown(screen.getByRole("dialog"), {
    key: "Escape",
    code: "Escape",
  });

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  });
});