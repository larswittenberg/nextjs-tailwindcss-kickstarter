async function loadPosts() {
	await new Promise((resolve) => {
		setTimeout(resolve, 3000);
	});

	const res = await fetch('https://jsonplaceholder.typicode.com/posts');
	return res.json();
}

export default async function ServerComponent({ items }) {
	const posts = await loadPosts();

	return (
		<div className="post-list">
			<h2>Server Component</h2>
			{posts.slice(0, items).map((post) => (
				<div key={post.id} className="post-listing">
					<h3 className="post-title">
						{post.id}. {post.title}
					</h3>
					<p className="post-body">{post.body}</p>
				</div>
			))}
		</div>
	);
}
