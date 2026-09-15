import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PlayerDialog from "../components/PlayerDialog";
import type { Player } from "../types/Player";

const player: Player = {
  id: 1,
  name: "PlayerOne",
  hcim_rank: 42,
  skills: [],
  activities: [],
};

describe("PlayerDialog", () => {
  it("displays the player's name and rank when open", () => {
    render(
      <PlayerDialog
        player={player}
        changes={null}
        open={true}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("PlayerOne")).toBeInTheDocument();
    expect(screen.getByText("HCIM Rank: 42")).toBeInTheDocument();
  });

  it("does not display the dialog when closed", () => {
  render(
    <PlayerDialog
      player={player}
      changes={null}
      open={false}
      onClose={vi.fn()}
    />
  );

  expect(screen.queryByText("PlayerOne")).not.toBeInTheDocument();
  });

  it("calls onClose when the dialog is closed", async () => {
  const onClose = vi.fn();

  render(
    <PlayerDialog
      player={player}
      changes={null}
      open={true}
      onClose={onClose}
    />
  );

  const dialog = screen.getByRole("dialog");

  expect(dialog).toBeInTheDocument();

  fireEvent.keyDown(dialog, {
    key: "Escape",
    code: "Escape",
  });

  await waitFor(() => {
    expect(onClose).toHaveBeenCalled();
  });
});

  it("displays the player's skills", () => {
  const playerWithSkill: Player = {
    ...player,
    skills: [
      {
        id: 7,
        name: "Fishing",
        rank: 1234,
        level: 77,
        xp: 1000000,
      },
    ],
  };

  render(
    <PlayerDialog
      player={playerWithSkill}
      changes={null}
      open={true}
      onClose={vi.fn()}
    />
  );

  expect(screen.getByText("Fishing")).toBeInTheDocument();
  }); 

  it("displays the overall skill", () => {
  const playerWithOverall: Player = {
    ...player,
    skills: [
      {
        id: 0,
        name: "Overall",
        rank: 10,
        level: 2376,
        xp: 3253198076,
      },
    ],
  };

  render(
    <PlayerDialog
      player={playerWithOverall}
      changes={null}
      open={true}
      onClose={vi.fn()}
    />
  );

  expect(screen.getByText("Overall")).toBeInTheDocument();
  });

  it("displays the player's activities", () => {
  const playerWithActivity: Player = {
    ...player,
    activities: [
      {
        id: 1,
        name: "Bosses",
        rank: 500,
        score: 25,
      },
    ],
  };

  render(
    <PlayerDialog
      player={playerWithActivity}
      changes={null}
      open={true}
      onClose={vi.fn()}
    />
  );

  expect(screen.getByText("Bosses")).toBeInTheDocument();
  });

  it("displays skill XP changes", () => {
  const changes = {
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
  };

  render(
    <PlayerDialog
      player={player}
      changes={changes}
      open={true}
      onClose={vi.fn()}
    />
  );

  expect(screen.getByText("Fishing: +5000 XP")).toBeInTheDocument();
  });

  it("displays activity score changes", () => {
  const changes = {
    skills: [],
    activities: [
      {
        id: 1,
        name: "Zulrah",
        score_gained: 25,
      },
    ],
  };

  render(
    <PlayerDialog
      player={player}
      changes={changes}
      open={true}
      onClose={vi.fn()}
    />
  );

  expect(screen.getByText("Zulrah: +25")).toBeInTheDocument();
  });

  it("displays multiple skill and activity changes", () => {
  const changes = {
    skills: [
      {
        id: 7,
        name: "Fishing",
        xp_gained: 5000,
        old_level: 76,
        new_level: 77,
      },
      {
        id: 8,
        name: "Cooking",
        xp_gained: 3000,
        old_level: 75,
        new_level: 76,
      },
    ],
    activities: [
      {
        id: 1,
        name: "Zulrah",
        score_gained: 25,
      },
      {
        id: 2,
        name: "Vorkath",
        score_gained: 10,
      },
    ],
  };

  render(
    <PlayerDialog
      player={player}
      changes={changes}
      open={true}
      onClose={vi.fn()}
    />
  );

  expect(screen.getByText("Fishing: +5000 XP")).toBeInTheDocument();
  expect(screen.getByText("Cooking: +3000 XP")).toBeInTheDocument();
  expect(screen.getByText("Zulrah: +25")).toBeInTheDocument();
  expect(screen.getByText("Vorkath: +10")).toBeInTheDocument();
  });

  it("does not display changes when changes is null", () => {
  render(
    <PlayerDialog
      player={player}
      changes={null}
      open={true}
      onClose={vi.fn()}
    />
  );

  expect(screen.queryByText(/XP/)).not.toBeInTheDocument();
  });

  it("does not display the overall skill in the normal skills section", () => {
  const playerWithSkills: Player = {
    ...player,
    skills: [
      {
        id: 0,
        name: "Overall",
        rank: 10,
        level: 2376,
        xp: 3253198076,
      },
      {
        id: 7,
        name: "Fishing",
        rank: 1234,
        level: 77,
        xp: 1000000,
      },
    ],
  };

  render(
    <PlayerDialog
      player={playerWithSkills}
      changes={null}
      open={true}
      onClose={vi.fn()}
    />
  );

  expect(screen.getByText("Overall")).toBeInTheDocument();
  expect(screen.getByText("Fishing")).toBeInTheDocument();
  });

});