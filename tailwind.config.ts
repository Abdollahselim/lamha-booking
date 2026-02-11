import { type Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4C90A3', // Lamha brand teal (updated)
          dark: '#3B707E',
        },
      },
      fontFamily: {
        sans: ["'Noto Sans Arabic'", 'Almarai', 'Outfit', 'sans-serif'],
        mono: ["'Noto Sans Arabic'", 'Almarai', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
