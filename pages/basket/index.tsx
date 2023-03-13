import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css, jsx } from '@emotion/react'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

const Basket = () => {
	return (
		<Box>
			<Grid container>
				<Grid container direction="row">
					<ShoppingCartOutlinedIcon fontSize="large" />
					<Typography pl={1} variant="h4">장바구니</Typography>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Basket