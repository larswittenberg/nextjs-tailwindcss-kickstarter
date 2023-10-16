import React from 'react';
import '../styles/main.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RootLayout({
	// Layouts must accept a children prop.
	// This will be populated with nested layouts or pages
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Header />
				<main className="lg:w-2/3 mx-4 lg:mx-auto">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
