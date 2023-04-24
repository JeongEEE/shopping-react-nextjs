import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import { useRecoilState } from 'recoil';
import { userDataState, wishState, basketState, purchaseState } from 'src/states/atoms';
import { priceFormat } from 'src/lib/utils';

const Purchase = () => {
	const [localPurchaseList, setLocalPurchaseList] = useRecoilState<Array<Product>>(purchaseState);
	const [purchaseList, setpurchaseList] = useState<Array<Product>>([]);
	const [userData, setUserData] = useRecoilState(userDataState);
	const [email, setEmail] = useState('');
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalDiscountPrice, setTotalDiscountPrice] = useState(0);
	const [totalPurchasePrice, setTotalPurchasePrice] = useState(0);

	const calculatePrice = () => {
		const list = [...localPurchaseList];
		let total = 0;
		let discount = 0;

		list.forEach((product) => {
			total += Number(product.price);
			discount += (Number(product.price) * (0.01 * product.discount));
		})
		setTotalPrice(total);
		setTotalDiscountPrice(discount);
		setTotalPurchasePrice(total - discount);
	}

	useEffect(() => {
		console.log('purchaseList', localPurchaseList);
		setpurchaseList([...localPurchaseList]);
		setEmail(userData.email);
		calculatePrice();
		return () => {
			
		}
	}, [])
	

	return (
		<Grid container direction="row" pt={1}>
			<Grid container direction="row" justifyContent="space-between" alignItems="center">
				<Typography pl={1} variant="h4">주문/결제</Typography>
			</Grid>
			<Grid container mb={2} css={css`border-bottom:3px solid black;`}></Grid>
			<Typography pl={1} variant="h4">구매자정보</Typography>
			<Grid container p={2} mb={2} direction="column" justifyContent="center" alignItems="center"
				css={css`background-color:#e6e4e4;`}>
				<Grid container mb={1} direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						이름
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						홍길동
					</Grid>
				</Grid>
				<Grid container mb={1} direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						이메일
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						{email}
					</Grid>
				</Grid>
				<Grid container direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						휴대폰 번호
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						010-1234-5678
					</Grid>
				</Grid>
			</Grid>

			<Typography pl={1} variant="h4">받는사람정보</Typography>
			<Grid container p={2} mb={2} direction="column" justifyContent="center" alignItems="center"
				css={css`background-color:#e6e4e4;`}>
				<Grid container mb={1} direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						이름
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						홍길동
					</Grid>
				</Grid>
				<Grid container mb={1} direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						연락처
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						010-1234-5678
					</Grid>
				</Grid>
				<Grid container direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						배송주소
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						경기도 성남시 수정구 창업로
					</Grid>
				</Grid>
			</Grid>

			<Typography pl={1} variant="h4">배송정보</Typography>
			<Grid container p={2} mb={2} direction="column" justifyContent="center" alignItems="center"
				css={css`background-color:#d3d9fa;`}>
			{purchaseList.map((product, index) => (
				<Grid container p={1} direction="row" justifyContent="start" alignItems="center"
					key={product.index}>
					<Grid item container xs={10} justifyContent="left">
						<Typography variant="h5">{product.title}</Typography>
					</Grid>
					<Grid item container xs={2} pl={2} justifyContent="right">
						{product.count ?? 1} 개
					</Grid>
				</Grid>
			))}
			</Grid>

			<Typography pl={1} variant="h4">결제정보</Typography>
			<Grid container p={2} mb={2} direction="column" justifyContent="center" alignItems="center"
				css={css`background-color:#e6e4e4;`}>
				<Grid container mb={1} direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						총상품가격
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						{priceFormat(totalPrice)} 원
					</Grid>
				</Grid>
				<Grid container mb={1} direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						즉시할인
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						{priceFormat(totalDiscountPrice)} 원
					</Grid>
				</Grid>
				<Grid container mb={1} direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						할인쿠폰
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						
					</Grid>
				</Grid>
				<Grid container mb={1} direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						총결제금액
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						{priceFormat(totalPurchasePrice)} 원
					</Grid>
				</Grid>
				<Grid container direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={2} justifyContent="right">
						결제방법
					</Grid>
					<Grid item container xs={10} pl={2} justifyContent="left">
						카드결제 / 신용카드 / 1234456******5142**
					</Grid>
				</Grid>
			</Grid>

			<Grid container p={2} mb={2} direction="column" justifyContent="center" alignItems="center">
				<Typography variant="h7">위 주문 내용을 확인 하였으며, 회원 본인은 개인정보 이용 및 제공(해외직구의 경우 국외제공) 및 결제에 동의합니다.</Typography>
			</Grid>

			<Grid container mb={7} direction="row" justifyContent="center" alignItems="center">
				<Button variant="contained" css={css`width:20rem;height:3rem;font-size:2rem;`}
					>결제하기</Button>
			</Grid>
		</Grid>
	)
}

export default Purchase