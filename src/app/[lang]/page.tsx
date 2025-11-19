import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/src/i18n-config';

const links = [
	{ href: 'https://nextjs.org/', label: 'Next.js' },
	{ href: 'https://tailwindcss.com/', label: 'Tailwind CSS' },
	{ href: 'https://postcss.org/', label: 'PostCSS' },
	{ href: 'https://tailwindcss.com/docs/typography-plugin', label: '@tailwindcss/typography Plugin' },
];

const features = [
        'Next.js 16.0',
        'React 19.2',
        'TailwindCSS 4.1',
	'SCSS Support',
	'TypeScript',
	'PostCSS',
	'Autoprefixer',
	'Prettier',
	'ESLint',
	'React Server Components',
	'Next.js App Router',
	'i18n Support',
	'Google Fonts via next/font',
	'Markdown width mdx',
];

const demoPages = [
	{
		href: 'tailwind-typography',
		label: 'Tailwind Typography Plugin',
	},
	{
		href: 'mdx-page',
		label: 'Markdown Content',
	},
	{
		href: 'rsc',
		label: 'React Server Components',
	},
	{
		href: 'scss-page',
		label: 'SCSS Demo-Page',
	},
];

export default async function IndexPage(props: { params: Promise<{ lang: Locale }> }) {
	const params = await props.params;

	const { lang } = params;

	const dictionary = await getDictionary(lang);

	return (
		<>
			<div className="py-20">
				<h1 className="mb-6 text-center text-5xl">Next.js + TailwindCSS Kickstarter</h1>

				<p className="mb-12 text-center text-xl">
					<a
						href="https://github.com/larswittenberg/nextjs-tailwindcss-kickstarter"
						className="dark:text-gray-300"
					>
						GitHub
					</a>
				</p>

				<h2 className="mb-2 text-center text-3xl">{dictionary['indexPage'].techStackHeadline}</h2>
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
						<li key={item} className="m-1 rounded-sm bg-gray-700 px-1 text-base">
							{item}
						</li>
					))}
				</ul>

				<h2 className="mb-8 text-center text-3xl">{dictionary['indexPage'].demoHeadline}</h2>
				<ul className="m-auto xl:w-2/3">
					{demoPages.map((item, key) => (
						<li key={key} className="mb-6 text-center">
							<Link className="text-2xl" href={`${lang}/${item.href}`}>
								{item.label}
							</Link>
						</li>
					))}
				</ul>

				<h2 className="mt-24 mb-8 text-center text-3xl">Next.js Image Demo</h2>
				<figure>
					<Image
						src="/images/unsplash.jpg"
						width={1920}
						height={1280}
						alt="Alpe di Siusi, Italia from Pietro De Grandi from Unsplash"
						priority
					/>
					<figcaption>
						<span>
							Alpe di Siusi, Italia. Photo by{' '}
							<a href="https://unsplash.com/@peter_mc_greats?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
								Pietro De Grandi
							</a>{' '}
							on{' '}
							<a href="https://unsplash.com/images/nature?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
								Unsplash
							</a>
						</span>
					</figcaption>
				</figure>

			</div>
		</>
	);
}
