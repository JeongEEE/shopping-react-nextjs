import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import { backCleanBtn } from 'src/styles/global';
import Link from 'next/link'

const MyInfoLeftNav = () => {
	return (
		<Grid item xs={2} p={1} container direction="column" alignItems="start"
			css={css`background-color:#edebeb;`}>
			<Typography pl={1} variant="h6">MY 쇼핑</Typography>
			<Link href="/my-info" css={css`line-height:22.5px;margin-left:7px;${backCleanBtn};`}>내 정보</Link>
			<Link href="/my-info/orderList" css={css`line-height:22.5px;margin-left:7px;${backCleanBtn};`}>주문 목록</Link>
			<Grid container mt={1} mb={2} css={css`border-bottom:1px solid gray;`}></Grid>
			
			<Typography pl={1} variant="h6">MY 혜택</Typography>
			<Link href="/my-info/myCoupon" css={css`line-height:22.5px;margin-left:7px;${backCleanBtn};`}>할인 쿠폰</Link>
		</Grid>
	)
}

export default MyInfoLeftNav