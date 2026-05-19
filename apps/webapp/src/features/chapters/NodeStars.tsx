import { Star } from 'lucide-react'

type NodeStarsProps = {
  stars: number
  size?: 'sm' | 'md'
}

export function NodeStars({ stars, size = 'sm' }: NodeStarsProps) {
  const className = size === 'md' ? 'h-5 w-5' : 'h-3 w-3'

  return (
    <>
      {[0, 1, 2].map((star) => (
        <Star
          key={star}
          className={star < stars ? `${className} fill-arena-gold text-arena-gold` : `${className} text-codex-muted/30`}
        />
      ))}
    </>
  )
}
