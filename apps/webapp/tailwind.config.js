/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif']
      },
      colors: {
        arena: {
          gold: '#C9A45C',
          blue: '#2F7EA5',
          ivory: '#1F1A14',
          muted: '#756B5C'
        },
        codex: {
          marble: '#FFFDF8',
          ivory: '#FBF6EC',
          sand: '#EDE0C8',
          gold: '#C9A45C',
          deepGold: '#A67C34',
          muted: '#756B5C'
        }
      },
      boxShadow: {
        marble: '0 18px 55px rgba(31, 26, 20, .09)',
        card: '0 8px 24px rgba(31, 26, 20, .06)'
      }
    }
  },
  plugins: []
}
