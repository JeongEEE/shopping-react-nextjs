import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import Stack from '@mui/material/Stack';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from "next/router";
import { whiteBtn } from 'src/styles/global';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ko';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { koKR } from '@mui/x-date-pickers/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const Admin = () => {
	const router = useRouter();
	const [startDate, setStartDate] = useState<Dayjs | null>(dayjs(new Date()));

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
			case 'coupon':
				router.push('/admin/coupon-manage');
				break;
		}
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
				<Button variant="contained" css={css`margin-left:10px;`}
					onClick={() => pushRouter('coupon')}>쿠폰 관리</Button>
				<Button variant="contained" css={css`margin-left:10px;${whiteBtn};`}
					>주문 내역</Button>
				<Button variant="contained" css={css`margin-left:10px;${whiteBtn};`}
					>회원 관리</Button>
			</Grid>

			<Typography pl={1} mt={1} variant="h4">White Test</Typography>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			<Grid container direction="column" alignItems="start" p={1}>
				<Stack mt={1} direction="row" spacing={1}>
					<Button variant="contained" onClick={() => pushRouter('mui')}>MUI TEST</Button>
					<Button variant="contained" onClick={() => pushRouter('recoil')}>Recoil TEST</Button>
				</Stack>
				<Stack mt={2} direction="row" spacing={1}>
					<Button variant="contained" onClick={openSnackbar}>Snackbar TEST</Button>
					<Grid item container xs={6} pr={2}>
						<LocalizationProvider localeText={koKR.components.MuiLocalizationProvider.defaultProps.localeText}
							dateAdapter={AdapterDayjs} adapterLocale="ko">
							<DatePicker label="날짜 Test" slotProps={{ textField: { size: 'small' } }}
								formatDensity="spacious"
								value={startDate} onChange={(newValue) => setStartDate(newValue)} />
						</LocalizationProvider>
					</Grid>
				</Stack>
				<SnackbarProvider preventDuplicate />
			</Grid>
		</Grid>
	)
}

export default Admin