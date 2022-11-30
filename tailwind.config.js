module.exports = {
	content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			colors: {
				orange: '#ef7c17',
				darkblue: '#1c2532',
			},
			typography: {
				DEFAULT: {
					css: {
						// color: '#ff0',
					},
				},
			},
		},
	},
	plugins: [require('@tailwindcss/typography')],
};
