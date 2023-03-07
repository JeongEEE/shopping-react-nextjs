import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import networkController from './api/networkController'

export default function Home() {
	const router = useRouter();
	const [products, setProducts] = useState([]);

	function goWhiteTest() {
		router.push("/white-test")
	}

	useEffect(() => {
		networkController.getAllProducts().then((data) => {
			console.log(data);
			setProducts(data);
		});
	}, [])
	
	
  return (
		<Box>
			<Grid container>
				<Grid>
					<Image src="/images/bg1.jpg" alt="J Shopping" width={1100} height={250} />
					<h1>Shopping Next.js App</h1>
				</Grid>
			</Grid>
		</Box>
  )
}
