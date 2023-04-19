import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import { backCleanBtn } from 'src/styles/global';
import MyInfoHeader from 'src/components/myInfoHeader'
import MyInfoLeftNav from 'src/components/myInfoLeftNav'

const MyCoupon = () => {
	return (
		<Grid container direction="column" pt={1}>
			<MyInfoHeader />
			<Grid container direction="row" alignItems="start">
				<MyInfoLeftNav />
				<Grid item xs={10} p={3} container direction="column" alignItems="start">
					<Typography variant="h5">할인 쿠폰</Typography>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default MyCoupon