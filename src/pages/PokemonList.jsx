import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';
import Loading from '../components/Loading';
import ReactPaginate from 'react-paginate';
import '../styles/pokemonList.css';
import PokemonSearch from '../components/PokemonSearch';

export default function PokemonList() {
    const [pokemons, setPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const pokemonsPerPage = 10;

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

    //filter pokemon based on search term
    const filteredPokemons = pokemons.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //calculate current pokemon from filtered results
    const offset = currentPage * pokemonsPerPage;
    const currentPokemons = filteredPokemons.slice(offset, offset + pokemonsPerPage);
    const pageCount = Math.ceil(filteredPokemons.length / pokemonsPerPage);

    //handle page change
    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    //handle search page and reset to page 1
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        //reset to first page
        setCurrentPage(0);
    }

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 overflow-hidden">
            <div className="mb-5">
                <p className="text-5xl font-bold text-center">
                    Pokédex
                </p>
            </div>

            {/* Search Component */}
            <PokemonSearch
                placeholder={'Search Pokémon...'}
                value={searchTerm}
                onChange={handleSearchChange}
            />

            {filteredPokemons.length === 0 ?
                (
                    //No record found
                    <div className="text-center py-4">
                        <p className="text-gray-500 text-xl mb-2">No Pokémon found matching "{searchTerm}"</p>
                        <p className="text-gray-400">Try searching for a different name</p>
                    </div>
                ) :
                (
                    <>
                        {/* Pokemon grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full md:w-2/3 py-5 mx-auto px-4">
                            {
                                currentPokemons.map((pokemon) => {
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
                        {/* Show section */}
                        <p className="text-center text-gray-600">
                            Showing {offset + 1} - {Math.min(offset + pokemonsPerPage, filteredPokemons.length)} of {filteredPokemons.length} Pokémon
                            {searchTerm && <span className="font-semibold"> (filtered from {pokemons.length} total)</span>}
                        </p>
                        {/* Pagination */}
                        {pageCount > 1 && (
                            <ReactPaginate.default
                                previousLabel={'← Previous'}
                                nextLabel={'Next →'}
                                pageCount={pageCount}
                                onPageChange={handlePageClick}
                                forcePage={currentPage}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                                pageClassName={'page-item'}
                                pageLinkClassName={'page-link'}
                                previousClassName={'page-item'}
                                previousLinkClassName={'page-link'}
                                nextClassName={'page-item'}
                                nextLinkClassName={'page-link'}
                                disabledClassName={'disabled'}
                                breakLabel={'...'}
                                breakClassName={'page-item'}
                                breakLinkClassName={'page-link'}
                            />
                        )}
                    </>
                )
            }
        </div >
    )
}
