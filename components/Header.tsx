import Link from 'next/link';

export default function Header() {
	return (
		<nav className="text-sm sm:text-base lg:text-lg mx-4 lg:mx-auto">
			<ul className="flex items-center justify-between py-4 sm:py-8 lg:px-8 mx-auto max-w-[65ch] lg:max-w-none">
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
