/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['"Playfair Display"', 'serif'],
            },
            colors: {
                luxora: {
                    ink: '#0B0B0F',
                    charcoal: '#171319',
                    gold: '#C9A35A',
                    champagne: '#EFE0C3',
                    cream: '#F7F1E7',
                    ivory: '#FBF8F1',
                    pearl: '#FFFCF7',
                    porcelain: '#FFFFFF',
                    sage: '#6F7F73',
                    wine: '#7B2D3B',
                    mist: '#E8EDF0',
                    smoke: '#D8D1C6',
                },
            boxShadow: {
                luxora: '0 26px 80px rgba(48, 38, 24, 0.13)',
                glow: '0 0 0 1px rgba(201, 163, 90, 0.22), 0 18px 48px rgba(201, 163, 90, 0.16)',
                header: '0 18px 55px rgba(48, 38, 24, 0.10)',
            },
        },
    },
    },
    plugins: [],
};
