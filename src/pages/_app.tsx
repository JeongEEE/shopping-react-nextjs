import 'src/styles/globals.css'
import 'src/styles/reset.css'
import type { AppProps } from 'next/app'
import Layout from 'src/components/layout/layout'
import Head from 'next/head'
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
		<RecoilRoot>
			<QueryClientProvider client={queryClient}>
				<Head>
					<title>J 쇼핑몰</title>
				</Head>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</QueryClientProvider>
		</RecoilRoot>
	)
}
