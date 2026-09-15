import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ActivityTile from "../components/ActivityTile";
import type { Activity } from "../types/Player";

const activity: Activity = {
  id: 1,
  name: "Zulrah",
  rank: 500,
  score: 25,
};

describe("ActivityTile", () => {
  it("displays the activity name and score", () => {
    render(<ActivityTile activity={activity} />);

    expect(screen.getByText("Zulrah")).toBeInTheDocument();
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("displays the activity icon", () => {
  render(<ActivityTile activity={activity} />);

  expect(screen.getByAltText("Zulrah icon")).toBeInTheDocument();
  });

  it("uses a smaller font size for long activity names", () => {
  const longActivity: Activity = {
    id: 2,
    name: "A Very Long Activity Name",
    rank: 100,
    score: 10,
  };

  render(<ActivityTile activity={longActivity} />);

  expect(screen.getByText("A Very Long Activity Name")).toHaveStyle({
    fontSize: "14px",
  });
  }); 

  it("uses the normal font size for short activity names", () => {
  render(<ActivityTile activity={activity} />);

  expect(screen.getByText("Zulrah")).toHaveStyle({
    fontSize: "20px",
  });
});
});