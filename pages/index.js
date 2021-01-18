import Nav from '../components/nav'

export default function IndexPage() {
	return (
		<div>
			<Nav />
			<div className="py-20">
				<h1 className="text-5xl text-center text-gray-700 dark:text-gray-100 mb-12">
					Next.js + Tailwind CSS Kickstarter Template
				</h1>
				<h2 className="text-center text-3xl">Subheadline</h2>
			</div>
		</div>
	)
}
