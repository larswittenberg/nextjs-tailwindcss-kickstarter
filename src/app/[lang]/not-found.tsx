import Link from 'next/link';

export default function NotFound() {
	return (
		<div>
			<h1 className="mb-6 text-5xl">Page not available or no longer available</h1>
			<p>
				If you have called up a faulty link from this or another website that led you to this page, we would be pleased to receive a message with a description of the error. We will endeavour to rectify the error immediately.
			</p>
			<p>
				<Link href="/">Return Home</Link>
			</p>
		</div>
	);
}
