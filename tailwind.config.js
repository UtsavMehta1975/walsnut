/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        highlight: {
          DEFAULT: '#FFF9C4',
          '50': '#FFFEF7',
          '100': '#FFFDF0',
          '200': '#FFFBE0',
          '300': '#FFF9C4',
          '400': '#FFF59E',
          '500': '#FFF176',
          '600': '#FFEE58',
          '700': '#FFEB3B',
          '800': '#FDD835',
          '900': '#FBC02D'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '0.75rem'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Inter', 'sans-serif'],
        mono: ['Inter', 'monospace'],
        lato: ['Lato', 'sans-serif'],
        doughnuts: ['Doughnuts Are Forever', 'cursive'],
        roxborough: ['RoxboroughCF', 'sans-serif'],
        monckeberg: ['Monckeberg Alt Normal', 'sans-serif'],
        belinda: ['Belinda', 'cursive'],
        arbo: ['Arbo', 'sans-serif'],
        abril: ['Abril Fatface', 'cursive']
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

