import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../components/Loading';
import PokemonCard from '../components/PokemonCard';
import { typeBg } from '../constants/pokemonTypes';

function PokemonDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemon, setPokemon] = useState(null);
    const [description, setDescription] = useState('');
    const [habitat, setHabitat] = useState('');
    const [category, setCategory] = useState('');
    const [evolutionChain, setEvolutionChain] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            setLoading(true);
            try {
                //fetch pokemon data 
                const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
                const data = await res.json();
                setPokemon(data);

                //fetch species for evolution, category, habitat, and description
                const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
                const speciesData = await speciesRes.json();

                //fetch english description
                const flavorText = speciesData.flavor_text_entries.find(
                    entry => entry.language.name === 'en'
                );

                //remove special characters
                const cleanText = flavorText.flavor_text.replace(/\f|\n/g, ' ');
                setDescription(cleanText);

                //fetch category
                const genus = speciesData.genera.find(
                    g => g.language.name === 'en'
                )
                setCategory(genus.genus);

                //fetch habitat
                const habitatData = speciesData.habitat?.name || 'Unknown';
                setHabitat(habitatData);

                //parse evolution
                const evolutionRes = await fetch(speciesData.evolution_chain.url);
                const evolutionData = await evolutionRes.json();

                const evolutions = [];
                let current = evolutionData.chain;

                while (current) {
                    const pokemonId = current.species.url.split('/').filter(Boolean).pop();
                    const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                    const pokemonData = await pokemonRes.json();

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

    const handleBack = () => {
        navigate('/');
    }

    const handleEvolutionClick = (evolutionId) => {
        navigate(`/pokemon/${evolutionId}`)
    }

    if (loading || !pokemon) {
        return (
            <Loading />
        )
    }

    return (
        <div className='min-h-screen bg-gray-100'>
            <div className="w-2/3 py-5 mx-auto">
                <div className="mb-5">
                    <p className="pokemon-names text-4xl capitalize flex justify-center items-center gap-4">
                        {pokemon.name}
                        <span className="text-gray-500 text-xl"> #{pokemon.id.toString().padStart("4", 0)}</span>
                    </p>
                </div>

                <div className="flex justify-center px-10 mb-5">
                    <div className="flex-1">
                        <div className="flex justify-center bg-gray-200 rounded-xl mb-3">
                            <img
                                src={pokemon.sprites.other['official-artwork'].front_default}
                                alt={pokemon.name}
                                className="w-96 h-96 object-contain"
                            />
                        </div>
                        <div className="pokemon-details bg-gray-400 text-white rounded-xl p-4">
                            <div className="mb-3">
                                <p className="text-lg">Stats</p>
                            </div>
                            {pokemon.stats.map(stat => {
                                const stats = stat.stat.name;
                                return (
                                    <div key={stats} className="mb-3">
                                        <div className="flex justify-between mb-1">
                                            <span className="capitalize text-white">
                                                {stats.replace('-', ' ')}
                                            </span>
                                            <span className="font-bold">
                                                {stat.base_stat}
                                            </span>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-cyan-500 h-2 rounded-full transition-all"
                                                style={{ width: `${(stat.base_stat / 255) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex-1 pokemon-details p-4">
                        {
                            description &&
                            <div className="mb-10">
                                <p className="text-2xl text-justify">{description}</p>
                            </div>
                        }

                        <div className="flex rounded-xl bg-cyan-500 mb-8 p-4">
                            <div className="flex-1">
                                {pokemon.height &&
                                    <div className="mb-3">
                                        <p className="text-white text-lg">Height</p>
                                        <p className="text-xl">{(pokemon.height / 10).toFixed(1)} m</p>
                                    </div>
                                }
                                {pokemon.weight &&
                                    <div className="mb-3">
                                        <p className="text-white text-lg">Weight</p>
                                        <p className="text-xl">{(pokemon.weight / 10).toFixed(1)} kg</p>
                                    </div>
                                }
                                {habitat &&
                                    <div className="mb-3">
                                        <p className="text-white text-lg">Habitat</p>
                                        <p className="text-xl">{habitat}</p>
                                    </div>
                                }
                            </div>
                            <div className="flex-1">
                                {category &&
                                    <div className="mb-3">
                                        <p className="text-white text-lg">Category</p>
                                        <p className="text-xl">{category}</p>
                                    </div>
                                }
                                {pokemon.abilities.length !== 0 &&
                                    <div className="mb-3">
                                        <p className="text-white text-lg">{pokemon.abilities.length === 1 ? "Ability" : "Abilities"}</p>
                                        {pokemon.abilities.map((a, index) => {
                                            const ability = a.ability.name
                                            return (
                                                <div key={index}>
                                                    <p className="text-xl">{ability}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                        {
                            pokemon.types.length !== 0 &&
                            <div className="mb-3">
                                <div className="mb-5">
                                    <p className="text-2xl">
                                        {pokemon.types.length === 0 ? "Type" : "Types"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {pokemon.types.map((t, index) => {
                                        const type = t.type.name;
                                        return (
                                            <span key={index} className={`text-white rounded-md capitalize text-xl px-2 py-1 ${typeBg[type]}`}>
                                                {type}
                                            </span>
                                        )
                                    })}
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div className="border border-dark rounded-xl p-5 bg-gray-600 text-white mx-10 mb-3">
                    <p className="pokemon-details text-xl border-b pb-3">
                        Evolutions
                    </p>
                    <div className="mt-6">
                        {evolutionChain && evolutionChain.length > 1 ? (
                            <div className="flex items-center justify-center gap-4 flex-wrap">
                                {evolutionChain.map((evo, index) => (
                                    <React.Fragment key={evo.id}>
                                        <PokemonCard
                                            pokemon={evo}
                                            disable={evo.id === pokemon.id}
                                            onClick={handleEvolutionClick}
                                        />
                                        {index < evolutionChain.length - 1 && (
                                            <div className="text-2xl font-bold">→</div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )
                            : (
                                <div>
                                    <p className="text-xl">
                                        This Pokémon does not evolve.
                                    </p>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="mx-10 flex justify-end">
                    <button
                        onClick={handleBack}
                        className="text-white mb-4 flex items-center gap-2 hover:opacity-80 bg-cyan-500 px-4 py-2 rounded-xl cursor-pointer"
                    >
                        <span className="font-semibold text-xl">Explore Pokémon</span>
                    </button>
                </div>
            </div >
        </div >
    )
}

export default PokemonDetails