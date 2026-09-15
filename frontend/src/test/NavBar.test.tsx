import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "../components/NavBar";

describe("NavBar", () => {
  it("displays the title and search box", () => {
    render(
      <NavBar
        searchQuery=""
        setSearchQuery={vi.fn()}
      />
    );

    expect(screen.getByText("OSRS HCIM Tracker")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search for a player name...")
    ).toBeInTheDocument();
  });

  it("calls setSearchQuery when the user types in the search box", () => {
  const setSearchQuery = vi.fn();

  render(
    <NavBar
      searchQuery=""
      setSearchQuery={setSearchQuery}
    />
  );

  const searchInput = screen.getByPlaceholderText(
    "Search for a player name..."
  );

  fireEvent.change(searchInput, {
    target: { value: "PlayerOne" },
  });

  expect(setSearchQuery).toHaveBeenCalledWith("PlayerOne");
  });

  it("displays the current search query", () => {
  render(
    <NavBar
      searchQuery="PlayerOne"
      setSearchQuery={vi.fn()}
    />
  );

  const searchInput = screen.getByPlaceholderText(
    "Search for a player name..."
  );

  expect(searchInput).toHaveValue("PlayerOne");
  });

  it("has a search accessibility label", () => {
  render(
    <NavBar
      searchQuery=""
      setSearchQuery={vi.fn()}
    />
  );

  expect(screen.getByRole("textbox", { name: "search" })).toBeInTheDocument();
  });
});