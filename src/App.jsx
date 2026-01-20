import './App.css'
import { useState, useEffect } from 'react';
import { api } from './services/api';
import { typeBg } from './constants/pokemonTypes';

function App() {

  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, [pokemons]);

  return (
    <>
      <div className="grid grid-cols-4 gap-4 w-2/3 py-5 mx-auto">
        {
          pokemons.map((pokemon) => {
            return (
              <div key={pokemon.id} className="card rounded overflow-hidden shadow-lg border border-gray-300">
                <div className="flex justify-center bg-gray-300">
                  <img className="pokemon-names" src={pokemon.sprites.front_default} alt={pokemon.name} />
                </div>

                <div className="p-4 pokemon-details">
                  <p className="text-xs text-gray-400 text-right">#{pokemon.id}</p>
                  <p className="text-xl capitalize mb-3">{pokemon.name}</p>
                  <div className="flex gap-2">
                    {pokemon.types.map((t, index) => {
                      const type = t.type.name;
                      return (
                        <span key={index} className={`text-white rounded capitalize text-sm px-2 py-1 ${typeBg[type]}`}>
                          {type}
                        </span>
                      )
                    })}
                  </div>
                </div>

              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default App
