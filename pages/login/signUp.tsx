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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebaseConfig'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

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
`

const SignUp = () => {
	const [id, setId] = useState('');
	const [pw, setPw] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const idInputOnChange = (e) => {
		setId(e.target.value);
	}
	const pwInputOnChange = (e) => {
		setPw(e.target.value);
	}

	const requestSignUp = async () => {
		setLoading(true);
		createUserWithEmailAndPassword(auth, id, pw)
		.then((userCredential) => {
			const user = userCredential.user;
			console.log(user);
			setLoading(false);
			router.push("/login")
		})
		.catch((error) => {
			console.log(error.message);
			setLoading(false);
			if(error.message === 'Firebase: Error (auth/email-already-in-use).') {
				enqueueSnackbar('이미 가입된 이메일입니다', 
					{ variant: 'warning', autoHideDuration: 2000,
						anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			}
		});
	}

	return (
		<Box mt={16} css={loginWrap}>
			<Grid pt={3} container justifyContent="center">
				<Typography variant="h4">J 쇼핑몰 회원가입</Typography>
			</Grid>
			<Grid pt={3} container justifyContent="center">
				<TextField label="Email" variant="outlined" css={input} 
					required value={id} onChange={idInputOnChange} />
			</Grid>
			<Grid pt={2} container justifyContent="center">
				<TextField label="Password" variant="outlined" css={input}
				  required value={pw} onChange={pwInputOnChange} type="password" />
			</Grid>
			<Grid pt={2} pb={3} container justifyContent="center">
				<LoadingButton variant="contained" css={btn} onClick={requestSignUp}
					loading={loading}>회원가입</LoadingButton>
			</Grid>
			<SnackbarProvider preventDuplicate />
		</Box>
	)
}

export default SignUp