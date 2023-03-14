import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import networkController from '../api/networkController'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css, jsx } from '@emotion/react'
import { db } from '../../firebaseConfig'
import { collection, addDoc } from "firebase/firestore";
import { useRecoilState } from 'recoil';
import { userDataState, basketState } from '../../states/atoms';
import { formatDateKor } from '../../lib/utils';

const textdiv = css`
	height: 2rem;
`
const btn = css`
	width: 100%;
`
const input = css`
	width: 100%;
	font-size: 1.5rem;
	padding: 5px;
`

export async function getServerSideProps({ query: { id } }) {
	// 새로고침할때 쿼리값이 날라가는걸 방지하기위해 서버사이드로 쿼리를 받아옴
  return {
    props: {
      id,
    },
  };
}

const ProductDetail = ({ id }) => {
	const router = useRouter();
	const [product, setProduct] = useState([]);
	const [productCount, setProductCount] = useState('1');
	const [userData, setUserData] = useRecoilState(userDataState);
	const [basketData, setBasketData] = useRecoilState(basketState);

	const inputOnChange = (e) => {
		const value = Number(e.target.value);
		if(value < 1) setProductCount('1');
		else if(value > 10) setProductCount('10');
    else setProductCount(e.target.value);
  };

	const checkAlreadyInBasket = () => {
		if(basketData.length == 0) return true;

		const find = basketData.findIndex((el, index, arr) => el.title === product.title);
		if(find == -1) return false;
		else return true;
	}

	const addProductInBasket = async () => {
		if(checkAlreadyInBasket()) {
			console.log('이미 장바구니에 있음');
			return;
		}
		const params = {
			email: userData.email,
			category: product.category,
			image: product.image,
			price: product.price,
			title: product.title,
			discription: product.description,
			count: productCount,
			createdTime: formatDateKor(new Date()),
			timeMillisecond: Date.now()
		}
		await addDoc(collection(db, userData.email, 'userData/basket'), params)
		.then((docRef) => {
			
		}).catch(err => {
			console.log(err);
		})
	}

	useEffect(() => {
		networkController.getProductData(id).then((data) => {
			console.log(data);
			setProduct(data);
		});
		console.log(userData);
		
	}, [])
	
	return (
		<Box>
			<Grid container>
				<Grid container direction="row">
					<Grid item container xs={6} p={2} justifyContent="center">
						<img src={product.image} alt={product.title} width={400} height={400} />
					</Grid>
					<Grid item container xs={6} p={2}>
						<Grid>
							<Typography variant="h4">{product.title}</Typography>
						</Grid>
						<Grid justifyContent="right">
							<Typography variant="h5" css={textdiv}>{product.price}$</Typography>
						</Grid>
						<Grid>
							<Typography variant="h6">{product.description}</Typography>
						</Grid>
						<Grid container css={textdiv}>
							<Grid item container xs={2} p={1}>
								<input type="number" css={input} min={1} max={10} 
									value={productCount} onChange={inputOnChange} />
							</Grid>
							<Grid item container xs={5} p={1}>
								<Button variant="contained" css={btn} onClick={addProductInBasket}>
									장바구니에 담기</Button>
							</Grid>
							<Grid item container xs={5} p={1}>
								<Button variant="contained" css={btn}>구매하기</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	)
}

export default ProductDetail