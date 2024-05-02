import React from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { i18n, type Locale } from '@/src/i18n-config';
import '../../styles/main.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const roboto = Roboto({
	weight: ['400', '700'],
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'Next.js + Tailwind CSS Kickstarter',
	description: 'Basic template setup with Next.js + Tailwind CSS and some helpers.',
	icons: {
		icon: '/favicon.svg',
	},
};

export async function generateStaticParams() {
	return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {

	return (
		<html lang={params.lang} className={roboto.className}>
			<body>
				<Header lang={params.lang} />
				<main className="mx-4 lg:mx-auto lg:w-2/3">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
