/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["'Orbitron'", "sans-serif"],
      },
    },
  },
  safelist: [
    // Text sizes
    "text-3xl",
    "text-4xl",
    "text-5xl",
    "text-6xl",
    "text-7xl",
    "text-lg",
    "text-base",
    "text-sm",
    "text-xs",

    // Widths & Heights
    "w-full",
    "h-full",
    "xl:max-w-5xl",
    "max-w-4xl",
    "xl:h-[475px]",
    "h-[375px]",
    "xl:w-[860px]",
    "w-[calc(100%-160px)]",
    "h-[125px]",
    "min-w-[160px]",
    "max-w-[190px]",
    "xl:min-w-[190px]",
    "xl:max-w-[190px]",

    // Typography & font
    "font-bold",
    "font-['Orbitron']",
    "font-sans",
    "font-['sans-serif']",

    // Colors
    "bg-white",
    "text-[#0f172a]",
    "text-white",
    "text-gray-300",
    "bg-opacity-20",

    // Backgrounds
    "bg-[url('/assets/earth.jpg')]",
    "bg-no-repeat",
    "bg-cover",
    "bg-center",
    "backdrop-blur-md",

    // Borders and effects
    "rounded-md",
    "rounded-lg",
    "shadow-lg",
    "border",
    "border-white",

    // Layout helpers
    "flex",
    "hidden",
    "block",
    "items-center",
    "justify-center",
    "gap-2",
    "xl:gap-4",

    // Z-index
    "z-5",
    "z-10",
    "z-50",
    "z-100",
    "z-500",
  ],
};
