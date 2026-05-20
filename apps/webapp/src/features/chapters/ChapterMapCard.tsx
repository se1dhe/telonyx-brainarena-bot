import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import type { ChapterNodeSummary } from '../../api/contracts'
import { NodeStars } from './NodeStars'

type ChapterMapCardProps = {
  nodes: ChapterNodeSummary[]
  selectedNodeId?: number
  onNodeSelect?: (node: ChapterNodeSummary) => void
}

export function ChapterMapCard({ nodes, selectedNodeId, onNodeSelect }: ChapterMapCardProps) {
  const earnedStars = nodes.reduce((sum, node) => sum + node.stars, 0)

  return (
    <section className="arena-card map-card-shell relative overflow-hidden p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="arena-label">Карта прохождения</p>
          <h2 className="mt-1 text-2xl font-bold text-arena-ivory">Глава I · Путь знатока</h2>
        </div>
        <div className="rounded-full border border-arena-blue/40 bg-arena-blue/10 px-3 py-1 text-sm font-bold text-arena-blue">
          {earnedStars} / 15 ★
        </div>
      </div>

      <div className="map-surface mt-4">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M16 74 C28 63 31 60 42 52 S58 39 68 32 S78 45 82 62 S70 77 56 82" fill="none" stroke="rgba(166,124,52,.24)" strokeWidth="1.8" strokeDasharray="4 4" />
          <path d="M16 74 C28 63 31 60 42 52 S58 39 68 32" fill="none" stroke="rgba(166,124,52,.58)" strokeWidth="2.4" />
        </svg>
        {nodes.map((node) => (
          <motion.button
            key={node.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: node.id * 0.06 }}
            className={[
              node.status === 'active' ? 'map-node map-node-active' : node.status === 'locked' ? 'map-node map-node-locked' : 'map-node map-node-done',
              selectedNodeId === node.id ? 'map-node-selected' : ''
            ].join(' ')}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={() => onNodeSelect?.(node)}
            type="button"
          >
            <span className="text-lg font-bold">{node.id}</span>
            <span className="mt-1 flex gap-0.5">
              <NodeStars stars={node.stars} />
            </span>
            {node.status === 'locked' && <Lock className="absolute -right-1 -top-1 h-4 w-4 text-arena-muted" />}
          </motion.button>
        ))}
      </div>
    </section>
  )
}
