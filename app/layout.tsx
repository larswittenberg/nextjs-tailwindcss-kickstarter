import React from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import '../styles/main.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

const roboto = Roboto({
	weight: ['400', '700'],
	subsets: ['latin'],
	display: 'swap',
})

export const metadata: Metadata = {
	title: 'Next.js + Tailwind CSS Kickstarter',
	description: 'Basic template setup with Next.js + Tailwind CSS and some helpers.',
	icons: {
		icon: '/favicon.svg',
	},
};

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={roboto.className}>
			<body>
				<Header />
				<main className="lg:w-2/3 mx-4 lg:mx-auto">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
