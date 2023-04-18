import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import Stack from '@mui/material/Stack';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from "next/router";
import { db } from 'src/firebaseConfig'
import { getDocs, setDoc, getDoc, query, collection, orderBy, doc, deleteDoc, updateDoc, limit, limitToLast, startAfter, endBefore, endAt } from "firebase/firestore";
import { whiteBtn } from 'src/styles/global';
import { confirmAlert } from 'react-confirm-alert';
import { useRecoilState } from 'recoil';
import { userDataState } from 'src/states/atoms';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import AddCouponDialog from 'src/components/dialog/addCouponDialog'
import { priceFormat } from 'src/lib/utils';

const CouponManage = () => {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [coupons, setCoupons] = useState([]);

	const backPage = () => {
		router.back();
	}
	const openForm = () => {
		setDialogOpen(true);
	}
	const visibleFunc = (visible) => {
		setDialogOpen(visible);
	}
	const successFunc = (successValue) => {
		enqueueSnackbar('추가 성공', 
			{ variant: 'success', autoHideDuration: 2000,
			anchorOrigin: { vertical: 'top', horizontal: 'center' }});
		fetchCoupons();
	}

	const fetchCoupons = async () => {
		try {
			getDocs(query(collection(db, 'coupons'), orderBy("timeMillisecond", "desc")))
			.then((snapshot) => {
				const data = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				console.log('쿠폰 - ', data);
				setCoupons(data);
			}).catch(err => { })
		} catch(err) {
			console.log(err);
		}
	}

	const deleteCoupon = async (coupon) => {
		await deleteDoc(doc(db, 'coupons', coupon.id))
			.then((snapshot) => {
				enqueueSnackbar('삭제 성공', { variant: 'success', autoHideDuration: 2000,
					anchorOrigin: { vertical: 'top', horizontal: 'center' }});
				fetchCoupons();
			})
			.catch((error) => { });
	}

	const askDelete = (coupon) => {
		confirmAlert({ title: '삭제', message: '선택하신 쿠폰을 삭제 하시겠습니까?',
			buttons: [
				{
					label: '예',
					onClick: () => {
						deleteCoupon(coupon);
					}
				},
				{
					label: '아니오',
					onClick: () => { }
				}
			]
		});
	}

	useEffect(() => {
		fetchCoupons();
	
		return () => {
			
		}
	}, [])
	

	return (
		<Grid container direction="row" pt={1}>
			<Grid container direction="row" justifyContent="space-between" 
				alignItems="center">
				<Grid container direction="row" justifyContent="start" alignItems="center"
					css={css`width:500px;`}>
					<Button variant="text" css={css`margin:0;padding:0;min-width:40px;height:40px;`} 
						onClick={backPage}>
						<ChevronLeftIcon fontSize="large" sx={{ color: 'black' }} />
					</Button>
					<Typography pl={1} variant="h4">관리자 메뉴 - 쿠폰 관리</Typography>
				</Grid>
				<Button variant="contained" css={css`height:2rem;width:10rem;`}
					onClick={()=> openForm()}>쿠폰 추가</Button>
			</Grid>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			<Grid container direction="column" alignItems="start" p={2} pt={1} pb={1}
				css={css`background-color:#e9e9e9;`}>
				<Grid container direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={3} justifyContent="start">쿠폰명</Grid>
					<Grid item container xs={1} justifyContent="center">할인금액(원)</Grid>
					<Grid item container xs={1} justifyContent="center">유효기간(일)</Grid>
					<Grid item container xs={5} justifyContent="center">설명</Grid>
					<Grid item container xs={2} pr={2} justifyContent="end">조작</Grid>
				</Grid>
			</Grid>
			<Grid container direction="column" alignItems="start" p={1}>
				{coupons.map((coupon, index) => (
					<Grid container direction="row" justifyContent="start" alignItems="center" 
						p={1} key={coupon.id} css={css`border-bottom:1px solid #d2d2d2;`}>
						<Grid item container xs={3} alignItems="start">
							<Typography variant="h5" align="left">{coupon.title}</Typography>
						</Grid>
						<Grid item container xs={1} justifyContent="center">
							<Typography variant="h6" align="left">{priceFormat(coupon.discountPrice)}</Typography>
						</Grid>
						<Grid item container xs={1} justifyContent="center">
							<Typography variant="h6" align="left">{coupon.expireDate}</Typography>
						</Grid>
						<Grid item container xs={5} justifyContent="center">
							<Typography variant="h7" align="left">{coupon.description}</Typography>
						</Grid>
						<Grid item container xs={2} justifyContent="end">
							<Button variant="contained" 
								css={css`${whiteBtn};height:2rem;margin-right:5px;`}
								>할당</Button>
							<Button variant="contained" css={css`${whiteBtn};height:2rem;`} 
								onClick={()=> askDelete(coupon)}>삭제</Button>
						</Grid>
					</Grid>
				))}
			</Grid>

			<AddCouponDialog visible={dialogOpen} visibleFunc={visibleFunc} successFunc={successFunc} />
			<SnackbarProvider preventDuplicate />
		</Grid>
	)
}

export default CouponManage