import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css, jsx } from '@emotion/react'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import { useRecoilState } from 'recoil';
import { userDataState, basketState } from '../../states/atoms'
import { db } from '../../firebaseConfig'
import { getDocs, query, collection, orderBy, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { confirmAlert } from 'react-confirm-alert'; // https://github.com/GA-MO/react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css';

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
	width: 3.5rem;
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
	const [allCheck, setAllCheck] = useState(false);

	const fetchBasketData = () => {
		try {
			getDocs(query(collection(db, userData.email, 
				'userData/basket'), orderBy("timeMillisecond", "desc")))
			.then((snapshot) => {
				const basket = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				console.log(basket);
				setBasket(basket)
				setLocalBasket(basket)
			}).catch(err => { })
		} catch(err) {
			console.log(err);
		}
	}

	const updateBasketData = (count, docId) => {
		updateDoc(doc(db, userData.email, 'userData/basket', docId), {
			"count": count
		});
	}

	const inputOnChange = (e, index) => {
		const basketCopy = JSON.parse(JSON.stringify(basket));
		
		if(Number(e.target.value) < 1) {
			basketCopy[index].count = '1'
			setBasket(basketCopy)
			setLocalBasket(basketCopy)
			updateBasketData('1', basketCopy[index].id)
		} else if(Number(e.target.value) > 10) {
			basketCopy[index].count = '10'
			setBasket(basketCopy)
			setLocalBasket(basketCopy)
			updateBasketData('10', basketCopy[index].id)
		} else {
			basketCopy[index].count = e.target.value
			setBasket(basketCopy)
			setLocalBasket(basketCopy)
			updateBasketData(e.target.value, basketCopy[index].id)
		}
  };

	const checkHandler = (e, index) => {
		const basketCopy = JSON.parse(JSON.stringify(basket));
		basketCopy[index].checked = !basketCopy[index].checked;
		setBasket(basketCopy);
		setLocalBasket(basketCopy);
	}

	const allCheckHandler = (e) => {
		const basketCopy = JSON.parse(JSON.stringify(basket));
		basketCopy.forEach(product => {
			product.checked = e.target.checked;
		})
		setBasket(basketCopy);
		setLocalBasket(basketCopy);
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
		let basketCopy = JSON.parse(JSON.stringify(basket));
		basket.forEach((product, index) => {
			if(product.checked) {
				deleteDoc(doc(db, userData.email, 'userData/basket', product.id))
				.then((snapshot) => { }).catch(err => { })
			}
		})
		basketCopy = basketCopy.filter((el, idx) => {
			return el.checked != true // true인것 다 지우기
		})
		setBasket(basketCopy);
		setLocalBasket(basketCopy);
	}

	const deleteProduct = (docId, index) => {
		deleteDoc(doc(db, userData.email, 'userData/basket', docId))
		.then((snapshot) => {
			const basketCopy = JSON.parse(JSON.stringify(basket));
			basketCopy.splice(index, 1);
			setBasket(basketCopy);
			setLocalBasket(basketCopy);
			enqueueSnackbar('삭제 성공', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
		}).catch(err => { })
	}

	useEffect(() => {
		if(userData.email == undefined) setAuth(false);
		else setAuth(true);
		return () => {
			
		}
	}, [userData])

	useEffect(() => {
		setBasket(JSON.parse(JSON.stringify(localBasket)));
		let total = 0;
		let allChecked = 0;
		localBasket.forEach((product) => {
			if(product.checked) total += product.count * product.price;
			else allChecked += 1;
		})
		setTotalPrice(Math.ceil(total * 100) / 100);
		if(allChecked > 0) setAllCheck(false)
		else setAllCheck(true)
		return () => {
			
		}
	}, [localBasket])

	useEffect(() => {
		if(userData.email != undefined) fetchBasketData();
	}, [])
	
	return (
		<Grid container direction="row" pt={1}>
			<ShoppingCartOutlinedIcon fontSize="large" />
			<Typography pl={1} variant="h4">장바구니</Typography>
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
						{basket.map((product, index) => (
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
											{product.price * product.count}$
										</Typography>
										<input type="number" css={input} min={1} max={10} 
											value={product.count} 
											onChange={e => inputOnChange(e, index)} />
									</Grid>
								</Grid>
								<Grid item container xs={2} p={2} justifyContent="end">
									<Button variant="contained" css={css`height:2rem;width:100%;`}
										onClick={() => deletePopup('single', product.id, index)}>삭제</Button>
								</Grid>
							</Grid>
						))}
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
				: <Grid container p={16} justifyContent="center"
						css={css`font-size:2.5rem;`}>로그인 하고 이용해주세요</Grid>
				}
			<SnackbarProvider preventDuplicate />
		</Grid>
	)
}

export default Basket