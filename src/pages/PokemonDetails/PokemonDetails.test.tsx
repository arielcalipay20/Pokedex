import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import PokemonDetails from "./PokemonDetails";

// --- Mock child components ---
vi.mock("@/components/Loading/Loading", () => ({
  default: () => <p role="status">Loading...</p>,
}));

vi.mock("@/components/PokemonCard/PokemonCard", () => ({
  default: ({ pokemon, onClick, disabled }: any) => (
    <div
      role="article"
      onClick={() => !disabled && onClick(pokemon.id)}
      aria-disabled={disabled}
    >
      {pokemon.name}
    </div>
  ),
}));

// --- Mock data ---
const mockPokemon = {
  id: 1,
  name: "bulbasaur",
  height: 7,
  weight: 69,
  sprites: {
    other: {
      "official-artwork": {
        front_default: "https://example.com/bulbasaur.png",
      },
    },
  },
  stats: [
    { stat: { name: "hp" }, base_stat: 45 },
    { stat: { name: "attack" }, base_stat: 49 },
  ],
  types: [{ type: { name: "grass" } }, { type: { name: "poison" } }],
  abilities: [
    { ability: { name: "overgrow" } },
    { ability: { name: "chlorophyll" } },
  ],
};

const mockSpeciesData = {
  flavor_text_entries: [
    {
      flavor_text: "A strange seed was\nplanted on its back.",
      language: { name: "en" },
    },
  ],
  genera: [{ genus: "Seed Pokémon", language: { name: "en" } }],
  habitat: { name: "grassland" },
  evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/1/" },
};

const mockEvolutionData = {
  chain: {
    species: {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon-species/1/",
    },
    evolves_to: [
      {
        species: {
          name: "ivysaur",
          url: "https://pokeapi.co/api/v2/pokemon-species/2/",
        },
        evolves_to: [],
      },
    ],
  },
};

const mockIvysaur = {
  id: 2,
  name: "ivysaur",
  height: 10,
  weight: 130,
  sprites: {
    other: {
      "official-artwork": {
        front_default: "https://example.com/ivysaur.png",
      },
    },
  },
  stats: [{ stat: { name: "hp" }, base_stat: 60 }],
  types: [{ type: { name: "grass" } }],
  abilities: [{ ability: { name: "overgrow" } }],
};

// --- Mock fetch ---
beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string) => {
      // pokemon detail
      if (url === "https://pokeapi.co/api/v2/pokemon/1") {
        return Promise.resolve({ json: () => Promise.resolve(mockPokemon) });
      }
      // species
      if (url === "https://pokeapi.co/api/v2/pokemon-species/1") {
        return Promise.resolve({
          json: () => Promise.resolve(mockSpeciesData),
        });
      }
      // evolution chain
      if (url === "https://pokeapi.co/api/v2/evolution-chain/1/") {
        return Promise.resolve({
          json: () => Promise.resolve(mockEvolutionData),
        });
      }
      // bulbasaur via evolution chain
      if (url === "https://pokeapi.co/api/v2/pokemon/1") {
        return Promise.resolve({ json: () => Promise.resolve(mockPokemon) });
      }
      // ivysaur via evolution chain
      if (url === "https://pokeapi.co/api/v2/pokemon/2") {
        return Promise.resolve({ json: () => Promise.resolve(mockIvysaur) });
      }

      return Promise.reject(new Error(`Unhandled fetch: ${url}`));
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// --- Render helper ---
// PokemonDetails uses useParams to get the id
// so we need to render it inside a Route with the id param
const renderComponent = () =>
  render(
    <MemoryRouter initialEntries={["/pokemon/1"]}>
      <Routes>
        <Route path="/pokemon/:id" element={<PokemonDetails />} />
      </Routes>
    </MemoryRouter>,
  );

// --- Tests ---
describe("PokemonDetails", () => {
  it("shows loading state initially", () => {
    renderComponent();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders pokemon name and id after fetch", async () => {
    renderComponent();
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /bulbasaur/i }),
      ).toBeInTheDocument();
      expect(screen.getByText(/#0001/i)).toBeInTheDocument();
    });
  });

  it("renders the pokemon image", async () => {
    renderComponent();
    await waitFor(() => {
      const img = screen.getByAltText(/bulbasaur/i);
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute(
        "src",
        mockPokemon.sprites.other["official-artwork"].front_default,
      );
    });
  });

  it("renders the english description", async () => {
    renderComponent();
    await waitFor(() => {
      // special characters are cleaned — \n replaced with space
      expect(
        screen.getByText(/A strange seed was planted on its back/i),
      ).toBeInTheDocument();
    });
  });

  it("renders height and weight", async () => {
    renderComponent();
    await waitFor(() => {
      // height: 7 / 10 = 0.7m, weight: 69 / 10 = 6.9kg
      expect(screen.getByText(/0\.7/)).toBeInTheDocument();
      expect(screen.getByText(/6\.9/)).toBeInTheDocument();
    });
  });

  it("renders habitat and category", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/grassland/i)).toBeInTheDocument();
      expect(screen.getByText(/seed pokémon/i)).toBeInTheDocument();
    });
  });

  it("renders pokemon types", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText("grass")).toBeInTheDocument();
      expect(screen.getByText("poison")).toBeInTheDocument();
    });
  });

  it("renders pokemon abilities", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/overgrow/i)).toBeInTheDocument();
      expect(screen.getByText(/chlorophyll/i)).toBeInTheDocument();
    });
  });

  it("renders stats with progress bars", async () => {
    renderComponent();
    await waitFor(() => {
      expect(screen.getByText(/hp/i)).toBeInTheDocument();
      expect(screen.getByText(/attack/i)).toBeInTheDocument();
      expect(screen.getByText("45")).toBeInTheDocument();
      expect(screen.getByText("49")).toBeInTheDocument();
    });
  });

  it("renders evolution chain", async () => {
    renderComponent();
    await waitFor(() => {
      const evolutionCards = screen.getAllByRole("article");
      expect(evolutionCards).toHaveLength(2);
      expect(screen.getByText(/ivysaur/i)).toBeInTheDocument();
    });
  });

  it("current pokemon card is disabled in evolution chain", async () => {
    renderComponent();
    await waitFor(() => {
      const cards = screen.getAllByRole("article");
      // bulbasaur is the current pokemon (id: 1) — should be disabled
      const bulbasaurCard = cards.find((c) => c.textContent === "bulbasaur");
      expect(bulbasaurCard).toHaveAttribute("aria-disabled", "true");
    });
  });

  it("navigates to evolution pokemon on click", async () => {
    renderComponent();
    await waitFor(() => screen.getAllByRole("article"));

    // ivysaur is not disabled — clicking should navigate
    fireEvent.click(screen.getByText(/ivysaur/i));
    // navigation happens without throwing
  });

  it("navigates back on back button click", async () => {
    renderComponent();
    await waitFor(() => screen.getByText("Explore Pokémon"));

    fireEvent.click(screen.getByRole("button", { name: /explore/i }));
    // navigate("/") is called — verify it doesn't throw
  });
});
