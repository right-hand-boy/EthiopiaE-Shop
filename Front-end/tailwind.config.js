// /** @type {import('tailwindcss').Config} */
// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   darkMode: "class", // Enables dark mode based on the class strategy
//   theme: {
//     extend: {
//       colors: {
//         body: {
//           DEFAULT: "#e4e9f7", // Light mode body background color
//           dark: "#18191a", // Dark mode body background color
//         },
//         nav: {
//           DEFAULT: "#05599d", // Light mode primary nav background color
//           dark: "#041B32", // Dark mode primary nav background color
//         },
//         sideNav: {
//           DEFAULT: "#d1d3d9", // Light and dark mode side nav background color
//           dark: "#18191a",
//         },
//         text: {
//           DEFAULT: "#fff", // Light mode text color
//           dark: "#ccc", // Dark mode text color
//         },
//         searchBar: {
//           DEFAULT: "#f2f2f2", // Light mode search bar background color
//           dark: "#242526", // Dark mode search bar background color
//         },
//         searchText: {
//           DEFAULT: "#010718", // Light and dark mode search text color
//         },
//         button: {
//           DEFAULT: "#00f174fc",
//           // DEFAULT: "#f97316",
//           dark: "#4CAF50", // Light and dark mode search text color
//           // DEFAULT: "#1fbf94",
//           // dark: "#eded21db", // Light and dark mode search text color
//         },
//         modal: {
//           DEFAULT: "#05599d",
//           // dark: "#242526", // Light and dark mode search text color
//           dark: "#041B32", // Light and dark mode search text color
//         },
//       },
//     },
//   },
//   plugins: [],
// };
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // Enables dark mode based on the class strategy
  theme: {
    extend: {
      colors: {
        body: {
          DEFAULT: "#e4e9f7", // Light mode body background color
          dark: "#18191a", // Dark mode body background color
        },
        nav: {
          DEFAULT: "#05599d", // Light mode primary nav background color
          dark: "#041B32", // Dark mode primary nav background color
        },
        sideNav: {
          DEFAULT: "#d1d3d9", // Light and dark mode side nav background color
          dark: "#18191a", // Dark mode side nav background color
        },
        text: {
          DEFAULT: "#fff", // Light mode text color
          dark: "#ccc", // Dark mode text color
        },
        searchBar: {
          DEFAULT: "#f2f2f2", // Light mode search bar background color
          dark: "#242526", // Dark mode search bar background color
        },
        searchText: {
          DEFAULT: "#010718", // Light and dark mode search text color
        },
        button: {
          DEFAULT: "#00f174fc", // Light mode button color
          dark: "#4CAF50", // Dark mode button color
        },
        modal: {
          DEFAULT: "#05599d", // Light mode modal color
          dark: "#041B32", // Dark mode modal color
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
