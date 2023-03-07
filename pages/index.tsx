import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export default function Home() {
	const router = useRouter();

	function goWhiteTest() {
		router.push("/white-test")
	}
	
  return (
		<Box>
			<Grid container sx={{ p: 2 }}>
				<h1>Shopping Next.js App</h1>
			</Grid>
		</Box>
  )
}
