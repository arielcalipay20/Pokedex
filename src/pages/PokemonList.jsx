import { useEffect, useState } from 'react'
import { typeBg } from '../constants/pokemonTypes';
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';

function PokemonList() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllPokemon = async () => {
            setLoading(true);
            try {
                const promises = [];
                for (let i = 1; i <= 151; i++) {
                    promises.push(
                        fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then(res => res.json())
                    );
                }
                const pokemonData = await Promise.all(promises);
                setPokemons(pokemonData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllPokemon();
    }, []);

    const handleClickPokemon = (id) => {
        navigate(`/pokemon/${id}`);
    };

    if (loading || !pokemons) {
        return (
            <Loading />
        )
    }

    return (
        <>
            <div className="grid grid-cols-4 gap-4 w-2/3 py-5 mx-auto">
                {
                    pokemons.map((pokemon) => {
                        return (
                            <PokemonCard
                                key={pokemon.id}
                                pokemon={pokemon}
                                onClick={handleClickPokemon}
                            />
                        )
                    })
                }
            </div>
        </>
    )
}

export default PokemonList