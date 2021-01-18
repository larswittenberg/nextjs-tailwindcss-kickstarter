import Link from 'next/link'

const links = [
	{ href: 'https://github.com/larswittenberg/nextjs-tailwindcss-kickstarter', label: 'Project at GitHub' },
	{ href: 'https://nextjs.org/docs', label: 'Next.js Docs' },
	{ href: 'https://tailwindcss.com/docs/', label: 'Tailwind CSS Docs' },
]

export default function Nav() {
	return (
		<nav>
			<ul className="flex items-center justify-between p-8">
				<li>
					<Link href="/">
						<a className="no-underline text-accent-1 dark:text-blue-300">Home</a>
					</Link>
				</li>
				<ul className="flex items-center justify-between space-x-4">
				{links.map(({ href, label }) => (
					<li key={`${href}${label}`}>
					<a href={href} className="no-underline btn-blue">
						{label}
					</a>
					</li>
				))}
				</ul>
			</ul>
		</nav>
	)
}
