module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{html,js,jsx,ts,tsx}", // Note the inclusion of JSX files
    ],
    theme: {
      container: {
        center: true,
        
      },
      extends: {}
    },
    plugins: [require('tailwind-scrollbar')]
  }