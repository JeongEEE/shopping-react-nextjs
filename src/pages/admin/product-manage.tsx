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
import AddProductDialog from 'src/components/addProductDialog';

const ProductManage = () => {
	const [dialogOpen, setDialogOpen] = useState(false);

	const openForm = () => {
		setDialogOpen(true);
	}
	const visibleFunc = (visible) => {
		setDialogOpen(visible);
	}
	const successFunc = () => {
		enqueueSnackbar('추가 성공', { variant: 'success', autoHideDuration: 2000,
			anchorOrigin: { vertical: 'top', horizontal: 'center' }})
	}

	return (
		<Grid container direction="row" pt={1}>
			<Grid container direction="row" justifyContent="space-between" 
				alignItems="center">
				<Typography pl={1} variant="h4">상품 관리</Typography>
				<Button variant="contained" css={css`height:2rem;`}
					onClick={openForm}>상품 추가</Button>
			</Grid>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			<Grid container direction="column" alignItems="start" p={1}>

			</Grid>
			<AddProductDialog visible={dialogOpen} visibleFunc={visibleFunc} 
				successFunc={successFunc} />
			<SnackbarProvider preventDuplicate />
		</Grid>
	)
}

export default ProductManage