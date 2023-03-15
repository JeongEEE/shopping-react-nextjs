import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import classes from './main-navigation.module.css'
import Logo from './logo'
import { useRecoilState } from 'recoil';
import { userDataState, basketState } from '../../states/atoms';
import Button from '@mui/material/Button';
import { auth } from '../../firebaseConfig'
import { signOut } from "firebase/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { css, jsx } from '@emotion/react'
import { db } from '../../firebaseConfig'
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const userBtn = css`
	color: black;
	font-weight: bold;
`
const basketList = css`
	position: relative;
`
const basketCountCss = css`
	position: absolute;
	top: 0;
	right: 0px;
	border-radius: 20px;
	background-color: red;
	color: black;
	padding-top: 4px;
	font-size: 0.8rem;
`

function MainNavigation() {
	const [userData, setUserData] = useRecoilState(userDataState);
	const [basketData, setBasketData] = useRecoilState(basketState);
	const [access, setAccess] = useState(false);
	const [email, setEmail] = useState('');
	const [basketCount, setBasketCount] = useState(0);

	const fetchBasketData = () => {
		try {
			getDocs(query(collection(db, userData.email, 
				'userData/basket'), orderBy("timeMillisecond", "desc")))
			.then((snapshot) => {
				const basket = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				setBasketData(basket)
				setBasketCount(basket.length)
				console.log(basket);
				
			}).catch(err => { })
		} catch(err) {
			console.log(err);
		}
	}
	
	useEffect(() => {
		console.log('UserData-' ,userData);
		if(userData.email) {
			setEmail(userData.email);
			setAccess(true)
			fetchBasketData();
		} else setEmail('');
		return () => {
			
		}
	}, [userData])

	useEffect(() => {
		setBasketCount(basketData.length)
		return () => {
			
		}
	}, [basketData])
	
	
	
	const logout = () => {
		signOut(auth).then(() => {
			setAccess(false)
			setUserData({});
			setBasketData([]);
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
						? <Button variant="text" onClick={logout} css={userBtn}>로그아웃</Button> 
						: <li><Link href="/login">로그인</Link></li>
					}
				</ul>
        <ul>
          <li css={basketList}>
						<Link href="/basket">장바구니</Link>
						{basketCount >= 10 
						? <div css={css`
							${basketCountCss};
							width: 20px;
							padding-left: 4px;
						`}>{basketCount}</div> 
						: basketCount == 0 ? null 
							: <div css={css`
							${basketCountCss};
							width: 17px;
							padding-left: 4px;
						`}>{basketCount}</div>}
					</li>
          <li><Link href="/my-info">내정보</Link></li>
          <li><Link href="/white-test">WhiteTest</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default MainNavigation
