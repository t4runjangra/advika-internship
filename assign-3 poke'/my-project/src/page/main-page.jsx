import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const POKEMONS_PER_PAGE = 25;

export default function MainPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [pokemons, setPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // Get page from URL params
    useEffect(() => {
        const page = parseInt(searchParams.get('page')) || 1;
        setCurrentPage(page);
    }, [searchParams]);

    // Fetch all Pokémon data
    useEffect(() => {
        fetchPokemons();
    }, []);

    const fetchPokemons = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=500');
            const data = await response.json();
            const pokemonDetails = await Promise.all(
                data.results.map(async (pokemon) => {
                    const res = await fetch(pokemon.url);
                    const details = await res.json();
                    return {
                        id: details.id.toString(),
                        name: details.name,
                        image:
                            details.sprites.other['official-artwork'].front_default ||
                            details.sprites.front_default,
                        types: details.types.map((t) => t.type.name),
                    };
                })
            );

            setPokemons(pokemonDetails);
            setFilteredPokemons(pokemonDetails);

        } catch (error) {
            console.error('Error fetching Pokémon:', error);
        } finally {
            setLoading(false);
        }
    };

    // Search and suggestions logic
    useEffect(() => {
        if (!searchTerm.trim()) {
            setSearchSuggestions([]);
            setFilteredPokemons(pokemons);
            return;
        }

        const suggestions = pokemons
            .filter((pokemon) =>
                pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase())
            )
            .slice(0, 8);

        setSearchSuggestions(suggestions);

        const filtered = pokemons.filter((pokemon) =>
            pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPokemons(filtered);
    }, [searchTerm, pokemons]);

    // Pagination logic
    const totalPages = Math.ceil(filteredPokemons.length / POKEMONS_PER_PAGE);
    const startIndex = (currentPage - 1) * POKEMONS_PER_PAGE;
    const currentPokemons = filteredPokemons.slice(startIndex, startIndex + POKEMONS_PER_PAGE);

    const handlePageChange = useCallback((page) => {
        setSearchParams({ page: page.toString() });
    }, [setSearchParams]);

    const handlePokemonClick = (pokemonId) => {
        navigate(`/pokemon?id=${pokemonId}`);
    };

    const getTypeColor = (type) => {
        const colors = {
            normal: 'bg-gray-200 text-gray-800',
            fire: 'bg-orange-400 text-white',
            water: 'bg-blue-400 text-white',
            grass: 'bg-green-400 text-white',
            electric: 'bg-yellow-400 text-gray-900',
            ice: 'bg-cyan-400 text-white',
            fighting: 'bg-red-500 text-white',
            poison: 'bg-purple-500 text-white',
            ground: 'bg-yellow-600 text-white',
            flying: 'bg-indigo-400 text-white',
            psychic: 'bg-pink-500 text-white',
            bug: 'bg-lime-500 text-white',
            rock: 'bg-gray-600 text-white',
            ghost: 'bg-violet-600 text-white',
            dragon: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white',
            dark: 'bg-gray-800 text-white',
            steel: 'bg-gray-400 text-gray-900',
            fairy: 'bg-pink-400 text-white',
        };
        return colors[type] || 'bg-gray-200 text-gray-800';
    };

    if (loading) {
        return (
            <div className=" flex items-center justify-center">
                <div className="text-white text-xl">Loading Pokémon...</div>
            </div>
        );
    }

    return (
        <div className=" text-white">
            {/* Search Bar */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="relative max-w-2xl mx-auto mb-16">
                    <div className="relative">
                        <svg
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                        <input
                            id='search'
                            type="text"
                            placeholder="Search Pokémon by name..."
                            className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoComplete="off"
                        />
                    </div>

                    {/* Search Suggestions */}
                    {searchSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-h-80 overflow-auto z-10">
                            {searchSuggestions.map((pokemon) => (
                                <div
                                    key={pokemon.id}
                                    className="p-4 hover:bg-white/20 cursor-pointer transition-colors flex items-center gap-3"
                                    onClick={() => {
                                        setSearchTerm(pokemon.name);
                                        setSearchSuggestions([]);
                                    }}
                                >
                                    <img
                                        src={pokemon.image}
                                        alt={pokemon.name}
                                        className="w-10 h-10 rounded-lg shadow-lg"
                                    />
                                    <div>
                                        <div className="font-semibold capitalize">{pokemon.name}</div>
                                        <div className="text-sm text-gray-300">
                                            #{pokemon.id.padStart(3, '0')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Pokémon Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-16">
                    {currentPokemons.map((pokemon) => (
                        <div
                            key={pokemon.id}
                            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:scale-[1.02]"
                            onClick={() => handlePokemonClick(pokemon.id)}
                        >
                            <div className="relative">
                                <h3 className="text-xl font-bold capitalize mb-1 text-center">{pokemon.name}</h3>
                                <img
                                    src={pokemon.image}
                                    alt={pokemon.name}
                                    className="w-full h-48 object-contain mx-auto group-hover:scale-110 transition-transform duration-300"
                                />

                            </div>

                            <div className="mt-8 text-center">
                                <div className="flex justify-center gap-2 mb-3 flex-wrap">
                                    {pokemon.types.map((type) => (
                                        <span
                                            key={type}
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(type)}`}
                                        >
                                            {type}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-gray-400 font-mono text-sm">#{pokemon.id.padStart(3, '0')}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;

                            if (totalPages <= 4) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-colors ${pageNum === currentPage
                                        ? 'bg-amber-400 text-slate-900 shadow-lg'
                                        : 'bg-white/10 border border-white/20 hover:bg-white/20'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
