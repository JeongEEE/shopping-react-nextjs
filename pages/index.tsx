import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from "next/router";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import networkController from './api/networkController'
import ProductItem from '../components/productItem';
import { db } from '../firebaseConfig'

export default function Home() {
	const router = useRouter();
	const [products, setProducts] = useState([]);

	function goWhiteTest() {
		router.push("/white-test")
	}

	useEffect(() => {
		console.log('컴포넌트가 화면에 나타남');
		networkController.getAllProducts().then((data) => {
			console.log(data);
			setProducts(data);
		});
		console.log(db);

		// firebase 로그인 상태 변경을 감지
		// authService.onAuthStateChanged((user) => {
    //   if (user) {
    //     setIsLoggedIn(true);
    //   } else {
    //     setLogout();
    //   }
    // });
		
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
					<Image src="/images/bg1.jpg" alt="J Shopping" width={1100} height={250} />
					<Grid container direction="row" justifyContent="space-between" alignItems="center">
						{products.map(product => (
							<ProductItem product={product} key={product.id} />
						))}
					</Grid>
				</Grid>
			</Grid>
		</Box>
  )
}
