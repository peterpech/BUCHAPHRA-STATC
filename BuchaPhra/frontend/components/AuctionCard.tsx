export interface AuctionProps {
  id: string
  name: string
  image: string
  price: number
  status: string
}

export function AuctionCard({ id, name, image, price, status }: AuctionProps) {
  return (
    <div className="border rounded p-4" data-testid={`auction-${id}`}> 
      <img src={image} alt={name} className="w-full" />
      <h2 className="font-semibold mt-2">{name}</h2>
      <p className="text-sm">Price: {price} ETH</p>
      <p className="text-sm">Status: {status}</p>
    </div>
  )
}
