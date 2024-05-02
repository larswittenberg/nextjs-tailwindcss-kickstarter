import { i18n, type Locale } from '../../src/i18n-config';

export async function generateStaticParams() {
	return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function Root({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
	return (
		<html lang={params.lang}>
			<body>{children}</body>
		</html>
	);
}

export const metadata = {
	title: 'i18n within app directory - Vercel Examples',
};
