import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import Stack from '@mui/material/Stack';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { useRouter } from "next/router";
import { db } from 'src/firebaseConfig'
import { getDocs, setDoc, getDoc, query, collection, orderBy, doc, deleteDoc, updateDoc, limit, limitToLast, startAfter, endBefore, endAt } from "firebase/firestore";
import { whiteBtn } from 'src/styles/global';
import { confirmAlert } from 'react-confirm-alert';
import { useRecoilState } from 'recoil';
import { userDataState, categoriesState } from 'src/states/atoms';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const categoryItem = css`
	border-radius: 10px;
	background-color: #d4e1ff;
	color: black;
`

const CategoryManage = () => {
	const router = useRouter();
	const [localCategories, setLocalCategories] = useRecoilState<Array<string>>(categoriesState);
	const [categories, setCategories] = useState([]);
	const [categoryText, setCategoryText] = useState('');
	const [loading, setLoading] = useState<boolean>(false);

	const textChange = (e) => {
		setCategoryText(e.target.value);
	}
	const backPage = () => {
		router.back();
	}

	const fetchCategories = async () => {
		try {
			getDoc(doc(db, 'category/categoryList'))
			.then((snapshot) => {
				const data = snapshot.data().data;
				console.log('categories', data);
				setLocalCategories(data);
			}).catch((error) => { });
		} catch(err) {
			console.log(err);
		}
	}

	const deleteCategory = (category) => {
		const idx = categories.findIndex((e) => e === category);
		if(idx == -1) return;
		let tempList = [...categories];
		tempList.splice(idx, 1);
		setDoc(doc(db, 'category/categoryList'), {
			data: tempList
		}).then((docRef) => {
			setLocalCategories(tempList);
			enqueueSnackbar('삭제 성공', { variant: 'success', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }});
		}).catch((error) => { });	
	}

	const askDelete = (category) => {
		confirmAlert({ title: '삭제', message: '선택하신 카테고리를 삭제 하시겠습니까? 카테고리 상품이 있는지 먼저 확인해야 합니다.',
			buttons: [
				{
					label: '예',
					onClick: () => {
						deleteCategory(category);
					}
				},
				{
					label: '아니오',
					onClick: () => { }
				}
			]
		});
	}

	const AddCategory = () => {
		if(categoryText === '') return;
		const blank_pattern = /^\s+|\s+$/g;
		if(str.replace(blank_pattern, '' ) == "" ) return;

		setLoading(true);
		const newList = [...categories, categoryText];
		setDoc(doc(db, 'category/categoryList'), {
			data: newList
		}).then((docRef) => {
			setLocalCategories(newList);
			setLoading(false);
			enqueueSnackbar('추가 성공', { variant: 'success', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }});
		}).catch((error) => {
			setLoading(false);
		});	
	} 

	useEffect(() => {
		setCategories(localCategories)
	
		return () => {
			
		}
	}, [localCategories])
	

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
					<Typography pl={1} variant="h4">관리자 메뉴 - 카테고리 관리</Typography>
				</Grid>
				<Grid container direction="row" justifyContent="end" alignItems="center"
					css={css`width:500px;`}>
					<TextField label="카테고리 입력" id="outlined-size-small" onChange={textChange}
						size="small" InputProps={{ sx: { height: '2rem' } }}/>
					<LoadingButton variant="contained" css={css`height:2rem;width:10rem;margin-left:10px;`}
						onClick={AddCategory} loading={loading}>카테고리 추가</LoadingButton>
				</Grid>
			</Grid>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			<Grid container direction="row" alignItems="start" p={3}>
				{categories.map((category) => (
					<Grid item container xs={'auto'} p={1} pl={2} pr={2} ml={1} mr={1} justifyContent="center"
						alignItems="center" key={category} css={categoryItem}>
						<Grid container direction="row" justifyContent="center" alignItems="center">
							<div css={css`padding-top:2px;`}>{category}</div>
							<Button variant="text" css={css`margin:0;padding:0;min-width:25px;`} 
								onClick={()=> askDelete(category)}>
								<CloseIcon fontSize="small" sx={{ color: 'black' }} />
							</Button>
						</Grid>
					</Grid>
				))}
			</Grid>
			<SnackbarProvider preventDuplicate />
		</Grid>
	)
}

export default CategoryManage