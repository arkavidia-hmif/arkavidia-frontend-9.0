import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      sm: '393px',
      md: '768px',
      lg: '1024px',
      xl: '1440px'
    },
    extend: {
      colors: {
        // -- Shadcn's default configuration --
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        },
        // -- End of Shadcn's default configuration --
        red: {
          '100': '#FACCCC',
          '200': '#F59999',
          '300': '#EF6666',
          '400': '#EA3333',
          '500': '#E50000',
          '600': '#B70000',
          '700': '#890000',
          '800': '#5C0000',
          '900': '#2E0000'
        },
        green: {
          '100': '#CCEBD6',
          '200': '#99D6AD',
          '300': '#66C285',
          '400': '#33AD5C',
          '500': '#009933',
          '600': '#007A29',
          '700': '#005C1F',
          '800': '#003D14',
          '900': '#001F0A'
        },
        yellow: {
          '100': '#FFF5CC',
          '200': '#FFEB99',
          '300': '#FFE066',
          '400': '#FFD633',
          '500': '#FFCC00',
          '600': '#CCA300',
          '700': '#997A00',
          '800': '#665200',
          '900': '#332900'
        },
        pink: {
          '100': '#FFDCE7',
          '200': '#FFB8CF',
          '300': '#FF95B8',
          '400': '#FF71A0',
          '500': '#FF4E88',
          '600': '#CC3E6D',
          '700': '#992F52',
          '800': '#661F36',
          '900': '#33101B'
        },
        teal: {
          '100': '#DAFAFF',
          '200': '#B6F5FF',
          '300': '#91F0FF',
          '400': '#6DEBFF',
          '500': '#48E6FF',
          '600': '#3AB8CC',
          '700': '#2B8A99',
          '800': '#1D5C66',
          '900': '#0E2E33'
        },
        purple: {
          '100': '#DBCDEF',
          '200': '#B89BDF',
          '300': '#946AD0',
          '400': '#7138C0',
          '500': '#4D06B0',
          '600': '#3E058D',
          '700': '#2E046A',
          '800': '#1F0246',
          '900': '#0F0123'
        },
        lilac: {
          '100': '#F5E1FF',
          '200': '#EBC3FF',
          '300': '#E2A6FF',
          '400': '#D888FF',
          '500': '#CE6AFF',
          '600': '#A555CC',
          '700': '#7C4099',
          '800': '#522A66',
          '900': '#291533'
        },
        blue: {
          '100': '#D1D8E7',
          '200': '#A4B2CF',
          '300': '#768BB8',
          '400': '#4965A0',
          '500': '#1B3E88',
          '600': '#16326D',
          '700': '#102552',
          '800': '#0B1936',
          '900': '#050C1B'
        },
        neutral: {
          '50': '#F2F2F2',
          '100': '#E5E5E5',
          '150': '#D9D9D9',
          '200': '#CCCCCC',
          '250': '#BFBFBF',
          '300': '#B2B2B2',
          '350': '#A6A6A6',
          '400': '#999999',
          '450': '#8C8C8C',
          '500': '#808080',
          '550': '#737373',
          '600': '#666666',
          '650': '#595959',
          '700': '#4D4D4D',
          '750': '#404040',
          '800': '#333333',
          '850': '#262626',
          '900': '#1A1A1A',
          '950': '#0D0D0D'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        belanosima: ['Belanosima', 'sans-serif'],
        teachers: ['Teachers', 'sans-serif'],
        dmsans: ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config
