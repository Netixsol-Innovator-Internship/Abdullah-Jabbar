'use client';
import { useMemo, useState } from 'react';
import { useGameStore } from '../store/useGameStore';
import GameCard from './GameCard';


export default function GameGrid() {
const games = useGameStore(s => s.games);
const [q, setQ] = useState('');
const [genre, setGenre] = useState('All');


const genres = useMemo(() => ['All', ...Array.from(new Set(games.map(g => g.genre)))], [games]);


const filtered = useMemo(() => {
return games.filter(g => {
const matchesQuery = g.title.toLowerCase().includes(q.toLowerCase());
const matchesGenre = genre === 'All' || g.genre === genre;
return matchesQuery && matchesGenre;
});
}, [games, q, genre]);


return (
<div className="space-y-6">
<div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
<input
value={q}
onChange={e => setQ(e.target.value)}
placeholder="Search games…"
className="w-full md:w-1/2 rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
/>
<select
value={genre}
onChange={e => setGenre(e.target.value)}
className="w-full md:w-auto rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2 text-sm"
>
{genres.map(g => (
<option key={g} value={g}>{g}</option>
))}
</select>
</div>


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
{filtered.map(game => (
<GameCard key={game.id} game={game} />
))}
</div>
</div>
);
}