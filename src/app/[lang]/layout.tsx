import React from 'react';
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { i18n, type Locale } from '@/src/i18n-config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import '@/styles/main.css';

const roboto = Roboto({
	weight: ['400', '700'],
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: 'a11y-monitoring',
	icons: {
		icon: '/favicon.svg',
	},
};

export async function generateStaticParams() {
	return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout(props: { children: React.ReactNode; params: Promise<{ lang: Locale }> }) {
	const params = await props.params;

	const { children } = props;

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
