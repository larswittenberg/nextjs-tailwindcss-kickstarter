import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Next.js Image | Next.js + Tailwind CSS Kickstarter',
};

export default function Page() {
	return (
		<div className="">
			<h2 className="mb-8 text-center text-2xl">Next.js Image Demo</h2>
			<figure>
				<Image
					src="/images/unsplash.jpg"
					width={1920}
					height={1280}
					alt="Alpe di Siusi, Italia from Pietro De Grandi from Unsplash"
					priority
				/>
				<figcaption>
					<span>
						Alpe di Siusi, Italia. Photo by{' '}
						<a href="https://unsplash.com/@peter_mc_greats?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
							Pietro De Grandi
						</a>{' '}
						on{' '}
						<a href="https://unsplash.com/images/nature?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">
							Unsplash
						</a>
					</span>
				</figcaption>
			</figure>
		</div>
	);
}
