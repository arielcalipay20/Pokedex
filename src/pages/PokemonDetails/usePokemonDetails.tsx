import { AppLabels } from "@/defaultProps/label";
import { Pokemon } from "@/types/pokemon";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface usePokemonDetailsProps {
  labels: AppLabels["detailsPage"];
}

interface FlavorTextEntry {
  flavor_text: string;
  language: {
    name: string;
  };
}

interface Genus {
  genus: string;
  language: {
    name: string;
  };
}

interface EvolutionChainLink {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
}

interface SpeciesData {
  flavor_text_entries: FlavorTextEntry[];
  genera: Genus[];
  habitat: {
    name: string;
  } | null;
  evolution_chain: {
    url: string;
  };
}

interface EvolutionData {
  chain: EvolutionChainLink;
}

const usePokemonDetails = ({ labels }: usePokemonDetailsProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [description, setDescription] = useState<string>("");
  const [habitat, setHabitat] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [evolutionChain, setEvolutionChain] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      setLoading(true);
      try {
        //fetch pokemon data
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data: Pokemon = await res.json();
        setPokemon(data);

        //fetch species for evolution, category, habitat, and description
        const speciesRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`,
        );
        const speciesData: SpeciesData = await speciesRes.json();

        //fetch english description
        const flavorText = speciesData.flavor_text_entries.find(
          (entry) => entry.language.name === "en",
        );
        if (flavorText) {
          //remove special characters
          const cleanText = flavorText.flavor_text.replace(/\f|\n/g, " ");
          setDescription(cleanText);
        }

        //fetch category
        const genus = speciesData.genera.find((g) => g.language.name === "en");
        if (genus) {
          setCategory(genus.genus);
        }

        //fetch habitat
        const habitatData = speciesData.habitat?.name ?? "Unknown";
        setHabitat(habitatData);

        //parse evolution
        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData: EvolutionData = await evolutionRes.json();

        const evolutions: Pokemon[] = [];
        let current: EvolutionChainLink | undefined = evolutionData.chain;

        while (current) {
          const pokemonId = current.species.url
            .split("/")
            .filter(Boolean)
            .pop();
          const pokemonRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
          );
          const pokemonData: Pokemon = await pokemonRes.json();
          evolutions.push(pokemonData);
          //next evolution
          current = current.evolves_to[0];
        }
        setEvolutionChain(evolutions);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPokemonDetails();
  }, [id]);

  const handleBack = (): void => {
    navigate("/");
  };

  const handleEvolutionClick = (evolutionId: number): void => {
    navigate(`/pokemon/${evolutionId}`);
  };

  return {
    pokemon,
    description,
    habitat,
    category,
    evolutionChain,
    loading,
    handleBack,
    handleEvolutionClick,
    labels,
  };
};

export default usePokemonDetails;
