module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			backgroundImage: (theme) => ({
				'basic-profile': "url('https://tiermaker.com/images/templates/4968001594567697.jpg')",
			}),
			colors: {
				mint: '#0cc6b8',
				'hover-mint': '#25afa2',
				'ring-mint': '#0cc6b682',
				skyblue: '#d2f4ff',
				'dark-skyblue': '#22829f',
				lightgreen: '#d7f3db',
				'dark-lightgreen': '#278735',
				lightcoral: '#ffe3de',
				'dark-lightcoral': '#ec8676',
				lightgray: '#f9fafc',
			},
		},
	},
	plugins: [],
};
