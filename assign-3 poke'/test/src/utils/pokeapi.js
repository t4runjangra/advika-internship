// PokeAPI utility functions with in-memory caching

const BASE_URL = 'https://pokeapi.co/api/v2';
const cache = new Map();

// Helper function to get cached data or fetch
async function fetchWithCache(url) {
    if (cache.has(url)) {
        return cache.get(url);
    }

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    cache.set(url, data);
    return data;
}

// Get paginated list of Pokémon (25 per page)
export async function fetchPokemonList(page = 1, limit = 25) {
    const offset = (page - 1) * limit;
    const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
    return fetchWithCache(url);
}

// Get detailed Pokémon data
export async function fetchPokemonDetails(idOrName) {
    const url = `${BASE_URL}/pokemon/${idOrName}`;
    return fetchWithCache(url);
}

// Get Pokémon species data (for evolution chain URL)
export async function fetchPokemonSpecies(idOrName) {
    const url = `${BASE_URL}/pokemon-species/${idOrName}`;
    return fetchWithCache(url);
}

// Get evolution chain data
export async function fetchEvolutionChain(id) {
    const url = `${BASE_URL}/evolution-chain/${id}`;
    return fetchWithCache(url);
}

// Get move details
export async function fetchMoveDetails(moveNameOrUrl) {
    const url = moveNameOrUrl.startsWith('http') ? moveNameOrUrl : `${BASE_URL}/move/${moveNameOrUrl}`;
    return fetchWithCache(url);
}

// Search Pokémon by name (for autocomplete)
export async function searchPokemon(query) {
    if (!query || query.length < 2) return [];

    // Fetch all pokemon names (cached after first call)
    const allPokemonUrl = `${BASE_URL}/pokemon?limit=1000`;
    const data = await fetchWithCache(allPokemonUrl);

    const lowerQuery = query.toLowerCase();
    return data.results
        .filter(p => p.name.toLowerCase().includes(lowerQuery))
        .slice(0, 10)
        .map(p => ({
            name: p.name,
            id: parseInt(p.url.split('/').filter(Boolean).pop())
        }));
}

// Helper to capitalize Pokémon names
export function capitalizeName(name) {
    return name.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Helper to get Pokémon ID from URL
export function getPokemonIdFromUrl(url) {
    return parseInt(url.split('/').filter(Boolean).pop());
}

// Get type color for badges
export function getTypeColor(type) {
    const typeColors = {
        normal: 'bg-[#A8A878]',
        fire: 'bg-[#F08030]',
        water: 'bg-[#6890F0]',
        electric: 'bg-[#F8D030] text-gray-800',
        grass: 'bg-[#78C850]',
        ice: 'bg-[#98D8D8]',
        fighting: 'bg-[#C03028]',
        poison: 'bg-[#A040A0]',
        ground: 'bg-[#E0C068]',
        flying: 'bg-[#A890F0]',
        psychic: 'bg-[#F85888]',
        bug: 'bg-[#A8B820]',
        rock: 'bg-[#B8A038]',
        ghost: 'bg-[#705898]',
        dragon: 'bg-[#7038F8]',
        dark: 'bg-[#705848]',
        steel: 'bg-[#B8B8D0]',
        fairy: 'bg-[#EE99AC]',
    };
    return typeColors[type.toLowerCase()] || 'bg-gray-500';
}
