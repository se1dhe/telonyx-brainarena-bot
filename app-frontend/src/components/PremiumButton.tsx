import { motion } from 'framer-motion'
import clsx from 'clsx'

type PremiumButtonProps = {
  children: string
  variant?: 'primary' | 'secondary'
  className?: string
}

export function PremiumButton({ children, variant = 'primary', className }: PremiumButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'rounded-xl px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition',
        variant === 'primary'
          ? 'bg-gradient-to-b from-codex-gold to-codex-deepGold text-white shadow-card'
          : 'border border-codex-gold/40 bg-white/45 text-codex-deepGold',
        className
      )}
    >
      {children}
    </motion.button>
  )
}
