module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        codex: {
          marble: '#FFFDF8',
          ivory: '#FBF6EC',
          parchment: '#F7EFE1',
          sand: '#EDE0C8',
          ink: '#1F1A14',
          muted: '#756B5C',
          gold: '#C9A45C',
          deepGold: '#A67C34',
          bronze: '#8B6334'
        }
      },
      boxShadow: {
        marble: '0 24px 80px rgba(31, 26, 20, 0.10)',
        card: '0 16px 45px rgba(31, 26, 20, 0.08)'
      }
    }
  },
  plugins: []
}
