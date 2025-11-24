import Link from 'next/link';
import Image from 'next/image';
import { getDictionary } from '@/src/get-dictionary';
import { Locale } from '@/src/i18n-config';


export default async function IndexPage(props: { params: Promise<{ lang: Locale }> }) {
	const params = await props.params;
	const { lang } = params;
	const dictionary = await getDictionary(lang);

	return (
		<>
			<div className="py-20">
				<h1 className="mb-6 text-center text-5xl">a11y-monitoring</h1>
			</div>
		</>
	);
}
