import PokemonCard from "@/components/PokemonCard/PokemonCard";
import Loading from "@/components/Loading/Loading";
import ReactPaginateLib from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import "@/styles/pokemonList.css";
import PokemonSearch from "@/components/PokemonSearch/PokemonSearch";
import usePokemonList from "./usePokemonList";
import { labels } from "@/defaultProps/label";

const ReactPaginate = ((ReactPaginateLib as any).default ||
  ReactPaginateLib) as React.ComponentType<ReactPaginateProps>;

const PokemonList = () => {
  const {
    pokemonPerPage,
    handleClickPokemon,
    pokemon,
    loading,
    currentPage,
    searchTerm,
    filteredPokemon,
    currentPokemon,
    offset,
    pageCount,
    handlePageClick,
    handleSearchChange,
  } = usePokemonList({
    labels: labels.search,
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">
      <div className="mb-5">
        <p className="text-5xl font-bold text-center">
          {labels.homePage.title}
        </p>
      </div>

      {/* Search Component */}
      <PokemonSearch
        placeholder={labels.search.placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {filteredPokemon.length === 0 ? (
        //No record found
        <div className="text-center py-4">
          <p className="text-gray-500 text-xl mb-2">
            {labels.search.noResults} "{searchTerm}"
          </p>
          <p className="text-gray-400">{labels.search.tryDifferent}</p>
        </div>
      ) : (
        <>
          {/* Pokemon grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full md:w-2/3 py-5 mx-auto px-4">
            {currentPokemon.map((pokemon) => {
              return (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  onClick={handleClickPokemon}
                />
              );
            })}
          </div>
          {/* Show section */}
          <p className="text-center text-gray-600">
            {labels.homePage.showing} {offset + 1} -{" "}
            {Math.min(offset + pokemonPerPage, filteredPokemon.length)} of{" "}
            {filteredPokemon.length} {labels.homePage.subject}
            {searchTerm && (
              <span className="font-semibold">
                {" "}
                (filtered from {pokemon.length} total)
              </span>
            )}
          </p>
          {/* Pagination */}
          {pageCount > 1 && (
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              forcePage={currentPage}
              containerClassName={"pagination"}
              activeClassName={"active"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              disabledClassName={"disabled"}
              breakLabel={"..."}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PokemonList;
