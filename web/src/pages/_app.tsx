import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import '../styles/global.css'

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Component {...pageProps} />

			<Toaster 
				position="bottom-right"
			/>
		</>
	)
}
