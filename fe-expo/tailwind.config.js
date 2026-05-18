/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        nekoYellow: '#FFD166',
        nekoGreen: '#06D6A0',
        nekoBg: '#F8F9FA',
        nekoCard: '#FFFFFF',
        nekoText: '#1A1A1A',
        nekoMuted: '#8A8A8A',
        nekoBorder: '#F0F0F0',
        nekoPink: '#FFB3C6',
        nekoLavender: '#C5B3FF',
        nekoAmber: '#FF8C00',
        nekoAmberTint: '#FFF3E0',
        nekoRed: '#FF3B30',
      },
      borderRadius: {
        nekoCard: '20px',
        nekoImage: '12px',
      },
    },
  },
  plugins: [],
};
