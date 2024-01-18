import Link from 'next/link';

export default function Header() {
	return (
		<nav className="mx-4 text-sm sm:text-base lg:mx-auto lg:text-lg">
			<ul className="mx-auto flex max-w-[65ch] items-center justify-between py-4 sm:py-8 lg:max-w-none lg:px-8">
				<li>
					<Link href="/" className="text-accent-1 dark:text-gray-300">
						Project Website
					</Link>
				</li>
				<li className="flex items-center justify-between space-x-4">
					<a
						href="https://github.com/larswittenberg/nextjs-tailwindcss-kickstarter"
						className="dark:text-gray-300"
					>
						GitHub
					</a>
				</li>
			</ul>
		</nav>
	);
}
