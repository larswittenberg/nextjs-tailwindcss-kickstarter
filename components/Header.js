import Link from 'next/link';

export default function Header() {
	return (
		<nav>
			<ul className="flex items-center justify-between p-8">
				<li>
					<Link href="/" className="no-underline text-accent-1 dark:text-gray-300">
						Project Website
					</Link>
				</li>
				<li className="flex items-center justify-between space-x-4">
					<a
						href="https://github.com/larswittenberg/nextjs-tailwindcss-kickstarter"
						className="no-underline dark:text-gray-300"
					>
						GitHub
					</a>
				</li>
			</ul>
		</nav>
	);
}
