import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import networkController from '../api/networkController'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const ProductDetail = () => {
	const router = useRouter();
	const { id } = router.query;
	const [product, setProduct] = useState([]);

	useEffect(() => {
		networkController.getProductData(id).then((data) => {
			console.log(data);
			setProduct(data);
		});
	}, [])
	
	return (
		<Box>
			<Grid container>
				<Grid container direction="row">
					<Grid item container xs={6} p={2} justifyContent="center">
						<img src={product.image} alt={product.title} width={400} height={400} />
					</Grid>
					<Grid item container xs={6} p={2}>
						<Grid container>
							<Typography variant="h5">{product.title}</Typography>
						</Grid>
						<Grid container justifyContent="right">
							<Typography variant="h6">{product.price}$</Typography>
						</Grid>
						<Grid container>
							<Typography variant="h6">{product.description}</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	)
}

export default ProductDetail