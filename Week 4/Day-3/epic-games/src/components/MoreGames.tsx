interface Game {
  id: string
  title: string
  description: string
  price: string
  image: string
  imageAlt: string
}

const moreGames: Game[] = [
  {
    id: "nfs-unbound",
    title: "NFS UNBOUND",
    description: "Experience NFS Unbound and get an exclusive Driving Effect, License Plate, $150,000 Bank, and more.",
    price: "₹3,499",
    image: "/nfs.jpg",
    imageAlt: "NFS Unbound game with racing car and graffiti effects",
  },
  {
    id: "fifa-23",
    title: "FIFA 23",
    description:
      "FIFA 23 brings The World's Game to the pitch, with HyperMotion2 Technology, men's and women's FIFA World Cup.",
    price: "₹3,699",
    image: "/fifa2023.jpg",
    imageAlt: "FIFA 23 with soccer player in action",
  },
  {
    id: "uncharted-4",
    title: "UNCHARTED 4",
    description:
      "Get the definitive Uncharted 4 experience with all Season Pass content, the Ultimate Pack, and upcoming expansion.",
    price: "₹2,199",
    image: "/un4.jpg",
    imageAlt: "Uncharted 4 with Nathan Drake silhouette",
  },
]

export function MoreGames() {
  return (
    <section className=" px-6 w-full py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moreGames.map((game) => (
          <div
            key={game.id}
            className=" overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="aspect-[7/4] relative ">
              <img src={game.image} alt={game.imageAlt} className=" rounded-lg w-full h-full object-cover" />
            </div>
            <div className="py-4 space-y-2">
              <h3 className=" text-white text-base uppercase tracking-wide">{game.title}</h3>
              <p className="text-gray-300 text-sm tracking-wider leading-relaxed">{game.description}</p>
              <div className="pt-2">
                <span className="text-white  text-sm">{game.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
