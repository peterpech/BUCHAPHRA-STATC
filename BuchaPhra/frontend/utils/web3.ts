import { useEffect, useState } from 'react'

export function useWeb3Auction(tokenId: number) {
  const [highestBid, setHighestBid] = useState(0)

  useEffect(() => {
    // Placeholder for Web3 logic
    setHighestBid(tokenId * 0.1)
  }, [tokenId])

  return { highestBid }
}
