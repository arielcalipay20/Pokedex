import { Pokemon } from "@/types/pokemon";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLabels } from "@/defaultProps/label";

interface usePokemonSearchProps {
  labels: AppLabels["search" | "homePage"];
}

interface PokemonListResult {
  name: string;
  url: string;
}

const usePokemonList = ({ labels }: usePokemonSearchProps) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const pokemonPerPage = 10;

  useEffect(() => {
    const fetchAllPokemon = async () => {
      setLoading(true);
      try {
        // 1 call to get all 151 URLs
        const res = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0",
        );
        const { results }: { results: PokemonListResult[] } = await res.json();

        // Then fetch details in parallel using the API-provided URLs
        const pokemonData = await Promise.all(
          results.map((p: PokemonListResult) =>
            fetch(p.url).then((r) => r.json()),
          ),
        );
        setPokemon(pokemonData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPokemon();
  }, []);

  //navigate to pokemon details page
  const handleClickPokemon = (id: number) => {
    navigate(`/pokemon/${id}`);
  };

  //filter pokemon based on search term
  const filteredPokemon = pokemon.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  //calculate current pokemon from filtered results
  const offset = currentPage * pokemonPerPage;
  const currentPokemon = filteredPokemon.slice(offset, offset + pokemonPerPage);
  const pageCount = Math.ceil(filteredPokemon.length / pokemonPerPage);

  //handle page change
  const handlePageClick = (event: { selected: number }): void => {
    setCurrentPage(event.selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //handle search page and reset to page 1
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
    //reset to first page
    setCurrentPage(0);
  };

  return {
    pokemonPerPage,
    handleClickPokemon,
    pokemon,
    loading,
    currentPage,
    searchTerm,
    filteredPokemon,
    currentPokemon,
    offset,
    pageCount,
    handlePageClick,
    handleSearchChange,
    labels,
  };
};

export default usePokemonList;
