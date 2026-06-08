import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect } from "vitest";
import PokemonSearch from "./PokemonSearch";

const renderComponent = () =>
  render(
    <MemoryRouter>
      <PokemonSearch value="" onChange={vi.fn()} />
    </MemoryRouter>,
  );

// --- Tests ---
describe("PokemonSearch", () => {
  it("renders the input", () => {
    renderComponent();
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
  });

  it("renders the placeholder", () => {
    const placeholderText = "Search for a Pokémon...";
    render(
      <MemoryRouter>
        <PokemonSearch
          value=""
          onChange={vi.fn()}
          placeholder={placeholderText}
        />
      </MemoryRouter>,
    );
    const input = screen.getByPlaceholderText(placeholderText);
    expect(input).toBeInTheDocument();
  });

  it("renders without placeholder when not provided", () => {
    renderComponent();
    const input = screen.getByRole("textbox");
    expect(input).not.toHaveAttribute("placeholder");
  });

  it("renders the current value", () => {
    const searchTerm = "bulbasaur";
    render(
      <MemoryRouter>
        <PokemonSearch value={searchTerm} onChange={vi.fn()} />
      </MemoryRouter>,
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe(searchTerm);
  });

  it("calls onChange when user types", () => {
    const handleChange = vi.fn();
    render(<PokemonSearch value="" onChange={handleChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "char" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("calls onChange with the correct event", () => {
    const handleChange = vi.fn();
    render(<PokemonSearch value="" onChange={handleChange} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "bulbasaur" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders as a controlled input", () => {
    const { rerender } = render(
      <PokemonSearch value="bulba" onChange={vi.fn()} />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("bulba");

    rerender(<PokemonSearch value="bulbasaur" onChange={vi.fn()} />);
    expect(input.value).toBe("bulbasaur");
  });
});
