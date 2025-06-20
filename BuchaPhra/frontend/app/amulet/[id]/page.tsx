import { AuctionCard } from '@/components/AuctionCard'
import Lightbox from '@/components/Lightbox'

export default function AmuletDetail({ params: { id } }) {
  const mock = { id, name: 'พระสมเด็จ', image: '/amulets/somdej.jpg', price: 0.5, status: 'auction' }
  return (
    <>
      <AuctionCard {...mock} />
      <Lightbox src={mock.image} alt={mock.name} tokenId={Number(id)} />
    </>
  )
}
