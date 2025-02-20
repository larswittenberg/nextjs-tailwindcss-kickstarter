'use client'; // This statement is required to mark a component as a client component
import { useState } from 'react';

export default function ClientComponent({ upvotes }) {
	const [upvoteCount, setUpvoteCount] = useState(upvotes);

	return (
		<>
			<h2>Client Component</h2>
			<button
				className="rounded-sm bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
				onClick={() => setUpvoteCount(upvoteCount + 1)}
			>
				{upvoteCount} Upvotes
			</button>
		</>
	);
}
