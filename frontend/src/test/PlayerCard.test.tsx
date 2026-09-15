import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import PlayerCard from "../components/PlayerCard";
import type { Player } from "../types/Player";

describe("PlayerCard", () => {
  it("renders the player's name and rank", () => {
    const player: Player = {
      id: 1,
      name: "PlayerOne",
      hcim_rank: 42,
      skills: [],
      activities: [],
    };

    render(
      <PlayerCard
        player={player}
        onClick={vi.fn()}
        loading={false}
        disabled={false}
      />
    );

    expect(screen.getByText("PlayerOne")).toBeInTheDocument();
    expect(screen.getByText("Rank: 42")).toBeInTheDocument();
  });

  it("displays N/A when the player's rank is null", () => {
  const player: Player = {
    id: 1,
    name: "PlayerOne",
    hcim_rank: null,
    skills: [],
    activities: [],
  };

  render(
    <PlayerCard
      player={player}
      onClick={vi.fn()}
      loading={false}
      disabled={false}
    />
  );

  expect(screen.getByText("Rank: N/A")).toBeInTheDocument();
});

  it("calls onClick when the card is clicked", async () => {
    const player: Player = {
      id: 1,
      name: "PlayerOne",
      hcim_rank: 42,
      skills: [],
      activities: [],
    };

    const handleClick = vi.fn();

    render(
      <PlayerCard
        player={player}
        onClick={handleClick}
        loading={false}
        disabled={false}
      />
    );

    const card = screen.getByText("PlayerOne");

    card.click();

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it("does not call onClick when the card is disabled", () => {
  const player: Player = {
    id: 1,
    name: "PlayerOne",
    hcim_rank: 42,
    skills: [],
    activities: [],
  };

  const handleClick = vi.fn();

  render(
    <PlayerCard
      player={player}
      onClick={handleClick}
      loading={false}
      disabled={true}
    />
  );

  const card = screen.getByText("PlayerOne");

  card.click();

  expect(handleClick).not.toHaveBeenCalled();
  });

  it("shows the loading indicator when loading", () => {
  const player: Player = {
    id: 1,
    name: "PlayerOne",
    hcim_rank: 42,
    skills: [],
    activities: [],
  };

  render(
    <PlayerCard
      player={player}
      onClick={vi.fn()}
      loading={true}
      disabled={false}
    />
  );

  expect(
    screen.getByLabelText("Updating player")
  ).toBeInTheDocument();
  });

  it("does not show the loading indicator when not loading", () => {
  const player: Player = {
    id: 1,
    name: "PlayerOne",
    hcim_rank: 42,
    skills: [],
    activities: [],
  };

  render(
    <PlayerCard
      player={player}
      onClick={vi.fn()}
      loading={false}
      disabled={false}
    />
  );

  expect(
    screen.queryByLabelText("Updating player")
  ).not.toBeInTheDocument();
});
});