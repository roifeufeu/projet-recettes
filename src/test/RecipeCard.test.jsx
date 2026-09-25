// @vitest-environment jsdom

import { afterEach, describe, expect, it } from "vitest";
import {
  cleanup,
  render,
  screen,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

import RecipeCard from "../components/RecipeCard";

afterEach(() => {
  cleanup();
});

describe("RecipeCard", () => {
  it("affiche les informations de la recette", () => {
    render(
      <MemoryRouter>
        <RecipeCard
          id={123}
          name="Lasagnes"
          image="https://example.com/lasagnes.jpg"
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("heading", { name: "Lasagnes" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("img", { name: "Lasagnes" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Détails →"),
    ).toBeInTheDocument();
  });

  it("redirige vers la bonne recette", () => {
    render(
      <MemoryRouter>
        <RecipeCard
          id={123}
          name="Lasagnes"
          image="https://example.com/lasagnes.jpg"
        />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link"),
    ).toHaveAttribute("href", "/recipe/123");
  });
});