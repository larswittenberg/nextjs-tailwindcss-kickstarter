'use client'; // This statement is required to mark a component as a client component
import { useState } from 'react';

export default function ClientComponent({ upvotes }) {
	const [upvoteCount, setUpvoteCount] = useState(upvotes);

	return (
		<>
			<h2>Client Component</h2>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={() => setUpvoteCount(upvoteCount + 1)}
			>
				{upvoteCount} Upvotes
			</button>
		</>
	);
};
