import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css, jsx } from '@emotion/react'
import { db } from 'src/firebaseConfig'
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { useRecoilState } from 'recoil';
import { userDataState, wishState, basketState, purchaseState } from 'src/states/atoms';
import { formatDateKor } from 'src/lib/utils';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Product } from 'src/types/product'
import { priceFormat } from 'src/lib/utils';
import HeadMeta from 'src/components/headMeta';
import { useQuery } from "react-query";

const textdiv = css`
	height: 2rem;
`
const btn = css`
	width: 100%;
`
const wishBtn = css`
	width: 100%;
	background-color: white;
	border: 1px solid black;
	color: black;
	&:hover {
		background-color: white;
	}
`
const input = css`
	width: 100%;
	font-size: 1.5rem;
	padding: 5px;
`
const priceStyle = (props) => css`
	text-decoration: ${props.product.discount > 0 ? 'line-through' : 'none'};
	font-size: ${props.product.discount > 0 ? '1rem' : '1.5rem'};
	color: ${props.product.discount > 0 ? 'grey' : 'black' };
`

// export async function getServerSideProps({ query: { id } }) {
// 	// 새로고침할때 쿼리값이 날라가는걸 방지하기위해 서버사이드로 쿼리를 받아옴
//   return {
//     props: {
//       id,
//     },
//   };
// }

const ProductDetail = ({ id }) => {
	const router = useRouter();
	const [product, setProduct] = useState<Product>([]);
	const [productCount, setProductCount] = useState('1');
	const [userData, setUserData] = useRecoilState(userDataState);
	const [wishData, setWishData] = useRecoilState<Array<Product>>(wishState);
	const [basketData, setBasketData] = useRecoilState<Array<Product>>(basketState);
	const [purchaseList, setPurchaseList] = useRecoilState<Array<Product>>(purchaseState);

	const fetchProductDetail = () => {
		return getDoc(doc(db, 'products', id));
	}

	const { data, status } = useQuery("changeUser", fetchProductDetail, {
		onSuccess: (snapshot) => {
			let data = snapshot.data() as Product;
			setProduct(data);
		},
		onError: e => {
			console.log(e.message);
		}
	});

	const inputOnChange = (e) => {
		const value = Number(e.target.value);
		if(value < 1) setProductCount('1');
		else if(value > 10) setProductCount('10');
    else setProductCount(e.target.value);
  };

	const checkAlreadyInBasket = () => {
		if(basketData.length == 0) return false;

		const find = basketData.findIndex((el, index, arr) => el.title === product.title);
		if(find == -1) return false;
		else return true;
	}
	const checkAlreadyInWish = () => {
		if(wishData.length == 0) return false;

		const find = wishData.findIndex((el, index, arr) => el.title === product.title);
		if(find == -1) return false;
		else return true;
	}

	const addProductInWishList = async () => {
		if(userData.email == undefined) {
			enqueueSnackbar('로그인하고 이용해주세요', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			return;
		}
		if(checkAlreadyInWish()) {
			enqueueSnackbar('이미 찜목록에 있는 상품입니다', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			return;
		}
		const params = {
			email: userData.email,
			category: product.category,
			image: product.image,
			price: product.price,
			discount: product.discount,
			title: product.title,
			description: product.description,
			count: productCount,
			checked: true,
			createdTime: formatDateKor(new Date()),
			timeMillisecond: Date.now()
		}
		await addDoc(collection(db, 'userData/wishList', userData.email), params)
		.then((docRef) => {
			enqueueSnackbar('찜목록에 등록 완료', { variant: 'success', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }});
			try {
				let origin = JSON.parse(JSON.stringify(wishData));
				origin.push({ id: docRef.id, ...params });
				setWishData(origin);
				setProduct((prev) => {
					return { ...prev, wish: true }
				})
			} catch(err) {
				console.log(err);
			}
		}).catch(err => {
			console.log(err);
		})
	}

	const addProductInBasket = async () => {
		if(userData.email == undefined) {
			enqueueSnackbar('로그인하고 이용해주세요', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			return;
		}
		if(checkAlreadyInBasket()) {
			enqueueSnackbar('이미 장바구니에 있는 상품입니다', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			return;
		}
		const params = {
			email: userData.email,
			category: product.category,
			image: product.image,
			price: product.price,
			discount: product.discount,
			title: product.title,
			description: product.description,
			count: productCount,
			checked: true,
			createdTime: formatDateKor(new Date()),
			timeMillisecond: Date.now()
		}
		await addDoc(collection(db, 'userData/basket', userData.email), params)
		.then((docRef) => {
			enqueueSnackbar('장바구니에 등록 완료', { variant: 'success', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			try {
				let origin = JSON.parse(JSON.stringify(basketData));
				origin.push({ id: docRef.id, ...params });
				setBasketData(origin);
			} catch(err) {
				console.log(err);
			}
		}).catch(err => {
			console.log(err);
		})
	}

	const goPurchase = () => {
		if(userData.email == undefined) {
			enqueueSnackbar('로그인하고 이용해주세요', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			return;
		}
		setPurchaseList([product]);
		router.push('/purchase');
	}
	
	return (
		<Box>
			<HeadMeta title={product.title} description={product.description}
				url={`https://shopping-react-ece42.firebaseapp.com/product/${id}`}
				image={product.image} />
			<Grid container mt={3}>
				<Grid container direction="row">
					<Grid item container xs={6} p={2} justifyContent="center">
						<img src={product.image} alt={product.title} height={400}
							css={css`max-width:400px;`} />
					</Grid>
					<Grid item container xs={6} p={2}>
						<Grid container>
							<Typography variant="h4">{product.title}</Typography>
						</Grid>
						<Grid container justifyContent="right" mt={1}>
							<Typography variant="h5" css={priceStyle({product})}>{priceFormat(product.price ?? 0)}원</Typography>
						</Grid>
						{product.discount > 0
							? <Grid container direction="row" justifyContent="right" mb={1}>
									<Typography variant="h5" align="right"
										css={css`color: #3d5afc;margin-right:5px;font-weight:bold;`}>
										J몰 할인가
									</Typography>
									<Typography variant="h5" align="right">
										{priceFormat(product.price - (product.price * (0.01 * product.discount)))}원
									</Typography>
								</Grid>
							: <Grid container justifyContent="right" mb={1}></Grid>
						}
						<Grid>
							<Typography variant="h6">{product.description}</Typography>
						</Grid>
						<Grid container css={textdiv}>
							<Grid item container xs={2} p={1}>
								<input type="number" css={input} min={1} max={10} 
									value={productCount} onChange={inputOnChange} />
							</Grid>
							<Grid item container xs={3} p={1}>
								<Button variant="contained" css={wishBtn} onClick={addProductInWishList}>
									{checkAlreadyInWish() ? <FavoriteIcon css={css`color:red;`} /> : <FavoriteBorderOutlinedIcon />}
									찜 하기
								</Button>
							</Grid>
							<Grid item container xs={4} p={1}>
								<Button variant="contained" css={btn} onClick={addProductInBasket}>
									장바구니에 담기</Button>
							</Grid>
							<Grid item container xs={3} p={1}>
								<Button variant="contained" css={btn}
									onClick={goPurchase}>구매하기</Button>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<SnackbarProvider preventDuplicate />
		</Box>
	)
}

ProductDetail.getInitialProps = async ({ query }) => {
  const { id } = query

  return { id }
}

export default ProductDetail