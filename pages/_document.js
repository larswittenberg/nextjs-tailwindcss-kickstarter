import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)
		return { ...initialProps }
	}

	render() {
		return (
			<Html lang="en">
				<Head>
					<link href="/favicon.svg" rel="shortcut icon" />
				</Head>
				<body className="font-sans text-gray-800 dark:bg-gray-800 dark:text-gray-200">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument
