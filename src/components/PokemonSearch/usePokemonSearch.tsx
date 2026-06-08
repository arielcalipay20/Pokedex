export interface PokemonSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const usePokemonSearch = (props: PokemonSearchProps) => {
  const { value, onChange, placeholder } = props;
  return {
    value,
    onChange,
    placeholder,
  };
};

export default usePokemonSearch;
