import Link from 'next/link';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/src/i18n-config';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default async function Header({ lang }: { lang: Locale }) {
	const dictionary = await getDictionary(lang);

	return (
		<nav className="mx-4 text-sm sm:text-base lg:mx-auto lg:text-lg">
			Header
		</nav>
	);
}
