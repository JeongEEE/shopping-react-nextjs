import React, { useState, useEffect } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { css } from '@emotion/react'
import { db } from 'src/firebaseConfig'
import { getDocs, setDoc, getDoc, query, collection, orderBy, doc, deleteDoc, updateDoc, limit, limitToLast, startAfter, endBefore, endAt } from "firebase/firestore";
import { useRouter } from "next/router";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const UserManage = () => {
	const router = useRouter();
	const [userList, setUserList] = useState([]);

	const backPage = () => {
		router.back();
	}

	const fetchUserList = async () => {
		try {
			getDocs(query(collection(db, 'userData/userList/auth'), orderBy("timeMillisecond", "desc")))
			.then((snapshot) => {
				const data = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				console.log('회원목록 - ', data);
				setUserList(data);
			}).catch(err => { })
		} catch(err) {
			console.log(err);
		}
	}

	const roleCheck = (role) => {
		if(role == 0) return '관리자';
		else if(role == 1) return '일반사용자';
		else return '판매자';
	}

	useEffect(() => {
		fetchUserList();
	
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
					<Typography pl={1} variant="h4">관리자 메뉴 - 회원 관리</Typography>
				</Grid>
				{/* <Button variant="contained" css={css`height:2rem;width:10rem;`}
					onClick={()=> openForm()}>쿠폰 추가</Button> */}
			</Grid>
			<Grid container css={css`border-bottom:1px solid black;`}></Grid>
			<Grid container direction="column" alignItems="start" p={2} pt={1} pb={1}
				css={css`background-color:#e9e9e9;`}>
				<Grid container direction="row" justifyContent="start" alignItems="center">
					<Grid item container xs={3} justifyContent="center">이메일</Grid>
					<Grid item container xs={2} justifyContent="center">Phone</Grid>
					<Grid item container xs={1} justifyContent="center">ProviderId</Grid>
					<Grid item container xs={1} justifyContent="center">Role</Grid>
					<Grid item container xs={3} justifyContent="center">가입날짜</Grid>
					<Grid item container xs={2} pr={2} justifyContent="end">조작</Grid>
				</Grid>
			</Grid>
			<Grid container direction="column" alignItems="start" p={1}>
				{userList.map((user, index) => (
					<Grid container direction="row" justifyContent="start" alignItems="center" 
						p={1} key={user.id} css={css`border-bottom:1px solid #d2d2d2;`}>
						<Grid item container xs={3} justifyContent="center">
							<Typography variant="h7" align="center">{user.email}</Typography>
						</Grid>
						<Grid item container xs={2} justifyContent="center">
							<Typography variant="h7" align="left">{user.phoneNumber ?? '-'}</Typography>
						</Grid>
						<Grid item container xs={1} justifyContent="center">
							<Typography variant="h7" align="left">{user.providerId}</Typography>
						</Grid>
						<Grid item container xs={1} justifyContent="center">
							<Typography variant="h7" align="left" 
								css={css`color: ${user.role == 0 ? 'blue' : 'black'};`}
								>{roleCheck(user.role)}</Typography>
						</Grid>
						<Grid item container xs={3} justifyContent="center">
							<Typography variant="h7" align="left">{user.createdTime}</Typography>
						</Grid>
						<Grid item container xs={2} justifyContent="end">
							{/* <Button variant="contained" 
								css={css`${whiteBtn};height:2rem;margin-right:5px;`}
								onClick={()=> openForm('modify', product)}>수정</Button>
							<Button variant="contained" css={css`${whiteBtn};height:2rem;`} 
								onClick={()=> askDelete(product)}>삭제</Button> */}
						</Grid>
					</Grid>
				))}
			</Grid>
		</Grid>
	)
}

export default UserManage