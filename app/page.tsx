import Image from 'next/image';
import Link from 'next/link';

const links = [
	{ href: 'https://nextjs.org/', label: 'Next.js' },
	{ href: 'https://tailwindcss.com/', label: 'Tailwind CSS' },
	{ href: 'https://postcss.org/', label: 'PostCSS' },
	{ href: 'https://tailwindcss.com/docs/typography-plugin', label: '@tailwindcss/typography Plugin' },
];

const features = [
	'Next.js 14',
	'React 18.2',
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

export default function Page() {
	return (
		<>
			<div className="py-20">
				<h1 className="mb-12 text-center text-5xl">Next.js + Tailwind CSS Kickstarter</h1>
				<h2 className="mb-2 text-center text-3xl">Tech Stack</h2>
				<ul className="m-auto flex flex-wrap items-center justify-between xl:w-2/3">
					{links.map(({ href, label }) => (
						<li key={`${href}${label}`} className="basis-full text-center lg:basis-auto">
							<a href={href} className="p-1">
								{label}
							</a>
						</li>
					))}
				</ul>

				<ul className="m-auto mt-8 flex flex-wrap items-center xl:w-2/3">
					{features.map((item) => (
						<li key={item} className="m-1 rounded bg-gray-700 px-1 text-base">
							{item}
						</li>
					))}
				</ul>
			</div>

			<hr className="my-16" />

			<div className="flex flex-col items-center justify-center">
				<h2 className="mb-8 text-center text-3xl">Demo-Pages</h2>
				<Link className="mb-8 text-center text-2xl" href="/tailwind-typography">
					Tailwind Typography Plugin
				</Link>
				<br />
				<Link className="mb-8 text-center text-2xl" href="/mdx-page">
					Markdown Content
				</Link>
				<br />
				<Link className="text-center text-2xl" href="/rsc">
					React Server Components
				</Link>
			</div>

			<hr className="my-16" />

			<p className="text-[#f00] dark:text-[#ff0]">
				This paragraph uses a TailwindCSS Feature from the Just-in-Time Mode: Generate arbitrary styles without
				writing custom CSS.
				<br />
				The <code className="">className=&quot;text-[#f00]&quot;</code> generates a class that is not part of
				the default TailwindCSS config and not a custom theme config. This is a specific ulitity class with a
				text-color: #f00. And for color-schema dark{' '}
				<code className="">className=&quot;dark:text-[#ff0]&quot;</code>{' '}
				<a href="https://tailwindcss.com/docs/just-in-time-mode" className="">
					Read more
				</a>
			</p>
			<p className="">
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id corrupti maxime similique quisquam sunt
				quis vero culpa <em>awesome</em> ipsum ullam vel odit eligendi, quo illum, aliquid sequi quae. Possimus,
				dignissimos!
			</p>

			<hr className="my-16" />

			<h2 className="mb-8 text-center text-2xl">Next.js Image Demo</h2>
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
		</>
	);
}
