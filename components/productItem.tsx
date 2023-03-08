import React from 'react'
import Link from 'next/link'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const ProductItem = ({ product }) => {
	return (
		<Grid item container xs={3} p={2}>
			<Link href={`/product/${product.id}`}>
				<Grid container justifyContent="center">
					<img src={product.image} alt={product.title} width={200} height={200} />
					<Typography variant="h5">{product.title}</Typography>
					<Typography variant="h6" align="right">{product.price}$</Typography>
				</Grid>
			</Link>
		</Grid>
	)
}

export default ProductItem