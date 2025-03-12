import type { Config } from "tailwindcss";

export default {
  content: ["./layout/**/*.liquid", "./sections/**/*.liquid", "./snippets/**/*.liquid", "./templates/**/*.liquid", "./src/**/*.{ts,js}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
        discount: "hsl(var(--discount))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        primary: ["var(--font-primary)", "system-ui", "sans-serif"],
        secondary: ["var(--font-secondary)", "system-ui", "sans-serif"],
      },
      screens: {
        "hover-supported": { raw: "(hover: hover) and (pointer: fine)" },
        touch: { raw: "(pointer: coarse)" },
        mouse: { raw: "(pointer: fine)" },
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.77, 0.01, 1, 0.18)",
        "out-expo": "cubic-bezier(0, 0.4, 0, 1.02)",
        "in-out-expo": "cubic-bezier(0.93, -0.01, 0, 1.02)",
      },
    },
  },
  plugins: [require("tailwindcss-multi")],
} satisfies Config;
