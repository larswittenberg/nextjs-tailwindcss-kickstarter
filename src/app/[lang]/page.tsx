import Link from 'next/link';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/src/i18n-config';
import customAlertDataFromJson from '../../custom-alert.json';

const links = [
	{ href: 'https://nextjs.org/', label: 'Next.js' },
	{ href: 'https://tailwindcss.com/', label: 'Tailwind CSS' },
	{ href: 'https://postcss.org/', label: 'PostCSS' },
	{ href: 'https://tailwindcss.com/docs/typography-plugin', label: '@tailwindcss/typography Plugin' },
];

const features = [
        'Next.js 15.5',
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
		href: 'next-image',
		label: 'Next Image',
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
	const dataFromJson = customAlertDataFromJson.data.filter(
		(item) => item.published === true && item.language === lang,
	)[0];

	return (
		<>
			<div className="py-20">
				<h1 className="mb-6 text-center text-5xl">Next.js + TailwindCSS Kickstarter</h1>

				{dataFromJson && dataFromJson.title && (
					<div className="my-12 rounded-xl bg-green-200 p-6 text-black">
						{dataFromJson.date && <p className="">{dataFromJson.date}</p>}
						{dataFromJson.title && <h2 className="mb-2 text-2xl">{dataFromJson.title}</h2>}
						{dataFromJson.message && <p className="">{dataFromJson.message}</p>}
						{dataFromJson.link && dataFromJson.linktext && (
							<a
								href={dataFromJson.link}
								className="mt-2 block underline"
								target="_blank"
								rel="noopener noreferrer"
							>
								{dataFromJson.linktext}
							</a>
						)}
					</div>
				)}

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
			</div>
		</>
	);
}
