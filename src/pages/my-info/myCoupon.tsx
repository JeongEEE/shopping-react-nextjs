import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import { backCleanBtn } from 'src/styles/global';
import MyInfoHeader from 'src/components/myInfoHeader'
import MyInfoLeftNav from 'src/components/myInfoLeftNav'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useRecoilState } from 'recoil';
import { userDataState, couponState } from 'src/states/atoms'
import { priceFormat } from 'src/lib/utils';
import dayjs, { Dayjs } from 'dayjs';

const MyCoupon = () => {
	const [tabValue, setTabValue] = useState(0);
	const [coupons, setCoupons] = useState([]);
	const [availableCoupons, setAvailableCoupons] = useState([]);
	const [expiredCoupons, setExpiredCoupons] = useState([]);
	const [soon24ExpiredCoupons, setSoon24ExpiredCoupons] = useState([]);
	const [localCouponData, setLocalCouponData] = useRecoilState(couponState);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
	function a11yProps(index: number) {
		return {
			id: `full-width-tab-${index}`,
			'aria-controls': `full-width-tabpanel-${index}`,
		};
	}

	const checkSoonExpired = (startTime, expireDate) => {
		// 쿠폰 만료 24시간 이내 true
		let start = dayjs(startTime);
		let end = start.add(expireDate, "day");
		const current = dayjs(new Date());
		const diff = end.diff(current, "hour");
		if(diff > -24 && diff < 0) return true;
		else return false;
	}
	const checkExpired = (startTime, expireDate) => {
		// 사용가능한데 만료된 경우 true
		let start = dayjs(startTime);
		let end = start.add(expireDate, "day");
		const current = dayjs(new Date());
		const diff = end.diff(current, "hour", true);
		if(diff > 0) return true;
		else return false;
	}

	const checkCouponAvaliable = () => {
		let available = [];
		let expired = [];
		let soon24Expired = [];
		localCouponData.forEach((coupon) => {
			if(coupon.status == 'Available') {
				if(checkExpired(coupon.startTime, coupon.expireDate)) expired.push(coupon);
				else {
					available.push(coupon);
					if(checkSoonExpired(coupon.startTime, coupon.expireDate)) soon24Expired.push(coupon);
				}
			}
			else expired.push(coupon);
		});
		setAvailableCoupons([...available]);
		setExpiredCoupons([...expired]);
		setSoon24ExpiredCoupons([...soon24Expired]);
	}

	useEffect(() => {
		setCoupons([...localCouponData]);
		checkCouponAvaliable();

		let curr = dayjs('2023-04-20T10:00:00+09:00')
		let end = dayjs('2023-04-20T10:10:00+09:00')
		let diff = end.diff(curr, 'hour', true)
		console.log(diff)
		console.log(diff > 0)
	}, [])
	

	return (
		<Grid container direction="column" pt={1}>
			<MyInfoHeader />
			<Grid container direction="row" alignItems="start">
				<MyInfoLeftNav />
				<Grid item xs={10} p={3} container direction="column" alignItems="start">
					<Typography variant="h5">할인 쿠폰</Typography>
					<Grid container mt={2} mb={2} p={2} direction="row" alignItems="center"
						css={css`background-color:#edebeb;`}>
						<Grid item xs={6} p={1} container direction="column" alignItems="center">
							<Typography variant="h5">사용 가능</Typography>
							<Typography variant="h4">{availableCoupons.length}개</Typography>
						</Grid>
						<Grid item xs={6} p={1} container direction="column" alignItems="center">
							<Typography variant="h5">마감임박 할인쿠폰 - 24시간 이내</Typography>
							<Typography variant="h4">{soon24ExpiredCoupons.length}개</Typography>
						</Grid>
					</Grid>
					<Box sx={{ width: '100%' }}>
						<Box sx={{ borderBottom: 1, borderColor: 'divider' }} mb={2}>
							<Tabs value={tabValue} onChange={handleChange} variant="fullWidth" aria-label="full width tabs example">
								<Tab label="사용 가능" {...a11yProps(0)} />
								<Tab label="사용 완료 / 기간 만료" {...a11yProps(1)} />
							</Tabs>
						</Box>
						{tabValue == 0
						? <Grid container direction="column" alignItems="start">
								<Grid container direction="column" alignItems="start" p={2} pt={1} pb={1}
									css={css`background-color:#e9e9e9;`}>
									<Grid container direction="row" justifyContent="start" alignItems="center">
										<Grid item container xs={3} justifyContent="center">쿠폰명</Grid>
										<Grid item container xs={4} justifyContent="center">설명</Grid>
										<Grid item container xs={1} justifyContent="center">할인금액(원)</Grid>
										<Grid item container xs={1} justifyContent="center">유효기간</Grid>
										<Grid item container xs={3} justifyContent="center">생성날짜</Grid>
									</Grid>
								</Grid>
								<Grid container direction="column" alignItems="start" p={1}>
									{coupons.map((coupon, index) => (
										<Grid container direction="row" justifyContent="start" alignItems="center" 
											p={1} key={coupon.id} css={css`border-bottom:1px solid #d2d2d2;`}>
											<Grid item container xs={3} justifyContent="center">
												<Typography variant="h7" align="center">{coupon.title}</Typography>
											</Grid>
											<Grid item container xs={4} justifyContent="center">
												<Typography variant="h7" align="left">{coupon.description}</Typography>
											</Grid>
											<Grid item container xs={1} justifyContent="center">
												<Typography variant="h7" align="left">{priceFormat(coupon.discountPrice)}</Typography>
											</Grid>
											<Grid item container xs={1} justifyContent="center">
												<Typography variant="h7" align="left">{coupon.expireDate}</Typography>
											</Grid>
											<Grid item container xs={3} justifyContent="center">
												<Typography variant="h7" align="left">{coupon.createdTime}</Typography>
											</Grid>
										</Grid>
									))}
								</Grid>
							</Grid>
						: <Grid container direction="column" alignItems="start">
								<Grid container direction="column" alignItems="start" p={2} pt={1} pb={1}
									css={css`background-color:#e9e9e9;`}>
									<Grid container direction="row" justifyContent="start" alignItems="center">
										<Grid item container xs={3} justifyContent="center">쿠폰명</Grid>
										<Grid item container xs={4} justifyContent="center">설명</Grid>
										<Grid item container xs={1} justifyContent="center">할인금액(원)</Grid>
										<Grid item container xs={1} justifyContent="center">유효기간</Grid>
										<Grid item container xs={3} justifyContent="center">생성날짜</Grid>
									</Grid>
								</Grid>
								<Grid container direction="column" alignItems="start" p={1}>
									{expiredCoupons.map((coupon, index) => (
										<Grid container direction="row" justifyContent="start" alignItems="center" 
											p={1} key={coupon.id} css={css`border-bottom:1px solid #d2d2d2;`}>
											<Grid item container xs={3} justifyContent="center">
												<Typography variant="h7" align="center">{coupon.title}</Typography>
											</Grid>
											<Grid item container xs={4} justifyContent="center">
												<Typography variant="h7" align="left">{coupon.description}</Typography>
											</Grid>
											<Grid item container xs={1} justifyContent="center">
												<Typography variant="h7" align="left">{priceFormat(coupon.discountPrice)}</Typography>
											</Grid>
											<Grid item container xs={1} justifyContent="center">
												<Typography variant="h7" align="left">{coupon.expireDate}</Typography>
											</Grid>
											<Grid item container xs={3} justifyContent="center">
												<Typography variant="h7" align="left">{coupon.createdTime}</Typography>
											</Grid>
										</Grid>
									))}
								</Grid>
							</Grid>
						}
					</Box>
				</Grid>
			</Grid>
		</Grid>
	)
}

export default MyCoupon