import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css, jsx } from '@emotion/react'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Divider from '@mui/material/Divider';
import { useRecoilState } from 'recoil';
import { userDataState, basketState } from '../../states/atoms'

const detailCss = css`
	width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
   
  display: -webkit-box;
  -webkit-line-clamp: 2; // 원하는 라인수
  -webkit-box-orient: vertical;
`
const input = css`
	width: 3rem;
	height: 2rem;
	font-size: 1rem;
	padding: 5px;
`

const Basket = () => {
	const [userData, setUserData] = useRecoilState(userDataState);
	const [localBasket, setLocalBasket] = useRecoilState(basketState);
	const [auth, setAuth] = useState(false);
	const [basket, setBasket] = useState([]);
	const [totalPrice, setTotalPrice] = useState(0);

	const inputOnChange = (e, index) => {
		const basketCopy = JSON.parse(JSON.stringify(basket));
		
		if(Number(e.target.value) < 1) {
			basketCopy[index].count = '1'
			setBasket(basketCopy)
			setLocalBasket(basketCopy)
		} else if(Number(e.target.value) > 10) {
			basketCopy[index].count = '10'
			setBasket(basketCopy)
			setLocalBasket(basketCopy)
		} else {
			basketCopy[index].count = e.target.value
			setBasket(basketCopy)
			setLocalBasket(basketCopy)
		}
  };

	useEffect(() => {
		if(userData.email == undefined) setAuth(false);
		else setAuth(true);
		return () => {
			
		}
	}, [userData])

	useEffect(() => {
		setBasket(JSON.parse(JSON.stringify(localBasket)));
		let total = 0;
		localBasket.forEach((product) => {
			total += product.count * product.price;
		})
		setTotalPrice(Math.ceil(total * 100) / 100);
		return () => {
			
		}
	}, [localBasket])
	
	
	return (
		<Box>
			<Grid container>
				<Grid container direction="row">
					<ShoppingCartOutlinedIcon fontSize="large" />
					<Typography pl={1} variant="h4">장바구니</Typography>
					<Grid container css={css`border-bottom:1px solid black;`}></Grid>
					{auth 
						? basket.map((product, index) => (
								<Grid container direction="row" justifyContent="center" p={2} key={product.id}>
									<Grid item container xs={2} p={2}>
										<img src={product.image} alt={product.title} width={100} height={100} />
									</Grid>
									<Grid item container xs={8} p={2}>
										<Typography variant="h5" css={detailCss}>{product.title}</Typography>
										<Grid container direction="row" justifyContent="start">
											<Typography variant="h6" align="right" mr={2}>
												{product.price * product.count}$
											</Typography>
											<input type="number" css={input} min={1} max={10} 
												value={product.count} 
												onChange={e => inputOnChange(e, index)} />
										</Grid>
									</Grid>
									<Grid item container xs={2} p={2} justifyContent="end">
										<Button variant="contained" css={css`height:2rem;`}>삭제</Button>
									</Grid>
								</Grid>
							))
						: <Grid container p={16} justifyContent="center"
								css={css`font-size:2.5rem;`}>로그인 하고 이용해주세요</Grid>
					}
					<Grid container css={css`border-bottom:1px solid black;`}></Grid>
					<Grid container direction="row" justifyContent="center">
						<Grid item container xs={10} p={2} justifyContent="end" alignItems="center">
							<Typography variant="h6">합계 : {totalPrice}$</Typography>
						</Grid>
						<Grid item container xs={2} p={2}>
							<Button variant="contained" css={css`width:100%;height:2.5rem;`}>구매하기</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Basket