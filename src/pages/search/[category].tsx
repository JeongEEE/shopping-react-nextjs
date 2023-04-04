import React, { useState, useEffect } from 'react';
import { Product } from 'src/types/product'
import { useRecoilState } from 'recoil';
import { userDataState, wishState } from 'src/states/atoms';
import networkController from 'src/api/networkController'
import ProductItem from 'src/components/productItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import CheckIcon from '@mui/icons-material/Check';
import { blackTextBtn } from 'src/styles/global'
import { db } from 'src/firebaseConfig'
import { getDocs, setDoc, getDoc, query, collection, orderBy, doc, deleteDoc, 
	updateDoc, limit, limitToLast, startAfter, endBefore, endAt, where } from "firebase/firestore";
import { whiteBtn } from 'src/styles/global';

const limitValue = 24;

// export async function getServerSideProps({ query: { category } }) {
// 	// 새로고침할때 쿼리값이 날라가는걸 방지하기위해 서버사이드로 쿼리를 받아옴
// 	return {
// 		props: {
// 			category,
// 		}
// 	}
// }

const SearchPage = ({ category }) => {
	const [products, setProducts] = useState<Array<Product>>([]);
	const [wishData, setWishData] = useRecoilState<Array<Product>>(wishState);
	const [userData, setUserData] = useRecoilState(userDataState);
	const [sort, setSort] = useState(0);
	const [page, setPage] = useState(1);
	const [firstDoc, setFirstDoc] = useState(null);
	const [lastDoc, setLastDoc] = useState(null);

	const handlePage = (direction) => {
    if(direction === 'next') {
			if(products.length < limitValue) return;
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

	const directionFetch = (direction) => {
		if(direction == 'next') {
			getDocs(query(collection(db, 'products'), where('category', '==', category), startAfter(lastDoc), limit(limitValue)))
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
			getDocs(query(collection(db, 'products'), where('category', '==', category), endBefore(firstDoc), limitToLast(limitValue)))
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

	const fetchSearchData = () => {
		try {
			getDocs(query(collection(db, 'products'), where('category', '==', category), limit(16)))
			.then((snapshot) => {
				setFirstDoc(snapshot.docs[0])
				setLastDoc(snapshot.docs[snapshot.docs.length-1])
				const data = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				console.log(data);
				if(wishData.length != 0 && userData.email) {
					setProducts(data);
				} else {
					let newArray = JSON.parse(JSON.stringify(data));
					newArray.forEach((product, idx) => {
						const find = wishData.findIndex((el, index, arr) => el.title === product.title);
						if(find != -1) product.wish = false;
					})
					setProducts(newArray);
				}
			}).catch((err) => { });
		} catch(err) {
			console.log(err);		
		}
	}

	const clickSort = (value) => {
		if(value === 1) {
			setSort(1);
			products.sort(function(a, b) {
				return a.price - b.price;
			});
		} else { // value 2
			setSort(2);
			products.sort(function(a, b) {
				return b.price - a.price;
			});
		}
	}

	useEffect(() => {
		fetchSearchData();
	
		return () => {
			
		}
	}, [category])
	
	return (
		<Box>
			<Grid container mb={5}>
				<Typography variant="h6" mt={2}>&quot;{category}&quot;에 대한 검색결과</Typography>
				<Grid mt={1} pl={2} container direction="row" justifyContent="start" alignItems="center"
					css={css`background-color:#eeeeee;border-radius:7px;`}>
					<Button variant="text" onClick={() => clickSort(1)} css={blackTextBtn}>
						{sort === 1 ? <CheckIcon /> : null}낮은가격순
					</Button>
					<Button variant="text" onClick={() => clickSort(2)} css={blackTextBtn}>
						{sort === 2 ? <CheckIcon /> : null}높은가격순
					</Button>
				</Grid>
				<Grid mt={2} container direction="row" justifyContent="start" alignItems="center">
					{products.map(product => (
						<ProductItem product={product} key={product.id} />
					))}
				</Grid>
				<Grid container direction="row" justifyContent="center" alignItems="center" mt={2} mb={5}>
					<Button variant="contained" css={css`${whiteBtn};height:2rem;margin-right:15px;`}
						onClick={()=> handlePage('prev')}>이전</Button>
					<Typography variant="h7" align="center">page : {page}</Typography>
					<Button variant="contained" css={css`${whiteBtn};height:2rem;margin-left:15px;`}
						onClick={()=> handlePage('next')}>다음</Button>
				</Grid>
			</Grid>
		</Box>
	)
}

SearchPage.getInitialProps = async ({ query }) => {
  const { category } = query

  return { category }
}

export default SearchPage