/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neo-yellow': '#FFFF00',
        'neo-pink': '#FF00FF',
        'neo-cyan': '#00FFFF',
        'neo-green': '#00FF00',
        'neo-orange': '#FF8000',
        'neo-purple': '#8B5CF6',
        'neo-white': '#FAFAFA',
        'neo-black': '#000000',
        'neo-gray': '#808080',
      },
      fontFamily: {
        'grotesk': ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #000000',
        'neo-lg': '6px 6px 0px 0px #000000',
        'neo-xl': '8px 8px 0px 0px #000000',
      },
      animation: {
        'bounce-subtle': 'bounce 0.3s ease-in-out',
      }
    },
  },
  plugins: [],
}