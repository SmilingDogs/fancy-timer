// tailwind.config.js
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
    // Fonts
    "font-['Orbitron']",
    "font-sans",

    // Font Sizes
    "text-3xl",
    "text-4xl",
    "text-5xl",
    "text-6xl",
    "text-xs",
    "text-sm",
    "text-lg",
    "text-base",

    // Widths / Heights
    "w-2/3",
    "w-full",
    "w-[calc(100%-160px)]",
    "h-full",
    "h-screen",
    "h-[125px]",
    "h-[360px]",
    "h-[375px]",
    "xl:h-[475px]",
    "min-h-screen",
    "min-w-[160px]",
    "max-w-[160px]",
    "xl:max-w-5xl",
    "max-w-4xl",
    "xl:max-w-[190px]",
    "xl:min-w-[190px]",

    // Z-index
    "z-0",
    "z-1",
    "z-2",
    "z-5",
    "z-10",
    "z-50",
    "z-100",
    "z-500",

    // Flex/grid helpers
    "flex",
    "items-center",
    "justify-center",
    "items-start",
    "justify-between",
    "justify-end",
    "flex-wrap",
    "gap-2",
    "gap-3",
    "gap-4",
    "xl:gap-4",
    "xl:px-4",
    "px-2",
    "pb-4",
    "mt-2",
    "xl:mt-4",
    "mb-2",
    "mb-3",
    "mb-6",

    // Backgrounds and effects
    "bg-white",
    "bg-gray-100",
    "bg-gray-300",
    "bg-opacity-20",
    "bg-no-repeat",
    "bg-cover",
    "bg-center",
    "backdrop-blur-md",

    // Borders
    "rounded-md",
    "rounded-lg",
    "border",
    "border-white",

    // Text colors
    "text-white",
    "text-black",
    "text-[#0f172a]",
    "text-yellow-500",
    "text-blue-500",
    "text-red-500",
    "text-gray-300",

    // Shadow
    "shadow-md",
    "shadow-lg",
    "shadow-xl",

    // Custom image backgrounds
    "bg-[url('/assets/earth.jpg')]",
  ],
};
