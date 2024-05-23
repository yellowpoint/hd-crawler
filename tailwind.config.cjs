/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    // 不覆盖原始值
    extend: {
      borderRadius: ({ theme }) => ({
        ...theme('spacing'),
      }),
      fontSize: ({ theme }) => ({
        ...theme('spacing'),
      }),
      lineHeight: ({ theme }) => ({
        ...theme('spacing'),
      }),
      colors: {
        main: '#FCE566',
        text: {
          2: '#A3A3A3',
        },
        bg: {
          1: 'rgba(16, 16, 16, 1)',
        },
        tr: {
          0.1: 'rgba(255, 255, 255, 0.1)',
          2: 'rgba(255, 255, 255, 0.02)',
          5: 'rgba(255, 255, 255, 0.05)',
        },
      },
    },
    // 默认使用px
    spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
      map[index] = `${index}px`;
      return map;
    }, {}),
    screens: {
      // md: { max: '768px' },
      // => @media (max-width: 768px) { ... }
    },
  },
  plugins: [
    // function ({ addUtilities }) {
    //   const fontSm = {
    //     '.text-sm': {
    //       fontSize: '24px',
    //       '@screen md': {
    //         fontSize: '12px',
    //       },
    //     },
    //   };
    //   addUtilities(fontSm);
    // },
  ],
};
