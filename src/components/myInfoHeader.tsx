import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import { backCleanBtn } from 'src/styles/global';
import Link from 'next/link'

const MyInfoHeader = () => {
	return (
		<Grid container direction="row" alignItems="center"
			css={css`background: #a2a6f0;color:white;`}>
			<Grid item xs={2} container justifyContent="center" alignItems="center"
				css={css`background: #4851f7;color:white;height:7rem;`}>
				<Typography variant="h4">마이페이지</Typography>
			</Grid>
			<Grid item xs={2} container direction="column" alignItems="center">
				<Typography variant="h6">구매상품</Typography>
				<Link href="/my-info/orderList" css={css`font-size:2.5rem;`}>0개</Link>
			</Grid>
			<Grid item xs={2} container direction="column" alignItems="center">
				<Typography variant="h6">할인쿠폰</Typography>
				<Link href="/my-info/myCoupon" css={css`font-size:2.5rem;`}>0개</Link>
			</Grid>
		</Grid>
	)
}

export default MyInfoHeader