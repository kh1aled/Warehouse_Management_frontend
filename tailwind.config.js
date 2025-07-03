module.exports = {
    darkMode: 'class',
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'main-color': '#2C6AE5',
                'green-color': '#32C98D',
                'pink-color': '#611BCB',
                'orange-color': '#FF9720',
                'border-color': 'rgb(239 240 242)',
                'gray-color': 'rgb(239 240 242)',
                'icon-color': 'rgba(0, 0, 0, 1)',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
