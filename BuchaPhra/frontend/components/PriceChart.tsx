interface PricePoint { date: string; price: number }

export default function PriceChart({ data }: { data: PricePoint[] }) {
  return (
    <svg width="300" height="100" data-testid="price-chart">
      {data.map((pt, i) => (
        <circle key={i} cx={i * 30 + 10} cy={100 - pt.price * 10} r="3" />
      ))}
    </svg>
  )
}
