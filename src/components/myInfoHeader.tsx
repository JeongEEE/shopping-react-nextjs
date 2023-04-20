import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import { backCleanBtn } from 'src/styles/global';
import Link from 'next/link'
import { db } from 'src/firebaseConfig'
import { getDocs, getDoc, query, collection, orderBy, doc, updateDoc } from "firebase/firestore";
import { useRecoilState } from 'recoil';
import { userDataState, couponState } from 'src/states/atoms'
import { useRouter } from "next/router";

const MyInfoHeader = () => {
	const router = useRouter();
	const [userData, setUserData] = useRecoilState(userDataState);
	const [localCouponData, setLocalCouponData] = useRecoilState(couponState);
	const [couponCount, setCouponCount] = useState(0);

	const fetchCouponData = () => {
		try {
			getDocs(query(collection(db, 'userData/coupons', userData.email), orderBy("timeMillisecond", "desc")))
			.then((snapshot) => {
				let data = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item, todayHot: false }
				});
				console.log('쿠폰 -', data);
				setLocalCouponData([...data]);
			}).catch(err => { });
		} catch(err) {
			console.log(err);
		}
	}

	useEffect(() => {
		if(!router.asPath.includes('/my-info/orderList')) fetchCouponData();
		setCouponCount(localCouponData.length);
	}, [])
	

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
				<Link href="/my-info/myCoupon" css={css`font-size:2.5rem;`}>{couponCount}개</Link>
			</Grid>
		</Grid>
	)
}

export default MyInfoHeader