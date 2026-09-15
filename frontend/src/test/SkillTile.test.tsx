import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SkillTile from "../components/SkillTile";
import type { Skill } from "../types/Player";

const skill: Skill = {
  id: 7,
  name: "Fishing",
  rank: 1234,
  level: 77,
  xp: 1000000,
};

describe("SkillTile", () => {
  it("displays the skill name and level", () => {
    render(<SkillTile skill={skill} />);

    expect(screen.getByText("Fishing")).toBeInTheDocument();
    expect(screen.getByText("77")).toBeInTheDocument();
  });

  it("displays 99 as the maximum level for normal skills", () => {
  render(<SkillTile skill={skill} />);

  expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("displays 2376 as the maximum level for Overall", () => {
  const overallSkill: Skill = {
    id: 0,
    name: "Overall",
    rank: 10,
    level: 2376,
    xp: 3253198076,
  };

  render(<SkillTile skill={overallSkill} />);

  expect(screen.getAllByText("2376")).toHaveLength(2);
  });

  it("displays the skill icon", () => {
  render(<SkillTile skill={skill} />);

  expect(screen.getByAltText("Fishing icon")).toBeInTheDocument();
  });
});