import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import { useRouter } from "next/router";

export default function Home() {
	const router = useRouter();

	function goWhiteTest() {
		router.push("/white-test")
	}
	
  return (
    <div>
			<h1>Shopping Next.js App</h1>
			<button onClick={goWhiteTest}>WhiteTest</button>
    </div>
  )
}
