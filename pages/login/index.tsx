import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { css, jsx } from '@emotion/react'
import { useRouter } from "next/router";
import networkController from '../api/networkController'
import LoadingButton from '@mui/lab/LoadingButton';
import { useRecoilState } from 'recoil';
import { userDataState } from '../../states/atoms'

const loginWrap = css`
	max-width: 500px;
	min-width: 500px;
	min-height: 300px;
	margin-left: auto;
	margin-right: auto;
	border: 3px solid grey;
	border-radius: 15px;
`
const input = css`
	width: 60%;
`
const btn = css`
	width: 60%;
	height: 2.5rem;
	background-color: #1976d2;
`

const Login = () => {
	const [id, setId] = useState('');
	const [pw, setPw] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const [userData, setUserData] = useRecoilState(userDataState);

	const goSignUpPage = () => {
		router.push("/login/signUp")
	}

	const idInputOnChange = (e) => {
		setId(e.target.value);
	}
	const pwInputOnChange = (e) => {
		setPw(e.target.value);
	}

	const requestSignIn = async () => {
		setLoading(true);
		const user = await networkController.firebaseSignIn(id, pw);
		console.log(user);
		setUserData(user);
		setLoading(false);
		router.push("/")
	}

	return (
		<Box mt={16} css={loginWrap}>
			<Grid pt={3} container justifyContent="center">
				<Typography variant="h4">로그인</Typography>
			</Grid>
			<Grid pt={3} container justifyContent="center">
				<TextField label="Email" variant="outlined" css={input} required
					value={id} onChange={idInputOnChange} />
			</Grid>
			<Grid pt={2} container justifyContent="center">
				<TextField label="Password" variant="outlined" css={input}
					required type="password" value={pw} onChange={pwInputOnChange} />
			</Grid>
			<Grid pt={2} container justifyContent="center">
				<LoadingButton variant="contained" css={btn} onClick={requestSignIn}
					loading={loading}>로그인</LoadingButton>
			</Grid>
			<Grid pt={1} pb={2} container justifyContent="center">
				<Button variant="text" onClick={goSignUpPage}>계정이 없으신가요? 회원가입 하세요</Button>
			</Grid>
		</Box>
	)
}

export default Login