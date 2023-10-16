import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'Next.js + Tailwind CSS Kickstarter',
	description: 'Basic template setup with Next.js + Tailwind CSS and some helpers.',
}

const links = [
	{ href: 'https://nextjs.org/', label: 'Next.js' },
	{ href: 'https://tailwindcss.com/', label: 'Tailwind CSS' },
	{ href: 'https://purgecss.com/', label: 'PurgeCSS' },
	{ href: 'https://tailwindcss.com/docs/typography-plugin', label: '@tailwindcss/typography Plugin' },
];

export default function Page() {
	return (
		<>
			<div className="py-20">
				<h1 className="text-5xl text-center mb-12">Next.js + Tailwind CSS Kickstarter</h1>
				<h2 className="text-center text-3xl mb-2">Tech Stack</h2>
				<ul className="w-2/3 m-auto flex flex-wrap items-center justify-between">
					{links.map(({ href, label }) => (
						<li key={`${href}${label}`}>
							<a href={href} className="p-1">
								{label}
							</a>
						</li>
					))}
				</ul>
			</div>

			<hr className="my-16" />

			<div className="flex flex-col justify-center items-center">
				<Link className="text-center mb-8 text-2xl" href="/sub-page">Demo-Page with @tailwindcss/typography Plugin</Link>
				<br />
				<Link className="text-center text-2xl" href="/mdx-page">Demo-Page written in Markdown</Link>
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

			<h2 className="text-center mb-8 text-2xl">Next.js Image Demo</h2>
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