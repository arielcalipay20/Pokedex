import { Pokemon } from "@/types/pokemon";
import { typeBg } from "@/constants/pokemonTypes";

export interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: (id: number) => void;
  disabled?: boolean;
}

const usePokemonCard = (props: PokemonCardProps) => {
  const { pokemon, onClick, disabled } = props;
  const typesBg = typeBg;

  return {
    pokemon,
    onClick,
    disabled,
    typesBg,
  };
};

export default usePokemonCard;
