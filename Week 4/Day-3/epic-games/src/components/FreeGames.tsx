import { Gift } from "lucide-react"

interface FreeGame {
  id: string
  title: string
  availability: string
  image: string
  imageAlt: string
}

const freeGames: FreeGame[] = [
  {
    id: "darkwood",
    title: "Darkwood",
    availability: "Free Now • Jul 25",
    image: "/darkwood-horror-forest.png",
    imageAlt: "Darkwood dark horror game",
  },
  {
    id: "assassins-creed",
    title: "Assassin's Creed Black Flag",
    availability: "Free Now • Jul 25",
    image: "/black-flag-naval-combat.png",
    imageAlt: "Assassin's Creed Black Flag pirate theme",
  },
  {
    id: "nfs-shift",
    title: "NFS: Shift",
    availability: "Free Jul 27 - Aug 5",
    image: "/nfs-shift-simulation.png",
    imageAlt: "NFS Shift racing simulation",
  },
  {
    id: "warface",
    title: "Warface",
    availability: "Free Jul 27 - Aug 5",
    image: "/warface-soldiers-combat.png",
    imageAlt: "Warface military shooter game",
  },
]

export function FreeGames() {
  return (
    <section className="w-full py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-white" />
          <h2 className="text-white font-semibold">Free Games</h2>
        </div>
        <button className="text-gray-400 text-sm border border-gray-600 px-3 py-1 rounded hover:bg-gray-700 transition-colors">
          view More
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {freeGames.map((game) => (
          <div
            key={game.id}
            className="relative rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="aspect-[4/5] relative">
              <img src={game.image || "/placeholder.svg"} alt={game.imageAlt} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-semibold text-sm mb-1">{game.title}</h3>
                <p className="text-gray-300 text-xs">{game.availability}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
