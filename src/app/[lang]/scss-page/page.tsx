import type { Metadata } from 'next';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/src/i18n-config';
import variables from '@/scss/variables.module.scss';
import '@/scss/demo-page.scss';

export const metadata: Metadata = {
	title: 'SCSS | Next.js + Tailwind CSS Kickstarter',
};

export default async function Page({ params: { lang } }: { params: { lang: Locale } }) {
	const dictionary = await getDictionary(lang);

	return (
		<div className="scss--pagewrapper">
			<h1 className="scss--headline">
				{dictionary['scssPage'].headline}
				<span style={{ color: variables.primaryColor }}>{dictionary['scssPage'].subtitle}</span>
			</h1>
		</div>
	);
}
