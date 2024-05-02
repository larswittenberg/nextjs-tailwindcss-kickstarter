import Link from 'next/link';

const links = [
	{ href: 'https://nextjs.org/', label: 'Next.js' },
	{ href: 'https://tailwindcss.com/', label: 'Tailwind CSS' },
	{ href: 'https://postcss.org/', label: 'PostCSS' },
	{ href: 'https://tailwindcss.com/docs/typography-plugin', label: '@tailwindcss/typography Plugin' },
];

const features = [
	'Next.js 14.2',
	'React 18.3',
	'TailwindCSS 3.4',
	'TypeScript',
	'PostCSS',
	'Autoprefixer',
	'Prettier',
	'ESLint',
	'React Server Components',
	'Next.js App Router',
	'Google Fonts via next/font',
	'Markdown width mdx',
];

const demoPages = [
	{
		href: '/tailwind-typography',
		label: 'Tailwind Typography Plugin',
	},
	{
		href: '/mdx-page',
		label: 'Markdown Content',
	},
	{
		href: '/rsc',
		label: 'React Server Components',
	},
	{
		href: '/next-image',
		label: 'Next Image',
	},
	{
		href: '/tailwind-jit',
		label: 'Tailwind JIT',
	},
];

export default function Page() {
	return (
		<>
			<div className="py-20">
				<h1 className="mb-12 text-center text-5xl">Next.js + Tailwind CSS Kickstarter</h1>

				<h2 className="mb-2 text-center text-3xl">Tech Stack</h2>
				<ul className="m-auto mb-8 flex flex-wrap items-center justify-between xl:w-2/3">
					{links.map(({ href, label }) => (
						<li key={`${href}${label}`} className="basis-full text-center lg:basis-auto">
							<a href={href} className="p-1">
								{label}
							</a>
						</li>
					))}
				</ul>
				<ul className="m-auto mb-24 flex flex-wrap items-center xl:w-2/3">
					{features.map((item) => (
						<li key={item} className="m-1 rounded bg-gray-700 px-1 text-base">
							{item}
						</li>
					))}
				</ul>

				<h2 className="mb-8 text-center text-3xl">Demo-Pages</h2>
				<ul className="m-auto xl:w-2/3">
					{demoPages.map((item, key) => (
						<li key={key} className="mb-6 text-center">
							<Link className="text-2xl" href={item.href}>
								{item.label}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</>
	);
}
