'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { i18n, type Locale } from '@/src/i18n-config';

export default function LocaleSwitcher() {
	const pathName = usePathname();

	const redirectedPathName = (locale: Locale) => {
		if (!pathName) return '/';
		const segments = pathName.split('/');
		segments[1] = locale;
		return segments.join('/');
	};

	return (
		<p>
			{i18n.locales.map((locale) => {
				return (
					<span key={locale} className="mx-1">
						<Link href={redirectedPathName(locale)}>{locale}</Link>
					</span>
				);
			})}
		</p>
	);
}
