import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import Stack from '@mui/material/Stack';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from "next/router";
import { db, storage } from 'src/firebaseConfig'
import { getDocs, setDoc, getDoc, query, collection, orderBy, doc, deleteDoc, updateDoc, limit, limitToLast, startAfter, endBefore, endAt } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import AddProductDialog from 'src/components/addProductDialog';
import { whiteBtn } from 'src/styles/global';
import { confirmAlert } from 'react-confirm-alert';
import { priceFormat } from 'src/lib/utils';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const limitValue = 8;

const ProductManage = () => {
	const router = useRouter();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editType, setEditType] = useState('add');
	const [originProduct, setOriginProduct] = useState(undefined);
	const [products, setProducts] = useState([]);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);
	const [productCount, setProductCount] = useState(0);
	const [firstDoc, setFirstDoc] = useState(null);
	const [lastDoc, setLastDoc] = useState(null);

	const backPage = () => {
		router.back();
	}
	const openForm = (edit, product) => {
		setEditType(edit);
		setOriginProduct(product);
		setDialogOpen(true);
	}
	const visibleFunc = (visible) => {
		setDialogOpen(visible);
	}
	const successFunc = (successValue) => {
		const str = successValue === 'add' ? '추가 성공' : '수정 성공';
		enqueueSnackbar(str, 
			{ variant: 'success', autoHideDuration: 2000,
			anchorOrigin: { vertical: 'top', horizontal: 'center' }})
		fetchProductData();
		getProductCount();
	}
	const handlePage = (direction) => {
    if(direction === 'next') {
			if(page === pageCount) return;
			else {
				setPage(page + 1);
				directionFetch('next');
			}
		} else { // prev
			if(page === 1) return;
			else {
				setPage(page - 1)
				directionFetch('prev');
			}
		}
  }

	const fetchProductData = () => {
		try {
			getDocs(query(collection(db, 'products'), orderBy("timeMillisecond", "desc"), limit(limitValue)))
			.then((snapshot) => {
				setFirstDoc(snapshot.docs[0])
				setLastDoc(snapshot.docs[snapshot.docs.length-1])
				const data = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				console.log(data);
				setProducts(data);
			}).catch(err => { })
		} catch(err) {
			console.log(err);
		}
	}

	const directionFetch = (direction) => {
		if(direction == 'next') {
			getDocs(query(collection(db, 'products'), orderBy("timeMillisecond", "desc"), startAfter(lastDoc), limit(limitValue)))
			.then((snapshot) => {
				setFirstDoc(snapshot.docs[0])
				setLastDoc(snapshot.docs[snapshot.docs.length-1])
				const data = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				console.log(data);
				setProducts(data);
			}).catch((err) => { });
		} else {
			getDocs(query(collection(db, 'products'), orderBy("timeMillisecond", "desc"), endBefore(firstDoc), limitToLast(limitValue)))
			.then((snapshot) => {
				setFirstDoc(snapshot.docs[0])
				setLastDoc(snapshot.docs[snapshot.docs.length-1])
				const data = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				console.log(data);
				setProducts(data);
			}).catch((err) => { });
		}
	}

	const deleteProduct = async (product) => {
		await deleteObject(ref(storage, `productImage/${product.fileName}`))
			.then((snapshot) => { }).catch((error) => { });
		await deleteDoc(doc(db, 'products', product.id))
			.then((snapshot) => {
				enqueueSnackbar('삭제 성공', { variant: 'success', autoHideDuration: 2000,
					anchorOrigin: { vertical: 'top', horizontal: 'center' }});
				minusProductCount();
				fetchProductData();
			})
			.catch((error) => { });
	}

	const askDelete = (product) => {
		confirmAlert({ title: '삭제', message: '선택하신 상품을 삭제 하시겠습니까?',
			buttons: [
				{
					label: '예',
					onClick: () => {
						deleteProduct(product);
					}
				},
				{
					label: '아니오',
					onClick: () => { }
				}
			]
		});
	}

	const getProductCount = () => {
		getDoc(doc(db, 'docCount/products'))
		.then((snapshot) => {
			setProductCount(snapshot.data().count);
			let pageCount = Math.floor(snapshot.data().count / limitValue);
			if(snapshot.data().count % limitValue > 0) pageCount++;
			setPageCount(pageCount);
		}).catch((error) => { });
	}

	const minusProductCount = () => {
		setDoc(doc(db, 'docCount/products'), {
			count: productCount - 1
		}).then((docRef) => {
			setProductCount(productCount - 1);
		}).catch((error) => { });	
	}

	useEffect(() => {
		fetchProductData();
		getProductCount();
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
					<Typography pl={1} variant="h4">관리자 메뉴 - 상품 관리</Typography>
				</Grid>
				<Button variant="contained" css={css`height:2rem;width:10rem;`}
					onClick={()=> openForm('add', undefined)}>상품 추가</Button>
			</Grid>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			<Grid container direction="column" alignItems="start" p={2} pt={1} pb={1}
				css={css`background-color:#e9e9e9;`}>
				<Grid container direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={1} justifyContent="center">이미지</Grid>
					<Grid item container xs={7} justifyContent="center">상품명</Grid>
					<Grid item container xs={1} justifyContent="center">카테고리</Grid>
					<Grid item container xs={1} justifyContent="center">가격(원)</Grid>
					<Grid item container xs={2} pr={2} justifyContent="end">조작</Grid>
				</Grid>
			</Grid>
			<Grid container direction="column" alignItems="start" p={1}>
				{products.map((product, index) => (
					<Grid container direction="row" justifyContent="start" alignItems="center" 
						p={1} key={product.id} css={css`border-bottom:1px solid #d2d2d2;`}>
						<Grid item container xs={1} justifyContent="center">
							<img src={product.image} alt={product.title} height={50}
								css={css`max-width:50px;`} />
						</Grid>
						<Grid item container xs={7} alignItems="start">
							<Typography variant="h5" align="left">{product.title}</Typography>
						</Grid>
						<Grid item container xs={1} justifyContent="center">
							<Typography variant="h6" align="left">{product.category}</Typography>
						</Grid>
						<Grid item container xs={1} justifyContent="center">
							<Typography variant="h6" align="left">{priceFormat(product.price)}</Typography>
						</Grid>
						<Grid item container xs={2} justifyContent="end">
							<Button variant="contained" 
								css={css`${whiteBtn};height:2rem;margin-right:5px;`}
								onClick={()=> openForm('modify', product)}>수정</Button>
							<Button variant="contained" css={css`${whiteBtn};height:2rem;`} 
								onClick={()=> askDelete(product)}>삭제</Button>
						</Grid>
					</Grid>
				))}
			</Grid>
			<Grid container direction="row" justifyContent="center" alignItems="center" mt={2} mb={5}>
				<Button variant="contained" css={css`${whiteBtn};height:2rem;margin-right:15px;`}
					onClick={()=> handlePage('prev')}>이전</Button>
				<Typography variant="h7" align="center">page : {page}</Typography>
				<Button variant="contained" css={css`${whiteBtn};height:2rem;margin-left:15px;`}
					onClick={()=> handlePage('next')}>다음</Button>
			</Grid>
			<AddProductDialog visible={dialogOpen} editType={editType} originProduct={originProduct}
			 	visibleFunc={visibleFunc} successFunc={successFunc} />
			<SnackbarProvider preventDuplicate />
		</Grid>
	)
}

export default ProductManage