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
        console.log("Pokemon Data: ", pokemonData);
        setPokemons(pokemonData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllPokemon();
  }, []);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {
          pokemons.map(pokemon => {
            return (
              <div key={pokemon.id} className="rounded overflow-hidden shadow-lg border border-dark p-8">
                <div className="flex justify-center border border-black bg-gray-300">
                  <img className="" src={pokemon.sprites.front_default} alt={pokemon.name} />
                </div>
                <h3>{pokemon.name}</h3>
                <p
                  className="rounded capitalize text-sm "
                >
                  {pokemon.types.map(t => t.type.name).join(", ")}
                </p>
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default App
