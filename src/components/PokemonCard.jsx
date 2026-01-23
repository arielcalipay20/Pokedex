import { typeBg } from '../constants/pokemonTypes';

export default function PokemonCard({ pokemon, onClick }) {
    return (
        <div
            key={pokemon.id}
            onClick={onClick ? () => onClick(pokemon.id) : null}
            className="card rounded overflow-hidden shadow-lg border border-gray-300">
            <div className="flex justify-center bg-gray-300 p-4">
                <img className="pokemon-names w-28 h-28 object-contain" src={pokemon.sprites.other['official-artwork'].front_default} alt={pokemon.name} />
            </div>

            <div className="p-4 pokemon-details">
                <p className="text-xs text-gray-400 text-right">#{pokemon.id.toString().padStart("4", 0)}</p>
                <p className="text-xl capitalize mb-3">{pokemon.name}</p>
                <div className="flex gap-2">
                    {pokemon.types.map((t, index) => {
                        const type = t.type.name;
                        return (
                            <span key={index} className={`text-white rounded-md capitalize text-sm px-2 py-1 ${typeBg[type]}`}>
                                {type}
                            </span>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

