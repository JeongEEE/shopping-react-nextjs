import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import Typography from '@mui/material/Typography';
import networkController from 'src/api/networkController'
import ProductItem from 'src/components/productItem';
import TopButton from 'src/components/topButton';
import { db } from 'src/firebaseConfig'
import { useRecoilState } from 'recoil';
import { userDataState, wishState } from 'src/states/atoms';
import Carousel from 'react-material-ui-carousel'
import { Product } from 'src/types/product'
import { getDocs, getDoc, query, collection, orderBy, doc, limit, limitToLast, startAfter, endBefore } from "firebase/firestore";
import { whiteBtn } from 'src/styles/global';

const limitValue = 24;

export async function getStaticProps() {
  try {
		// const data: Array<Product> = await networkController.getAllProducts();
		const snapshot = await getDocs(query(collection(db, 'products'), orderBy("timeMillisecond", "desc"), limit(limitValue)));
		// data.forEach(item => {
		// 	item.wish = false;
		// })
		const data = snapshot.docs.map(v => {
			const item = v.data()
			return { id: v.id, ...item }
		});
		return {
      props: {
        productData: data,
      },
			revalidate: 600, // seconds
    };
	} catch(err) {
		console.log(err);
	}
}

export default function Home({ productData }) {
	const router = useRouter();
	const [products, setProducts] = useState<Array<Product>>([]);
	const [wishData, setWishData] = useRecoilState<Array<Product>>(wishState);
	const [userData, setUserData] = useRecoilState(userDataState);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);
	const [productCount, setProductCount] = useState(0);
	const [firstDoc, setFirstDoc] = useState(null);
	const [lastDoc, setLastDoc] = useState(null);

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

	const initFetch = () => {
		getDocs(query(collection(db, 'products'), orderBy("timeMillisecond", "desc"), limit(limitValue)))
		.then((snapshot) => {
			setFirstDoc(snapshot.docs[0])
			setLastDoc(snapshot.docs[snapshot.docs.length-1])
		}).catch((err) => { });
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

	const getProductCount = () => {
		getDoc(doc(db, 'docCount/products'))
		.then((snapshot) => {
			setProductCount(snapshot.data().count);
			let pageCount = Math.floor(snapshot.data().count / limitValue);
			if(snapshot.data().count % limitValue > 0) pageCount++;
			setPageCount(pageCount);
		}).catch((error) => { });
	}

	useEffect(() => {
		console.log('컴포넌트가 화면에 나타남');
		initFetch();
		getProductCount();
		if(wishData.length != 0 && userData.email) {
			let newArray = JSON.parse(JSON.stringify(productData));
			newArray.forEach((product, idx) => {
				const find = wishData.findIndex((el, index, arr) => el.title === product.title);
				if(find != -1) product.wish = true;
			})
			setProducts(newArray);
		} else {
			setProducts(productData);
		}
		return () => {
			console.log('컴포넌트가 화면에서 사라짐');
		}
	}, [])
	/*
		deps 에 특정 값을 넣게 된다면, 컴포넌트가 처음 마운트 될 때에도 호출이 되고, 
		지정한 값이 바뀔 때에도 호출이 됩니다. 그리고, deps 안에 특정 값이 있다면 언마운트시에도 
		호출이되고, 값이 바뀌기 직전에도 호출이 됩니다.

		deps 파라미터를 생략한다면, 컴포넌트가 리렌더링 될 때마다 호출이 됩니다.
	*/
	
  return (
		<Box>
			<Grid container mb={5}>
				<Grid>
					<Carousel>
						<Image src="/images/sale2.png" alt="J Shopping" width={1100} height={300} priority />
						<Image src="/images/sale1.png" alt="J Shopping" width={1100} height={300} priority />
						<Image src="/images/sale3.png" alt="J Shopping" width={1100} height={300} priority />
						<Image src="/images/sale4.png" alt="J Shopping" width={1100} height={300} priority />
						<Image src="/images/sale5.png" alt="J Shopping" width={1100} height={300} priority />
					</Carousel>
					<Grid mt={2} container direction="row" justifyContent="space-between" alignItems="center">
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
			</Grid>
			<TopButton />
		</Box>
  )
}
