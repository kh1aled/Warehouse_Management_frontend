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
                'dark-border-color': '#505050 ',
                'gray-color': 'rgb(239 240 242)',
                'icon-color': 'rgba(0, 0, 0, 1)',
                'black-color': '#212121',
                'white-color': '#ffffff',
                'secondary-dark': '#181818',
                'dark-gray-color': '#303030',
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
