import type { Metadata } from 'next';
import styles from './demo.module.scss'

export const metadata: Metadata = {
	title: 'SCSS | Next.js + Tailwind CSS Kickstarter',
};

export default async function Page() {
	return (
		<div className={styles.pagewrapper}>
			<h1 className={styles.headline}>
				SCSS Demo-Seite
			</h1>
			<p>Next.js unterstützt Sass-Variablen, die aus CSS-Modul-Dateien exportiert werden.</p>
		</div>
	);
}
