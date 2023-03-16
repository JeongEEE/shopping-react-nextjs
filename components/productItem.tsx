import React from 'react'
import Link from 'next/link'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { css } from '@emotion/react'

const detailCss = css`
	width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
   
  display: -webkit-box;
  -webkit-line-clamp: 2; // 원하는 라인수
  -webkit-box-orient: vertical;
`
const focus = css`
	transition: transform .2s;
	&:hover {
		transform: scale(1.025);
		z-index: 3;
		box-shadow: 1px 1px 1px 1px gray;
	}
`

const ProductItem = ({ product }) => {
	return (
		<Grid item container xs={3} p={2} css={focus}>
			<Link href={`/product/${product.id}`}>
				<Grid container justifyContent="center">
					<img src={product.image} alt={product.title} width={200} height={200} />
					<Typography variant="h5" css={detailCss}>{product.title}</Typography>
					<Typography variant="h6" align="right">{product.price}$</Typography>
				</Grid>
			</Link>
		</Grid>
	)
}

export default ProductItem