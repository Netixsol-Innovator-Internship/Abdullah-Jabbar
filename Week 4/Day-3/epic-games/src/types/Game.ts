export type Game = {
id: string;
slug: string;
title: string;
description: string;
image: string;
genre: 'Action' | 'RPG' | 'Simulation' | 'Strategy' | 'Indie' | 'Adventure' | (string & {});
price: number; // 0 for Free
featured: boolean;
};