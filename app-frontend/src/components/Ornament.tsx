type OrnamentProps = {
  src: string
  className?: string
}

export function Ornament({ src, className = '' }: OrnamentProps) {
  return <img src={src} alt="" aria-hidden="true" className={className} />
}
