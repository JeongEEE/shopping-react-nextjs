import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import classes from './main-navigation.module.css'
import Logo from './logo'
import { useRecoilState } from 'recoil';
import { loginStatus, userDataState } from '../../states/atoms';
import Button from '@mui/material/Button';
import { auth } from '../../firebaseConfig'
import { signOut } from "firebase/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { css, jsx } from '@emotion/react'

const userBtn = css`
	color: black;
	font-weight: bold;
`

function MainNavigation() {
	const [status, setStatus] = useRecoilState(loginStatus);
	const [userData, setUserData] = useRecoilState(userDataState);
	const [access, setAccess] = useState(false);
	const [email, setEmail] = useState('');

  useEffect(() => {
		console.log('login-' ,status);
		setAccess(status)
		return () => {
			
		}
	}, [status])
	
	useEffect(() => {
		console.log('userData-' ,userData);
		if(status) setEmail(userData.email);
		else setEmail('');
		return () => {
			
		}
	}, [userData])
	
	
	const logout = () => {
		signOut(auth).then(() => {
			setStatus(false)
			setUserData({});
		}).catch((error) => {
			console.log(error);
		});
	}

  return (
    <header className={classes.header}>
      <Link href="/">
        <Logo />
      </Link>
      <nav>
				<ul>
					<div>{email}</div>
					{access ? <AccountCircleIcon color="success" /> : <AccountCircleIcon />}
					{access 
						? <li><Button m={0} variant="text" onClick={logout} css={userBtn}>로그아웃</Button></li> 
						: <li><Link href="/login">로그인</Link></li>
					}
				</ul>
        <ul>
          <li><Link href="/basket">장바구니</Link></li>
          <li><Link href="/my-info">내정보</Link></li>
          <li><Link href="/white-test">WhiteTest</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default MainNavigation
