import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import Stack from '@mui/material/Stack';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from "next/router";
import AddProductDialog from 'src/components/addProductDialog';
import { whiteBtn } from 'src/styles/global';

const Admin = () => {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);

	const pushRouter = (page) => {
		switch(page) {
			case 'product':
				router.push('/admin/product-manage');
				break;
			case 'mui':
				router.push('/admin/white-test/mui-test');
				break;
			case 'recoil':
				router.push('/admin/white-test/recoil-test');
				break;
			case 'category':
				router.push('/admin/category-manage');
				break;
		}
	}

	const openForm = () => {
		setDialogOpen(true);
	}
	const visibleFunc = (visible) => {
		setDialogOpen(visible);
	}

	const openSnackbar = () => {
		enqueueSnackbar('That was easy!', { variant: 'info', autoHideDuration: 2000,
			anchorOrigin: {
				vertical: 'top',
				horizontal: 'center'
		}})
	}

	return (
		<Grid container direction="row" pt={1}>
			<Typography pl={1} variant="h4">관리자 메뉴</Typography>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			<Grid container direction="row" alignItems="center" p={1} mb={3}>
				<Button variant="contained"
					onClick={() => pushRouter('product')}>상품 관리</Button>
				<Button variant="contained" css={css`margin-left:10px;`}
					onClick={() => pushRouter('category')}>카테고리 관리</Button>
				<Button variant="contained" css={css`margin-left:10px;${whiteBtn};`}
					>쿠폰 관리</Button>
			</Grid>

			<Typography pl={1} mt={1} variant="h4">White Test</Typography>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			<Grid container direction="column" alignItems="start" p={1}>
				<Stack mt={1} direction="row" spacing={1}>
					<Button variant="contained" onClick={() => pushRouter('mui')}>MUI TEST</Button>
					<Button variant="contained" onClick={() => pushRouter('recoil')}>Recoil TEST</Button>
				</Stack>
				<Stack mt={1} direction="row" spacing={1}>
					<Button variant="contained" onClick={openSnackbar}>Snackbar TEST</Button>
					<Button variant="contained" onClick={openForm}>Dialog TEST</Button>
				</Stack>
				<SnackbarProvider preventDuplicate />
			</Grid>
			<AddProductDialog visible={dialogOpen} visibleFunc={visibleFunc} />
		</Grid>
	)
}

export default Admin