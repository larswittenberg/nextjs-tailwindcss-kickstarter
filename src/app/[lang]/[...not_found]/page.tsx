// https://www.linkedin.com/pulse/add-custom-404-page-found-nextjs-14-app-directory-ali-mirzaei-hyh1e/
import { notFound } from 'next/navigation';

export default function NotFoundCatchAll() {
	notFound();
}
