// https://react.dev/reference/react/use-server#calling-a-server-action-outside-of-form
'use client'; // This statement is required to mark a component as a client component
import incrementLike from './actions';
import { useState, useTransition } from 'react';

export default function LikeButton() {
	const [isPending, startTransition] = useTransition();
	const [likeCount, setLikeCount] = useState(0);

	const onClick = () => {
		startTransition(async () => {
			const currentCount = await incrementLike();
			setLikeCount(currentCount);
		});
	};

	return (
		<>
			<p>Total Likes: {likeCount !== 0 ? likeCount : '?'}</p>
			<button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
				onClick={onClick}
				disabled={isPending}
			>
				Like
			</button>
		</>
	);
}
