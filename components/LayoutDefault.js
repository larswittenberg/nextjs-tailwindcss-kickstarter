import Nav from './Nav'
import Footer from './Footer'

export default function LayoutDefault({ className, children }) {
	return (
		<div>
			<Nav />
			<main className={className}>
				{children}
			</main>
			<Footer />
		</div>
	)
}
