import { Suspense } from 'react';
import type { Metadata } from 'next';
import ClientComponent from './ClientComponent';
import ServerComponent from './ServerComponent';
import LikeButton from './LikeButton';

export const metadata: Metadata = {
	title: 'RSC | Next.js + Tailwind CSS Kickstarter',
};

export default function Page() {
	/*
	 * Since this is a server component, the below message
	 * won't be displayed in the browser's dev console.
	 */
	const demomessage = 'I am a Server Component.';
	// console.log(demomessage);

	return (
		<div className="prose prose-sm sm:prose lg:prose-lg mx-auto">
			<h1 className="">Demo-Page for React Server Components</h1>
			<p>{demomessage}</p>

			<hr />

			<LikeButton />

			<hr />

			<ClientComponent upvotes={0} />

			<hr />

			<Suspense fallback={<h2>Extra delay for Loading...</h2>}>
				<ServerComponent items={5} />
			</Suspense>
		</div>
	);
}
