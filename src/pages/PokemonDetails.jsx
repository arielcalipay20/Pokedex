import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import PokemonCard from '../components/PokemonCard';

function PokemonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            setLoading(true);
            try {
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const data = await res.json();
                setPokemon(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPokemonDetails();
    }, [id]);

    const handleBack = () => {
        navigate('/');
    }

    if (loading || !pokemon) {
        return (
            <Loading />
        )
    }

    return (
        <div className='min-h-screen'>
            <button
                onClick={handleBack}
                className="text-dark mb-4 flex items-center gap-2 hover:opacity-80"
            >
                <span className="font-semibold">Back</span>
            </button>
            <div className="grid grid-cols-1 gap-4 w-1/3 py-5 mx-auto">
                <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                />
            </div>
        </div>
    )
}

export default PokemonDetails