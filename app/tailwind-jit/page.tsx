import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Tailwind JIT | Next.js + Tailwind CSS Kickstarter',
};

export default function Page() {
	return (
		<div className="">
			<h2 className="mb-8 text-center text-2xl">Tailwind JIT</h2>
			<p>
				This page uses the TailwindCSS JIT engine. The new Just-in-Time engine we announced in March has
				replaced the classic engine in Tailwind CSS v3.0.
			</p>
			<p>
				<a href="https://tailwindcss.com/docs/upgrade-guide#migrating-to-the-jit-engine" target="_blank" rel="noopener noreferrer">
					Migrating to the JIT engine
				</a>
			</p>
			<p>
				<a href="https://tailwindcss.com/blog/just-in-time-the-next-generation-of-tailwind-css" target="_blank" rel="noopener noreferrer">
					Just-In-Time: The Next Generation of Tailwind CSS (2021)
				</a>
			</p>

			<hr className="my-16" />

			<p className="text-[#f00] dark:text-[#ff0]">
				This paragraph uses a TailwindCSS Feature from the Just-in-Time Mode: Generate arbitrary styles without
				writing custom CSS.
				<br />
				The <code>className=&quot;text-[#f00]&quot;</code> generates a class that is not part of
				the default TailwindCSS config and not a custom theme config. This is a specific ulitity class with a
				text-color: #f00. And for color-schema dark{' '}
				<code>className=&quot;dark:text-[#ff0]&quot;</code>
			</p>
			<p>
				Lorem ipsum, dolor sit amet consectetur adipisicing elit. Id corrupti maxime similique quisquam sunt
				quis vero culpa <em>awesome</em> ipsum ullam vel odit eligendi, quo illum, aliquid sequi quae. Possimus,
				dignissimos!
			</p>
		</div>
	);
}
