import React from 'react'
import Link from 'next/link'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { css } from '@emotion/react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';

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
		<Grid item xs={3} p={2} css={focus} justifyContent="center">
			<Link href={`/product/${product.id}`}>
				<Grid container justifyContent="center">
					<img src={product.image} alt={product.title} height={200}
						css={css`max-width:200px;`} />
					<Typography variant="h5" css={detailCss}>{product.title}</Typography>
					<Grid container direction="row" justifyContent="space-between" alignItems="center">
						<Typography variant="h6" align="right">{product.price}$</Typography>
						{product.wish ? <FavoriteIcon css={css`color:red;`} /> : <FavoriteBorderOutlinedIcon />}
					</Grid>
				</Grid>
			</Link>
		</Grid>
	)
}

export default ProductItem