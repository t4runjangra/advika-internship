import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'motion';
import { splitText } from 'motion-plus';

export default function HeroSection() {

    const headingRef = useRef(null);

    useEffect(() => {
        if (!headingRef.current) return;

        // wait for fonts if you want, optional:
        (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
            const h1 = headingRef.current;

            // make sure it is visible
            h1.style.visibility = 'visible';

            const { words } = splitText(h1);

            animate(
                words,
                { opacity: [0, 1], y: [10, 0] },
                {
                    type: 'spring',
                    duration: 2,
                    bounce: 0,
                    delay: stagger(0.05),
                }
            );
        });
    }, []);

    return (
        <section className=" text-white py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">


                    <div className="space-y-8">

                        <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 rounded-full px-4 py-1 text-sm w-max select-none" aria-label="New Feature Announcement">
                            <span className="flex items-center gap-2 text-amber-300 font-semibold">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2l2.6 5.3L20 9l-4 3.6L17.3 20 12 16.9 6.7 20 8 12.6 4 9l5.4-1.7L12 2z" fill="currentColor" />
                                </svg>
                                New
                            </span>
                            <span className="text-white/80">Explore PokéData — now faster & friendlier</span>
                        </div>

                        <h1 
                        ref={headingRef}
                        className="text-5xl font-extrabold tracking-tight leading-tight sm:text-6xl"
                        style={{visibility: 'hidden'}}>
                            Meet the world of Pokémon —
                            <span className="text-amber-300 ml-3">discover, collect, and learn</span>
                        </h1>

                        <p className="text-slate-300 max-w-xl text-lg leading-relaxed">
                            Search thousands of Pokémon from the PokéAPI, get instant details, and enjoy curated fun facts and beautiful artwork. Built for trainers who want both accuracy and a smile.
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <a
                                href="#search"
                                className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-semibold px-5 py-3 rounded-full shadow-lg transition-transform transform hover:-translate-y-1"
                                aria-label="Search Pokémon"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm8.5 16.5L18 18" />
                                </svg>
                                Search Pokémon
                            </a>

                            <a
                                href="/detailsPage"
                                className="inline-flex items-center gap-2 border border-white/30 text-white/90 px-5 py-3 rounded-full hover:bg-white/10 transition-colors"
                                aria-label="Browse Pokémon Details"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5" />
                                </svg>
                                Browse details
                            </a>
                        </div>

                        <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
                            {[
                                { iconColor: 'text-amber-300', label: 'Fast lookups', value: '99ms', iconPath: 'M13 2L3 14h7l-1 8L21 10h-7l-1-8z' },
                                { iconColor: 'text-sky-300', label: 'Types & moves', value: '18+ Types', iconPath: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M4 5.5A2.5 2.5 0 0 1 6.5 3H20v14H6.5' },
                                { iconColor: 'text-emerald-300', label: 'Generations', value: '9', iconPath: 'M12 2a10 10 0 100 20 10 10 0 000-20z M2 12h20M12 2v20' }
                            ].map(({ iconColor, label, value, iconPath }, idx) => (
                                <div key={idx} className="bg-white/5 rounded-xl p-4 flex flex-col items-start gap-2">
                                    <svg className={`w-6 h-6 ${iconColor}`} viewBox="0 0 24 24" fill={iconPath.includes('M13') ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                                        <path d={iconPath} />
                                    </svg>
                                    <div className="text-sm text-white/80">{label}</div>
                                    <div className="text-2xl font-bold text-amber-300">{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="relative w-full flex justify-center lg:justify-end">
                        <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-3xl bg-white/5 ring-1 ring-white/5 backdrop-blur flex items-center justify-center">

                            <div aria-hidden="true" className="absolute -inset-8 opacity-10 blur-3xl">
                                <svg viewBox="0 0 120 120" className="w-full h-full text-amber-300/80 fill-current">
                                    <circle cx="60" cy="60" r="60" />
                                </svg>
                            </div>


                            <div className="group relative w-56 h-64 sm:w-60 sm:h-72 perspective-distant">
                                <div className="absolute inset-0 rounded-xl shadow-2xl border border-white/10 p-4 text-slate-900 flex flex-col justify-between bg-linear-to-tr -rose-500 via-amber-400 to-pink-400 transition-all duration-500 -rotate-6 sm:-rotate-3 group-hover:rotate-0 group-hover:-translate-x-25 group-hover:-translate-y-15">
                                    <div className="flex justify-between items-start">
                                        <div className="text-xl font-bold">Pikachu</div>
                                    </div>
                                    <img
                                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png"
                                        alt="Pikachu"
                                    />
                                    <div className="flex justify-between items-end text-xs opacity-80 mt-4">
                                        <div>Electric</div>
                                        <div>Lv. 25</div>
                                    </div>
                                </div>

                                <div className="absolute inset-0 rounded-xl shadow-xl border border-white/20 p-4 text-slate-100 flex flex-col justify-between bg-linear-to-br from-sky-500 via-indigo-600 to-violet-700 transform rotate-3 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-[15px]">
                                    <div className="flex justify-between items-start">
                                        <div className="text-xl font-bold">Charmander</div>
                                    </div>
                                    <img
                                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png"
                                        alt="Charmander"
                                    />
                                    <div className="text-xs opacity-90 flex justify-between w-full mt-2">
                                        <span>Fire</span><span>Lv. 12</span>
                                    </div>
                                </div>
                                <div className="absolute inset-0 rounded-xl shadow-lg border border-white/20 p-4 text-slate-900 flex flex-col justify-between bg-linear-to-br from-sky-400 via-teal-400 to-emerald-400 transform rotate-6 transition-all duration-500 group-hover:translate-x-20 group-hover:translate-y-[50px]">
                                    <div className="flex justify-between items-start">
                                        <div className="text-lg font-semibold">Squirtle</div>
                                    </div>
                                    <img
                                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png"
                                        alt="Squirtle"
                                    />
                                    <div className="text-xs opacity-90 flex justify-between w-full mt-2">
                                        <span>Water</span><span>Lv. 10</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
