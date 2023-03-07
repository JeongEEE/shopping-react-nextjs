import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
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
			<Grid container mb={5}>
				<Grid>
					<Image src="/images/bg1.jpg" alt="J Shopping" width={1100} height={250} />
					<Grid container direction="row" justifyContent="space-between" alignItems="center">
						{products.map(product => (
							<Grid item container xs={3} p={2} justifyContent="center" key={product.id}>
								<Link href={`/product/${product.id}`}>
									<img src={product.image} alt={product.title} width={200} height={200} />
									<Typography variant="h5">{product.title}</Typography>
									<Typography variant="h6" align="right">{product.price}$</Typography>
								</Link>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Box>
  )
}
