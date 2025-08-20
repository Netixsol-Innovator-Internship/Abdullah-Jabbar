'use client';


import { create } from 'zustand';
import { Game } from '../types/Game';
import { mockGames } from '../lib/mockData';


interface GameState {
games: Game[];
featured: Game[];
setGames: (list: Game[]) => void;
}


export const useGameStore = create<GameState>((set) => ({
games: mockGames,
featured: mockGames.filter(g => g.featured),
setGames: (list) => set({ games: list, featured: list.filter(g => g.featured) }),
}));