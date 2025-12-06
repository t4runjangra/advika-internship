import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {
  fetchPokemonList,
  fetchPokemonDetails,
  fetchPokemonSpecies,
  fetchEvolutionChain,
  fetchMoveDetails,
  searchPokemon,
  capitalizeName,
  getTypeColor,
  getPokemonIdFromUrl,
} from './utils/pokeapi';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  return useContext(ThemeContext);
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="glass-card p-3 hover:scale-110 transition-transform"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ) : (
        <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative w-24 h-24">
        <div className="absolute top-0 left-0 w-full h-full border-8 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-4 border-gray-800 dark:border-white"></div>
      </div>
    </div>
  );
}

function PokemonCard({ pokemon }) {
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);

  useEffect(() => {
    fetchPokemonDetails(pokemon.name).then(setDetails);
  }, [pokemon.name]);

  if (!details) return <LoadingSpinner />;

  const paddedId = String(details.id).padStart(4, '0');

  return (
    <div
      onClick={() => navigate(`/pokemon?id=${details.id}`)}
      className="pokemon-card animate-fade-in"
    >
      <div className="text-right text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
        #{paddedId}
      </div>
      <div className="flex justify-center mb-4">
        <img
          src={details.sprites.other['official-artwork'].front_default || details.sprites.front_default}
          alt={details.name}
          className="w-32 h-32 object-contain drop-shadow-lg"
        />
      </div>
      <h3 className="text-xl font-bold text-center mb-2 text-gray-800 dark:text-white">
        {capitalizeName(details.name)}
      </h3>
      <div className="flex gap-2 justify-center flex-wrap">
        {details.types.map(({ type }) => (
          <span key={type.name} className={`type-badge ${getTypeColor(type.name)}`}>
            {type.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length >= 2) {
      searchPokemon(query).then(results => {
        setSuggestions(results);
        setShowSuggestions(true);
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query]);

  const handleSelectPokemon = (id) => {
    navigate(`/pokemon?id=${id}`);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-md" >
      <input
        id='search'
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setShowSuggestions(true)}
        placeholder="Search Pokémon..."
        className="w-full px-6 py-3 rounded-full glass-card text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass-card max-h-60 overflow-y-auto z-50">
          {suggestions.map(({ name, id }) => (
            <div
              key={id}
              onClick={() => handleSelectPokemon(id)}
              className="px-4 py-3 cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-white"
            >
              <span className="font-semibold">{capitalizeName(name)}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                #{String(id).padStart(4, '0')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 glass-card hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current text-gray-800 dark:text-white font-semibold rounded-lg transition-all"
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-semibold transition-all ${currentPage === page
              ? 'bg-blue-500 text-white shadow-lg scale-110'
              : 'glass-card text-gray-800 dark:text-white hover:bg-blue-400 hover:text-white'
              }`}
          >
            {page}
          </button>
        ) : (
          <span key={index} className="px-2 text-gray-500 dark:text-gray-400">
            {page}
          </span>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 glass-card hover:bg-blue-500 hover:text-white disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-current text-gray-800 dark:text-white font-semibold rounded-lg transition-all"
      >
        Next
      </button>
    </div>
  );
}

function MainPage() {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchPokemonList(currentPage, 25).then(data => {
      setPokemonList(data.results);
      setTotalPages(Math.ceil(data.count / 25));
      setLoading(false);
    });
  }, [currentPage]);

  return (
    <div className="min-h-screen">
      <header className="glass-card mx-4 mt-4 mb-8 p-6 sticky top-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-6 h-6 bg-white rounded-full border-2 border-gray-800"></div>
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
              Pokédex
            </h1>
          </div>
          <SearchBar />
          <div className="flex gap-3">
            <Link to="/game" className="glass-card px-4 py-2 hover:bg-purple-500 hover:text-white transition-colors text-gray-800 dark:text-white font-semibold rounded-lg">
              Guess Game
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
              {pokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.name} pokemon={pokemon} />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </main>
    </div>
  );
}

function StatsChart({ stats }) {
  const chartData = stats.map(stat => ({
    name: stat.stat.name.replace('-', ' ').replace('special', 'sp.'),
    value: stat.base_stat,
  }));

  const getStatColor = (value) => {
    if (value >= 100) return '#10b981';
    if (value >= 70) return '#3b82f6';
    if (value >= 50) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Base Stats</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" domain={[0, 255]} />
          <YAxis dataKey="name" type="category" width={80} className="capitalize" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar dataKey="value" radius={[0, 8, 8, 0]} animationDuration={1000}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getStatColor(entry.value)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EvolutionChain({ pokemonId }) {
  const [evolutionData, setEvolutionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvolution() {
      try {
        const species = await fetchPokemonSpecies(pokemonId);
        const chainId = getPokemonIdFromUrl(species.evolution_chain.url);
        const chain = await fetchEvolutionChain(chainId);
        setEvolutionData(chain);
      } catch (error) {
        console.error('Error fetching evolution:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEvolution();
  }, [pokemonId]);

  const parseEvolutionChain = (chain) => {
    const evolutions = [];
    let current = chain;

    while (current) {
      const speciesId = getPokemonIdFromUrl(current.species.url);
      const evolutionDetails = current.evolution_details[0];

      evolutions.push({
        name: current.species.name,
        id: speciesId,
        trigger: evolutionDetails?.trigger?.name,
        minLevel: evolutionDetails?.min_level,
        item: evolutionDetails?.item?.name,
      });

      current = current.evolves_to[0];
    }

    return evolutions;
  };

  if (loading) return <LoadingSpinner />;
  if (!evolutionData) return null;

  const evolutions = parseEvolutionChain(evolutionData.chain);

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Evolution Chain</h2>
      <div className="flex items-center justify-center gap-4 flex-wrap">
        {evolutions.map((evo, index) => (
          <div key={evo.id} className="flex items-center gap-4">
            <EvolutionStage evolution={evo} />
            {index < evolutions.length - 1 && (
              <div className="text-center">
                <svg className="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {evolutions[index + 1].minLevel && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Lv. {evolutions[index + 1].minLevel}
                  </p>
                )}
                {evolutions[index + 1].item && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {capitalizeName(evolutions[index + 1].item)}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function EvolutionStage({ evolution }) {
  const [sprite, setSprite] = useState('');

  useEffect(() => {
    fetchPokemonDetails(evolution.id).then(data => {
      setSprite(data.sprites.other['official-artwork'].front_default || data.sprites.front_default);
    });
  }, [evolution.id]);

  return (
    <div className="text-center">
      {sprite && <img src={sprite} alt={evolution.name} className="w-24 h-24 object-contain" />}
      <p className="font-semibold text-gray-800 dark:text-white">{capitalizeName(evolution.name)}</p>
    </div>
  );
}

function ImageCarousel({ sprites }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { url: sprites.front_default, label: 'Normal Front' },
    { url: sprites.back_default, label: 'Normal Back' },
    { url: sprites.front_shiny, label: 'Shiny Front' },
    { url: sprites.back_shiny, label: 'Shiny Back' },
  ].filter(img => img.url);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + images.length) % images.length);

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Sprites</h2>
      <div className="relative">
        <div className="flex justify-center items-center h-64">
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].label}
            className="max-h-full object-contain drop-shadow-xl"
          />
        </div>
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 glass-card p-2 hover:bg-blue-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 glass-card p-2 hover:bg-blue-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300 dark:bg-gray-600'
                }`}
            />
          ))}
        </div>
        <p className="text-center mt-2 text-gray-600 dark:text-gray-400 font-semibold">
          {images[currentIndex].label}
        </p>
      </div>
    </div>
  );
}

function MovesList({ moves }) {
  const [movesData, setMovesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMoves() {
      const levelUpMoves = moves
        .filter(m => m.version_group_details.some(v => v.move_learn_method.name === 'level-up'))
        .map(m => ({
          name: m.move.name,
          level: m.version_group_details.find(v => v.move_learn_method.name === 'level-up')?.level_learned_at || 0,
          url: m.move.url,
        }))
        .sort((a, b) => a.level - b.level)
        .slice(0, 10);

      const detailedMoves = await Promise.all(
        levelUpMoves.map(async (move) => {
          const details = await fetchMoveDetails(move.url);
          return {
            ...move,
            type: details.type.name,
            power: details.power || '-',
            accuracy: details.accuracy || '-',
          };
        })
      );

      setMovesData(detailedMoves);
      setLoading(false);
    }

    fetchMoves();
  }, [moves]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="glass-card p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Top 10 Level-Up Moves</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Level</th>
              <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Move</th>
              <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Type</th>
              <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Power</th>
              <th className="text-left py-2 px-3 text-gray-700 dark:text-gray-300">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {movesData.map((move, index) => (
              <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <td className="py-3 px-3 font-semibold text-gray-800 dark:text-white">{move.level || '-'}</td>
                <td className="py-3 px-3 text-gray-800 dark:text-white">{capitalizeName(move.name)}</td>
                <td className="py-3 px-3">
                  <span className={`type-badge ${getTypeColor(move.type)} text-xs`}>
                    {move.type}
                  </span>
                </td>
                <td className="py-3 px-3 text-gray-800 dark:text-white">{move.power}</td>
                <td className="py-3 px-3 text-gray-800 dark:text-white">{move.accuracy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pokemonId = searchParams.get('id');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pokemonId) {
      setLoading(true);
      fetchPokemonDetails(pokemonId)
        .then(setPokemon)
        .finally(() => setLoading(false));
    }
  }, [pokemonId]);

  if (loading) return <LoadingSpinner />;
  if (!pokemon) return <div className="text-center py-20 text-gray-800 dark:text-white">Pokémon not found</div>;

  const paddedId = String(pokemon.id).padStart(4, '0');

  return (
    <div className="min-h-screen pb-12">
      <header className="glass-card mx-4 mt-4 mb-8 p-4 sticky top-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 glass-card hover:bg-blue-500 hover:text-white transition-colors text-gray-800 dark:text-white font-semibold rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <div className="glass-card p-8 mb-6 text-center">
          <div className="text-gray-500 dark:text-gray-400 text-lg font-semibold mb-2">#{paddedId}</div>
          <h1 className="text-5xl font-bold mb-4 text-gray-800 dark:text-white">
            {capitalizeName(pokemon.name)}
          </h1>
          <div className="flex gap-3 justify-center mb-6">
            {pokemon.types.map(({ type }) => (
              <span key={type.name} className={`type-badge text-lg ${getTypeColor(type.name)}`}>
                {type.name}
              </span>
            ))}
          </div>
          <img
            src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-64 h-64 object-contain mx-auto drop-shadow-2xl"
          />
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Basic Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Height</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{pokemon.height / 10} m</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Weight</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{pokemon.weight / 10} kg</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">Base Experience</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{pokemon.base_experience}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Abilities</p>
              <div className="flex flex-col gap-1">
                {pokemon.abilities.slice(0, 3).map(({ ability, is_hidden }) => (
                  <span key={ability.name} className="text-sm font-semibold text-gray-800 dark:text-white">
                    {capitalizeName(ability.name)}
                    {is_hidden && <span className="text-xs text-purple-500 ml-1">(Hidden)</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <StatsChart stats={pokemon.stats} />
        </div>

        <div className="mb-6">
          <EvolutionChain pokemonId={pokemon.id} />
        </div>

        <div className="mb-6">
          <ImageCarousel sprites={pokemon.sprites} />
        </div>

        <div className="mb-6">
          <MovesList moves={pokemon.moves} />
        </div>
      </main>
    </div>
  );
}

function GuessGame() {
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const generateNewRound = async () => {
    setLoading(true);
    setSelectedAnswer(null);

    const correctId = Math.floor(Math.random() * 151) + 1;
    const correctPokemon = await fetchPokemonDetails(correctId);

    const wrongIds = new Set();
    while (wrongIds.size < 3) {
      const id = Math.floor(Math.random() * 151) + 1;
      if (id !== correctId) wrongIds.add(id);
    }

    const wrongPokemons = await Promise.all(
      Array.from(wrongIds).map(id => fetchPokemonDetails(id))
    );

    const allOptions = [correctPokemon, ...wrongPokemons]
      .sort(() => Math.random() - 0.5)
      .map(p => ({ id: p.id, name: p.name }));

    setPokemon(correctPokemon);
    setOptions(allOptions);
    setLoading(false);
  };

  useEffect(() => {
    generateNewRound();
  }, []);

  const handleAnswer = (selectedId) => {
    setSelectedAnswer(selectedId);
    if (selectedId === pokemon.id) {
      setScore(prev => prev + 1);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen pb-12">
      <header className="glass-card mx-4 mt-4 mb-8 p-4 sticky top-4 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 glass-card hover:bg-blue-500 hover:text-white transition-colors text-gray-800 dark:text-white font-semibold rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            Score: <span className="text-green-500">{score}</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4">
        <div className="glass-card p-8 text-center">
          <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Who's That Pokémon?</h1>
          <div className="mb-8 bg-linear-to-br from-blue-400 to-purple-400 rounded-2xl p-8">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default}
              alt="Mystery Pokémon"
              className={`w-64 h-64 object-contain mx-auto ${selectedAnswer ? '' : 'brightness-0'
                } transition-all duration-500`}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => !selectedAnswer && handleAnswer(option.id)}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-xl font-bold text-lg transition-all ${selectedAnswer === null
                  ? 'glass-card hover:bg-blue-500 hover:text-white text-gray-800 dark:text-white'
                  : selectedAnswer === option.id
                    ? option.id === pokemon.id
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : option.id === pokemon.id
                      ? 'bg-green-500 text-white'
                      : 'glass-card text-gray-800 dark:text-white opacity-50'
                  }`}
              >
                {capitalizeName(option.name)}
              </button>
            ))}
          </div>
          {selectedAnswer && (
            <div className="mb-6">
              {selectedAnswer === pokemon.id ? (
                <p className="text-2xl font-bold text-green-500 animate-fade-in">
                  ✓ Correct! It's {capitalizeName(pokemon.name)}!
                </p>
              ) : (
                <p className="text-2xl font-bold text-red-500 animate-fade-in">
                  ✗ Wrong! It was {capitalizeName(pokemon.name)}
                </p>
              )}
            </div>
          )}
          {selectedAnswer && (
            <button
              onClick={generateNewRound}
              className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
            >
              Next Pokémon →
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/pokemon" element={<DetailPage />} />
          <Route path="/game" element={<GuessGame />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
