
'use client';
import Image from 'next/image';
import { Game } from '../types/Game';


export default function GameCard({ game }: { game: Game }) {
return (
<article id={game.slug} className="group bg-neutral-900/60 hover:bg-neutral-900 transition border border-neutral-800 rounded-3xl overflow-hidden">
<div className="relative aspect-[16/9]">
<Image src={game.image} alt={game.title} fill className="object-cover group-hover:scale-[1.02] transition" />
</div>
<div className="p-4">
<h3 className="font-semibold line-clamp-1">{game.title}</h3>
<p className="text-sm text-neutral-400 line-clamp-2 mt-1">{game.description}</p>
<div className="mt-3 flex items-center justify-between text-sm">
<span className="text-neutral-300">{game.genre}</span>
<span className="font-semibold">{game.price === 0 ? 'Free' : `$${game.price.toFixed(2)}`}</span>
</div>
</div>
</article>
);
}