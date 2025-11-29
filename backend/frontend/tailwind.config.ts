import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: false, // Disabled - Light mode only
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "#0F172A", // Deep Navy Blue
                    50: "#F8FAFC",
                    100: "#F1F5F9",
                    200: "#E2E8F0",
                    300: "#CBD5E1",
                    400: "#94A3B8",
                    500: "#64748B",
                    600: "#475569",
                    700: "#334155",
                    800: "#1E293B",
                    900: "#0F172A", // DEFAULT
                    950: "#020617",
                    foreground: "#FFFFFF",
                    hover: "#1E293B", // Lighter shade for hover
                },
                secondary: {
                    DEFAULT: "#B49162", // Bronze/Gold
                    50: "#FDF9F3",
                    100: "#FAF2E6",
                    200: "#F5E4CC",
                    300: "#EFD5B3",
                    400: "#E8C299",
                    500: "#B49162", // DEFAULT
                    600: "#9A7A52",
                    700: "#806342",
                    800: "#664C31",
                    900: "#4D3621",
                    foreground: "#FFFFFF",
                    light: "#D4AF37", // Lighter gold for gradients
                },
                background: {
                    DEFAULT: "#F8F9FA", // Very light off-white/cream
                    dark: "#0F172A",
                },
            },
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
                arabic: ["var(--font-cairo)", "sans-serif"],
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: "1rem",
                    sm: "1.5rem",
                    lg: "2rem",
                    xl: "2.5rem",
                    "2xl": "3rem",
                },
                screens: {
                    sm: "640px",
                    md: "768px",
                    lg: "1024px",
                    xl: "1280px",
                    "2xl": "1400px",
                },
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [],
};

export default config;
