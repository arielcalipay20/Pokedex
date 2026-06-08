import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import PokemonCard from "./PokemonCard";

// --- Mock data ---
const mockPokemon = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  sprites: {
    front_default: "https://example.com/bulbasaur.png",
    other: {
      "official-artwork": {
        front_default: "https://example.com/bulbasaur.png",
      },
    },
  },
  types: [
    {
      slot: 1,
      type: { name: "grass", url: "https://pokeapi.co/api/v2/type/12/" },
    },
    {
      slot: 2,
      type: { name: "poison", url: "https://pokeapi.co/api/v2/type/4/" },
    },
  ],
  stats: [],
  abilities: [],
};

const renderComponent = () =>
  render(
    <MemoryRouter>
      <PokemonCard pokemon={mockPokemon} />
    </MemoryRouter>,
  );

// --- Tests ---
describe("PokemonCard", () => {
  it("renders pokemon name", () => {
    renderComponent();
    expect(
      screen.getByRole("heading", { name: /bulbasaur/i }),
    ).toBeInTheDocument();
  });

  it("renders pokemon id padded to 4 digits", () => {
    renderComponent();
    expect(screen.getByText(/#0001/)).toBeInTheDocument();
  });

  it("renders pokemon image with correct src and alt", () => {
    renderComponent();
    const img = screen.getByAltText(/bulbasaur/i);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "https://example.com/bulbasaur.png");
  });

  it("renders pokemon types", () => {
    renderComponent();
    expect(screen.getByText("grass")).toBeInTheDocument();
    expect(screen.getByText("poison")).toBeInTheDocument();
  });

  it("calls onClick with pokemon id when card is clicked", () => {
    const handleClick = vi.fn();
    render(<PokemonCard pokemon={mockPokemon} onClick={handleClick} />);

    fireEvent.click(screen.getByText(/bulbasaur/i));

    expect(handleClick).toHaveBeenCalledWith(1);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <PokemonCard
        pokemon={mockPokemon}
        onClick={handleClick}
        disabled={true}
      />,
    );

    fireEvent.click(screen.getByText(/bulbasaur/i));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies disabled styles when disabled", () => {
    const { container } = render(
      <PokemonCard pokemon={mockPokemon} disabled={true} />,
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("cursor-not-allowed");
    expect(card.className).toContain("opacity-50");
    expect(card.className).not.toContain("card");
  });

  it("applies card styles when not disabled", () => {
    const { container } = render(
      <PokemonCard pokemon={mockPokemon} disabled={false} />,
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain("card");
    expect(card.className).not.toContain("cursor-not-allowed");
  });

  it("does not call onClick when onClick is not provided", () => {
    expect(() => {
      renderComponent();
    }).not.toThrow();

    expect(() => {
      fireEvent.click(screen.getByText(/bulbasaur/i));
    }).not.toThrow();
  });

  it("renders single type correctly", () => {
    const singleTypePokemon = {
      ...mockPokemon,
      types: [
        {
          slot: 1,
          type: { name: "fire", url: "https://pokeapi.co/api/v2/type/10/" },
        },
      ],
    };
    render(<PokemonCard pokemon={singleTypePokemon} />);
    expect(screen.getByText("fire")).toBeInTheDocument();
  });
});
