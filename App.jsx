import './App.css'
import { useState, useEffect } from 'react';
import { api } from './services/api';

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
      {
        pokemons.map((pokemon) => (
          <div key={pokemon.id} className="rounded overflow-hidden shadow-lg border border-dark p-8 flex flex-1 flex-col justify-center mb-8">
            <img className="" src={pokemon.sprites.front_default} alt={pokemon.name} />
            <h3>{pokemon.name}</h3>
            <p>Types: {pokemon.types.map(t => t.type.name).join(', ')}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
