const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
	// https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
	reactStrictMode: true,
	// Configure `pageExtensions`` to include MDX files
	pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
	// Optionally, add any other Next.js config below
	sassOptions: {
		includePaths: [path.join(__dirname, 'src/scss')],
	},
};

module.exports = nextConfig;
