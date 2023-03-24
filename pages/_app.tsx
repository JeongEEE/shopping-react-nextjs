import '@/styles/globals.css'
import '@/styles/reset.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/layout'
import Head from 'next/head'
import { RecoilRoot } from 'recoil';

export default function App({ Component, pageProps }: AppProps) {
  return (
		<RecoilRoot>
			<Head>
        <title>J 쇼핑몰</title>
      </Head>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</RecoilRoot>
	)
}
