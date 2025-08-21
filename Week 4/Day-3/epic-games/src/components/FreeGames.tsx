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
    availability: "Free Now - Jul 25",
    image: "/darkwood.jpg",
    imageAlt: "Darkwood dark horror game",
  },
  {
    id: "assassins-creed",
    title: "Assassin's Creed Black Flag",
    availability: "Free Now - Jul 25",
    image: "/ascreed.jpg",
    imageAlt: "Assassin's Creed Black Flag pirate theme",
  },
  {
    id: "nfs-shift",
    title: "NFS: Shift",
    availability: "Free Jul 27 - Aug 5",
    image: "/nfsShift.jpg",
    imageAlt: "NFS Shift racing simulation",
  },
  {
    id: "warface",
    title: "Warface",
    availability: "Free Jul 27 - Aug 5",
    image: "/warfare.jpg",
    imageAlt: "Warface military shooter game",
  },
]

export function FreeGames() {
  return (
    <section className="w-full px-10 py-2 bg-[#2A2A2A]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Gift className="w-7 h-7 text-white" />
          <h2 className="text-white font-medium">Free Games</h2>
        </div>
        <button className="cursor-pointer text-white text-sm border border-white px-3 py-1 rounded hover:bg-gray-700 transition-colors">
          view More
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-8">
        {freeGames.map((game) => (
          <div
            key={game.id}
            className=" overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="aspect-[44/63]">
              <img src={game.image} alt={game.imageAlt} className="w-full h-full object-cover rounded-lg" />
            </div>
            <div className="bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-semibold text-sm mb-1 md:leading-5 lg:leading-9">{game.title}</h3>
                <p className="text-gray-300 text-xs">{game.availability}</p>
              </div>
          </div>
        ))}
      </div>
    </section>
  )
}
