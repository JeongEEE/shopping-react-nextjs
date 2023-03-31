import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import Stack from '@mui/material/Stack';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from "next/router";
import { db } from 'src/firebaseConfig'
import { getDocs, query, collection, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";

const ProductManage = () => {
	return (
		<Grid container direction="row" pt={1}>
			<Grid container direction="row" justifyContent="space-between" 
				alignItems="center">
				<Typography pl={1} variant="h4">상품 관리</Typography>
				<Button variant="contained" css={css`height:2rem;`}>상품 추가</Button>
			</Grid>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			<Grid container direction="column" alignItems="start" p={1}>

			</Grid>
		</Grid>
	)
}

export default ProductManage