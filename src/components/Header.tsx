import Link from 'next/link';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/src/i18n-config';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default async function Header({ lang }: { lang: Locale }) {
	const dictionary = await getDictionary(lang);

	return (
		<nav className="mx-4 text-sm sm:text-base lg:mx-auto lg:text-lg">
			<ul className="mx-auto flex max-w-[65ch] items-center justify-between py-4 sm:py-8 lg:max-w-none lg:px-8">
				<li>
					<Link href={`/${lang}`} className="text-accent-1 dark:text-gray-300">
						{dictionary["header"].projectTitle}
					</Link>
				</li>
				<li>
					<LocaleSwitcher />
				</li>
			</ul>
		</nav>
	);
}
