import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import { Color } from './styles'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ...Color,
      },
    },
  },
  plugins: [
    plugin(({ addComponents }) => {
      addComponents({
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
        },
      })
    }),
  ],
}

export default config
