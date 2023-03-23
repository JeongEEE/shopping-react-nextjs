import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css, jsx } from '@emotion/react'
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import { useRecoilState } from 'recoil';
import { userDataState, wishState, basketState } from '../../states/atoms'
import { db } from '../../firebaseConfig'
import { getDocs, query, collection, orderBy, doc, deleteDoc, updateDoc, addDoc } from "firebase/firestore";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { confirmAlert } from 'react-confirm-alert'; // https://github.com/GA-MO/react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { formatDateKor } from '../../lib/utils';

const detailCss = css`
	width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  word-break: break-word;
   
  display: -webkit-box;
  -webkit-line-clamp: 2; // 원하는 라인수
  -webkit-box-orient: vertical;
`
const whiteBtn = css`
	background-color: white;
	color: black;
	border: black 1px solid;
	&:hover {
		background-color: white;
	}
`

const WishListPage = () => {
	const [userData, setUserData] = useRecoilState(userDataState);
	const [localWishData, setLocalWishData] = useRecoilState(wishState);
	const [localBasket, setLocalBasket] = useRecoilState(basketState);
	const [auth, setAuth] = useState(false);
	const [basket, setBasket] = useState([]);
	const [wishData, setWishData] = useState([]);
	const [allCheck, setAllCheck] = useState(false);

	const fetchWishData = () => {
		try {
			getDocs(query(collection(db, userData.email, 
				'userData/wishList'), orderBy("timeMillisecond", "desc")))
			.then((snapshot) => {
				const wishList = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				console.log('wishList', wishList);
				setWishData(wishList)
				setLocalWishData(wishList)
			}).catch(err => { })
		} catch(err) {
			console.log(err);
		}
	}

	const checkHandler = (e, index) => {
		const wishCopy = JSON.parse(JSON.stringify(wishData));
		wishCopy[index].checked = !wishCopy[index].checked;
		setWishData(wishCopy);
		setLocalWishData(wishCopy);
	}

	const allCheckHandler = (e) => {
		const wishCopy = JSON.parse(JSON.stringify(wishData));
		wishCopy.forEach(product => {
			product.checked = e.target.checked;
		})
		setWishData(wishCopy);
		setLocalWishData(wishCopy);
	}

	const deletePopup = (type, docId, index) => {
		switch (type) {
			case 'all':
				confirmAlert({ title: '선택삭제', message: '선택하신 상품을 모두 삭제 하시겠습니까?',
					buttons: [
						{
							label: '예',
							onClick: () => {
								checkedDeleteProduct();
							}
						},
						{
							label: '아니오',
							onClick: () => { }
						}
					]
				});
				break;
			case 'single':
				confirmAlert({ title: '삭제', message: '해당 상품을 삭제 하시겠습니까?',
					buttons: [
						{
							label: '예',
							onClick: () => {
								deleteProduct(docId, index);
							}
						},
						{
							label: '아니오',
							onClick: () => { }
						}
					]
				});
				break;
		}
	}

	const checkedDeleteProduct = () => {
		let wishCopy = JSON.parse(JSON.stringify(wishData));
		wishData.forEach((product, index) => {
			if(product.checked) {
				deleteDoc(doc(db, userData.email, 'userData/wishList', product.id))
				.then((snapshot) => { }).catch(err => { })
			}
		})
		wishCopy = wishCopy.filter((el, idx) => {
			return el.checked != true // true인것 다 지우기
		})
		setWishData(wishCopy);
		setLocalWishData(wishCopy);
	}

	const deleteProduct = (docId, index) => {
		deleteDoc(doc(db, userData.email, 'userData/wishList', docId))
		.then((snapshot) => {
			const wishCopy = JSON.parse(JSON.stringify(wishData));
			wishCopy.splice(index, 1);
			setWishData(wishCopy);
			setLocalWishData(wishCopy);
			enqueueSnackbar('삭제 성공', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
		}).catch(err => { })
	}

	const checkAlreadyInBasket = (product) => {
		if(localBasket.length == 0) return false;

		const find = localBasket.findIndex((el, index, arr) => el.title === product.title);
		if(find == -1) return false;
		else return true;
	}
	const addProductInBasket = async (product) => {
		if(checkAlreadyInBasket(product)) {
			enqueueSnackbar('이미 장바구니에 있는 상품입니다', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			return;
		}
		const params = {
			...product,
			createdTime: formatDateKor(new Date()),
			timeMillisecond: Date.now()
		}
		await addDoc(collection(db, userData.email, 'userData/basket'), params)
		.then((docRef) => {
			enqueueSnackbar('장바구니에 등록 완료', { variant: 'success', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			try {
				let origin = JSON.parse(JSON.stringify(localBasket));
				origin.push({ id: docRef.id, ...params });
				setLocalBasket(origin);
			} catch(err) {
				console.log(err);
			}
		}).catch(err => {
			console.log(err);
		})
	}

	useEffect(() => {
		if(userData.email == undefined) setAuth(false);
		else setAuth(true);
		return () => {
			
		}
	}, [userData])

	useEffect(() => {
		setBasket(JSON.parse(JSON.stringify(localWishData)));
		let allChecked = 0;
		localWishData.forEach((product) => {
			if(!product.checked) allChecked += 1;
		})
		if(allChecked > 0) setAllCheck(false)
		else setAllCheck(true)
		return () => {
			
		}
	}, [localWishData])

	useEffect(() => {
		if(userData.email != undefined) fetchWishData();
	}, [])

	return (
		<Grid container direction="row">
			<FavoriteBorderOutlinedIcon fontSize="large" />
			<Typography pl={1} variant="h4">찜 목록</Typography>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			{auth
				?	<Grid container>
						<Grid container direction="row" alignItems="center"
							css={css`background-color:#e9e9e9;`}>
							<Checkbox checked={allCheck} onChange={allCheckHandler} /> 
							<Grid item mr={2}>전체선택</Grid>
							<Button variant="contained" css={css`height:2rem;`}
								onClick={() => deletePopup('all', null, null)}>선택삭제</Button>
						</Grid>
						<Grid container css={css`border-bottom:1px solid black;`}></Grid>
						{wishData.map((product, index) => (
							<Grid container direction="row" justifyContent="center" p={2} key={product.id}
								css={css`border-bottom:1px solid gray;`}>
								<Grid item container xs={2} p={2} alignItems="start">
									<Checkbox checked={product.checked} 
										onChange={(e) => checkHandler(e, index)} />
									<img src={product.image} alt={product.title} width={100} height={100} />
								</Grid>
								<Grid item container xs={8} p={2}>
									<Typography variant="h5" css={detailCss}>{product.title}</Typography>
									<Grid container direction="row" justifyContent="start">
										<Typography variant="h6" align="right" mr={2}>
											{product.price}$
										</Typography>
									</Grid>
								</Grid>
								<Grid item container xs={2} p={2} justifyContent="center">
									<Button variant="contained" css={css`${whiteBtn};height:2rem;`}
										onClick={() => deletePopup('single', product.id, index)}>삭제</Button>
									<Button variant="contained" css={css`height:2rem;`}
										onClick={() => addProductInBasket(product)}>장바구니에 담기</Button>
								</Grid>
							</Grid>
						))}
						<Grid container css={css`border-bottom:1px solid black;`}></Grid>
					</Grid>
				: <Grid container p={16} justifyContent="center"
						css={css`font-size:2.5rem;`}>로그인 하고 이용해주세요</Grid>
				}
			<SnackbarProvider preventDuplicate />
		</Grid>
	)
}

export default WishListPage