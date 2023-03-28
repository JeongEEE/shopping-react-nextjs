import React, { useState, useEffect } from 'react';
import Product from '../../types/product'
import { useRecoilState } from 'recoil';
import { userDataState, wishState } from '../../states/atoms';
import networkController from '../api/networkController'
import ProductItem from '../../components/productItem';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import CheckIcon from '@mui/icons-material/Check';
import { blackTextBtn } from '../../styles/global'

export async function getServerSideProps({ query: { category } }) {
	// 새로고침할때 쿼리값이 날라가는걸 방지하기위해 서버사이드로 쿼리를 받아옴
  return {
    props: {
      category,
    },
  };
}

const SearchPage = ({ category }) => {
	const [products, setProducts] = useState<Array<Product>>([]);
	const [wishData, setWishData] = useRecoilState<Array<Product>>(wishState);
	const [userData, setUserData] = useRecoilState(userDataState);
	const [sort, setSort] = useState(0);

	const fetchSearchData = async () => {
		try {
			const data: Array<Product> = await networkController.getProductsSpecificCategory(category);
			console.log(data);
			if(wishData.length != 0 && userData.email) {
				let newArray = JSON.parse(JSON.stringify(data));
				newArray.forEach((product, idx) => {
					const find = wishData.findIndex((el, index, arr) => el.title === product.title);
					if(find != -1) product.wish = true;
				})
				setProducts(newArray);
			} else {
				setProducts(data);
			}
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
				<Typography variant="h6" mt={2}>'{category}'에 대한 검색결과</Typography>
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
			</Grid>
		</Box>
	)
}

export default SearchPage