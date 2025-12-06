import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Radar } from 'react-chartjs-2'; // or Bar
// import and register chart.js stuff once

export default function PokemonDetailsPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id'); // "1"
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  );
  const [loading, setLoading] = useState(true);

  // apply theme to <html> for Tailwind dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      try {
        setLoading(true);

        const pokemonRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemonData = await pokemonRes.json();

        const speciesRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${id}`
        );
        const speciesData = await speciesRes.json();

        const evoRes = await fetch(speciesData.evolution_chain.url);
        const evoData = await evoRes.json();

        setPokemon(pokemonData);
        setEvolution(flattenEvolutionChain(evoData.chain)); // helper below
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading || !pokemon) {
    return <div className="p-8 text-white">Loading...</div>;
    if () {
      
    }
  }

  // stats chart data
  const statsLabels = pokemon.stats.map((s) => s.stat.name.toUpperCase());
  const statsValues = pokemon.stats.map((s) => s.base_stat);

  const radarData = useMemo(
    () => ({
      labels: statsLabels,
      datasets: [
        {
          label: 'Base Stats',
          data: statsValues,
          backgroundColor: 'rgba(251, 191, 36, 0.2)',
          borderColor: '#fbbf24',
          borderWidth: 2,
          pointBackgroundColor: '#fbbf24',
        },
      ],
    }),
    [statsLabels, statsValues]
  );

  // top 10 moves with details (first level-up moves)
  const topMoves = pokemon.moves.slice(0, 10); // you can sort/filter by level

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="mb-6 px-4 py-2 rounded-full border border-white/20"
      >
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>

      {/* Header: image, name, types, abilities */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
        {/* Image carousel */}
        <div className="w-64">
          {/* very simple manual carousel using local state index */}
        </div>

        <div className="flex-1 space-y-3">
          <h1 className="text-4xl font-extrabold capitalize">
            {pokemon.name} #{String(pokemon.id).padStart(3, '0')}
          </h1>

          <div className="flex gap-2 flex-wrap">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-400 text-slate-900"
              >
                {t.type.name}
              </span>
            ))}
          </div>

          <div>
            <h2 className="font-semibold mb-1">Abilities</h2>
            <ul className="list-disc list-inside text-sm space-y-1">
              {pokemon.abilities.slice(0, 3).map((a) => (
                <li key={a.ability.name} className="capitalize">
                  {a.ability.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Stats chart */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Base stats</h2>
        <div className="max-w-md">
          <Radar data={radarData} options={{ responsive: true, animation: { duration: 800 } }} />
        </div>
      </section>

      {/* Evolution stages */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Evolution chain</h2>
        <div className="flex flex-wrap gap-4">
          {evolution.map((stage) => (
            <div
              key={stage.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 w-48"
            >
              <div className="font-semibold capitalize">{stage.name}</div>
              {stage.min_level && (
                <div className="text-xs text-slate-300">
                  Level {stage.min_level} ({stage.trigger})
                </div>
              )}
              <div className="flex gap-1 mt-2 flex-wrap">
                {stage.types?.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-full text-[10px] bg-slate-700 capitalize"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Moves list */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-3">Top moves</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-300">
              <tr>
                <th className="py-2 pr-4">Lvl</th>
                <th className="py-2 pr-4">Move</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Power</th>
                <th className="py-2 pr-4">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {topMoves.map((m) => {
                const details = m.version_group_details[0];
                const level = details?.level_learned_at || '-';
                return (
                  <tr key={m.move.name} className="border-t border-white/10">
                    <td className="py-2 pr-4">{level}</td>
                    <td className="py-2 pr-4 capitalize">{m.move.name}</td>
                    {/* you need a separate fetch per move to get type/power/accuracy */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

// flatten evolution chain to stages array
function flattenEvolutionChain(chain) {
  const stages = [];

  function walk(node, prevTypes = []) {
    const name = node.species.name;
    const detail = node.evolution_details?.[0];
    stages.push({
      name,
      min_level: detail?.min_level || null,
      trigger: detail?.trigger?.name || null,
      // you can later fetch each pokemon/{name} to get its types
      types: prevTypes,
    });
    node.evolves_to.forEach((child) => walk(child, prevTypes));
  }

  walk(chain);
  return stages;
}
