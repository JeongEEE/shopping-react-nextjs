import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import classes from './main-navigation.module.css'
import Logo from './logo'
import { useRecoilState } from 'recoil';
import { loginStatus } from '../../states/atoms';
import Button from '@mui/material/Button';
import { auth } from '../../firebaseConfig'
import { signOut } from "firebase/auth";

function MainNavigation() {
	const [status, setStatus] = useRecoilState(loginStatus);
	const [access, setAccess] = useState(false);

  useEffect(() => {
		console.log('login-' ,status);
		setAccess(status)
		return () => {
			
		}
	}, [status])
	
	const logout = () => {
		signOut(auth).then(() => {
			setStatus(false)
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
					{access 
						? <li><Button variant="text" onClick={logout}>로그아웃</Button></li> 
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
