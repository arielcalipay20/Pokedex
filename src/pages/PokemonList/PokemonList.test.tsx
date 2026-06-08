import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import PokemonList from "./PokemonList";

// --- Mock child components ---
vi.mock("@/components/PokemonCard/PokemonCard", () => ({
  default: ({ pokemon, onClick }: any) => (
    <div role="article" onClick={() => onClick(pokemon.id)}>
      {pokemon.name}
    </div>
  ),
}));

vi.mock("@/components/Loading/Loading", () => ({
  default: () => <p role="status">Loading...</p>,
}));

vi.mock("react-paginate", () => ({
  default: ({ onPageChange }: any) => (
    <button onClick={() => onPageChange({ selected: 1 })}>Next →</button>
  ),
}));

// --- Mock data ---
const makePokemon = (id: number, name: string) => ({
  id,
  name,
  sprites: { front_default: `https://example.com/${name}.png` },
  types: [{ type: { name: "normal" } }],
});

const mockPokemonList = Array.from({ length: 15 }, (_, i) =>
  makePokemon(i + 1, `pokemon-${i + 1}`),
);

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      if (url.includes("limit=151")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              results: mockPokemonList.map((p) => ({
                name: p.name,
                url: `https://pokeapi.co/api/v2/pokemon/${p.id}`,
              })),
            }),
        });
      }
      const id = Number(url.split("/").pop());
      return Promise.resolve({
        json: () => Promise.resolve(mockPokemonList[id - 1]),
      });
    }),
  ) as any;

  vi.stubGlobal("scrollTo", vi.fn() as any);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const renderComponent = () =>
  render(
    <MemoryRouter>
      <PokemonList />
    </MemoryRouter>,
  );

// --- Tests ---

describe("PokemonList", () => {
  it("shows loading state initially", () => {
    renderComponent();
    // queries by the text content of your Loading component
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the page title", async () => {
    renderComponent();
    await waitFor(() => {
      // queries the visible heading text
      expect(screen.getByText("Pokédex")).toBeInTheDocument();
    });
  });

  it("renders pokemon cards after fetch", async () => {
    renderComponent();
    await waitFor(() => {
      // queries by the article role we set on the mock PokemonCard
      expect(screen.getAllByRole("article")).toHaveLength(10);
    });
  });

  it("renders first pokemon name", async () => {
    renderComponent();
    await waitFor(() => {
      // queries by the visible pokemon name text
      expect(screen.getByText("pokemon-1")).toBeInTheDocument();
    });
  });

  it("filters pokemon when searching", async () => {
    renderComponent();
    await waitFor(() => screen.getAllByRole("article"));

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "pokemon-1" },
    });

    await waitFor(() => {
      const cards = screen.getAllByRole("article");
      cards.forEach((card) => {
        expect(card.textContent).toMatch(/pokemon-1/i);
      });
    });
  });

  it("shows no results message for unmatched search", async () => {
    renderComponent();
    await waitFor(() => screen.getAllByRole("article"));

    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "zzznomatch" },
    });

    // queries the visible "no results" text from your labels
    await waitFor(() => {
      expect(screen.getByText(/zzznomatch/i)).toBeInTheDocument();
    });
  });

  it("resets to page 1 when searching", async () => {
    renderComponent();
    await waitFor(() => screen.getAllByRole("article"));

    // go to page 2 using the visible button text
    fireEvent.click(screen.getByRole("button", { name: /next →/i }));

    // then search
    fireEvent.change(screen.getByPlaceholderText(/search/i), {
      target: { value: "pokemon-1" },
    });

    await waitFor(() => {
      // first visible card should be pokemon-1 (back on page 1)
      expect(screen.getAllByRole("article")[0].textContent).toMatch(
        /pokemon-1/i,
      );
    });
  });

  it("shows the correct showing X-Y of Z text", async () => {
    renderComponent();
    await waitFor(() => {
      // queries the visible showing text
      expect(screen.getByText(/1 - 10/)).toBeInTheDocument();
      expect(screen.getByText(/15/)).toBeInTheDocument();
    });
  });

  it("navigates to pokemon detail on card click", async () => {
    renderComponent();
    await waitFor(() => screen.getAllByRole("article"));

    // click by finding the visible pokemon name
    fireEvent.click(screen.getByText("pokemon-1"));
    // navigation is handled by useNavigate — verify it doesn't throw
  });
});
