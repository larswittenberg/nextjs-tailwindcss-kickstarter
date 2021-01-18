module.exports = {
	purge: false,
	darkMode: 'media', // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				'orange': '#ef7c17',
				'darkblue': '#1c2532',
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/typography'),
	],
}
