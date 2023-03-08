import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import networkController from '../api/networkController'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css, jsx } from '@emotion/react'

const textdiv = css`
	height: 2rem;
`

const btn = css`
	width: 100%;
`
const input = css`
	width: 100%;
	font-size: 1.5rem;
	padding: 5px;
`

const ProductDetail = () => {
	const router = useRouter();
	const { id } = router.query;
	const [product, setProduct] = useState([]);
	const [productCount, setProductCount] = useState('1');

	const inputOnChange = (e) => {
		const value = Number(e.target.value);
		if(value < 1) setProductCount('1');
		else if(value > 10) setProductCount('10');
    else setProductCount(e.target.value);
  };

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
						<Grid>
							<Typography variant="h4">{product.title}</Typography>
						</Grid>
						<Grid justifyContent="right">
							<Typography variant="h5" css={textdiv}>{product.price}$</Typography>
						</Grid>
						<Grid>
							<Typography variant="h6">{product.description}</Typography>
						</Grid>
						<Grid container css={textdiv}>
							<Grid item container xs={2} p={1}>
								<input type="number" css={input} min={1} max={10} 
									value={productCount} onChange={inputOnChange} />
							</Grid>
							<Grid item container xs={5} p={1}>
								<Button variant="contained" css={btn}>장바구니에 담기</Button>
							</Grid>
							<Grid item container xs={5} p={1}>
								<Button variant="contained" css={btn}>구매하기</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	)
}

export default ProductDetail