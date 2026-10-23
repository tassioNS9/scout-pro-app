/** @type {import('tailwindcss').Config} */
const { colors } = require("./src/styles/colors");
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ...colors,

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },

        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },

        // Paleta "scout" do projeto Next (valores iguais em light e dark, então ficam fixos em hex)
        // Uso: bg-scout-card, text-scout-muted, bg-scout-goleiro-bg, border-scout-sub17-border...
        scout: {
          bg: "#13192b",
          "bg-alt": "#0f1422",
          card: "#1c2438",
          "card-hover": "#212b42",
          "card-header": "#161e30",
          border: "#252f4a",
          "border-light": "#2a3554",
          green: "#00e676",
          "green-dim": "#1a3b2a",
          "green-border": "#1a4d30",
          text: "#e5e7eb",
          muted: "#8b95b0",
          dim: "#4b5780",

          sub17: { bg: "#1a2540", border: "#1a3560", text: "#60a5fa" },
          profissional: { bg: "#2e1a1a", border: "#4a1a1a", text: "#f87171" },
          sub20: { bg: "#2e2018", border: "#4a2e10", text: "#fb923c" },

          goleiro: { bg: "#1a2e1a", text: "#4ade80", border: "#1a4a1a" },
          zagueiro: { bg: "#1a2540", text: "#60a5fa", border: "#1a3560" },
          lateral: { bg: "#1a2540", text: "#93c5fd", border: "#1a3560" },
          meia: { bg: "#2e2018", text: "#fb923c", border: "#4a2e10" },
          atacante: { bg: "#2e1a1a", text: "#f87171", border: "#4a1a1a" },
          volante: { bg: "#201a2e", text: "#c084fc", border: "#301a4a" },
        },
      },

      fontSize: {
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "30px",
        "4xl": "36px",
      },

      height: {
        button: 57,
      },

      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  darkMode: "class",

  plugins: [require("tailwindcss-animate")],
};
