// https://nextjs.org/docs/app/building-your-application/styling/tailwind-css
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}', // Note the addition of the `app` directory.
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,jsx,ts,tsx,mdx}',
	],
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
