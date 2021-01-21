import Header from './Header'
import Footer from './Footer'

export default function LayoutDefault({ className, children }) {
	return (
		<div>
			<Header />
			<main className={className}>
				{children}
			</main>
			<Footer />
		</div>
	)
}
