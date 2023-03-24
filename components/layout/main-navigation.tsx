import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import classes from './main-navigation.module.css'
import networkController from '../../pages/api/networkController'
import Logo from './logo'
import { useRouter } from "next/router";
import { useRecoilState } from 'recoil';
import { userDataState, wishState, basketState, categoriesState } from '../../states/atoms';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { auth } from '../../firebaseConfig'
import { signOut } from "firebase/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { css, jsx } from '@emotion/react'
import { db } from '../../firebaseConfig'
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { confirmAlert } from 'react-confirm-alert'; // https://github.com/GA-MO/react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css';
import MenuIcon from '@mui/icons-material/Menu';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'

const userBtn = css`
	color: black;
	font-weight: bold;
	&:hover {
		background-color: transparent;
	}
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
const categoryBtn = css`
	background-color: #415df9;
	height: 100%;
	width: 100px;
	border-radius: 0px;
	color: white;
	margin-right: 25px;
	&:hover {
		background-color: #415df9;
		color: white;
	}
`

function MainNavigation() {
	const router = useRouter();
	const [userData, setUserData] = useRecoilState(userDataState);
	const [wishData, setWishData] = useRecoilState(wishState);
	const [basketData, setBasketData] = useRecoilState(basketState);
	const [categories, setCategories] = useRecoilState(categoriesState);
	const [access, setAccess] = useState(false);
	const [email, setEmail] = useState('');
	const [basketCount, setBasketCount] = useState(0);
	const [mounted, setMounted] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const menuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
	const handleClose = () => {
    setAnchorEl(null);
  };
	const open2 = Boolean(anchorEl2);
  const menuClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };
	const handleClose2 = () => {
    setAnchorEl2(null);
  };
	const goCategorySearch = (category) => {
		setAnchorEl(null);
		router.push(`/search/${category}`);
	}
  const goWishList = () => {
    setAnchorEl(null);
		router.push('/basket/wish-list');
  };
	const goMyInfo = () => {
    setAnchorEl(null);
		if(!userData.email) {
			enqueueSnackbar('로그인 후 이용해주세요', { variant: 'info', autoHideDuration: 2000,
				anchorOrigin: { vertical: 'top', horizontal: 'center' }})
			return;
		}
		router.push('/my-info');
  };

	const fetchCategories = async () => {
		try {
			const data = await networkController.getAllCategories();
			console.log('categories', data);
			setCategories(data);
		} catch(err) {
			console.log(err);
		}
	}

	const fetchWishData = () => {
		try {
			getDocs(query(collection(db, userData.email, 
				'userData/wishList'), orderBy("timeMillisecond", "desc")))
			.then((snapshot) => {
				const wishList = snapshot.docs.map(v => {
					const item = v.data()
					return { id: v.id, ...item }
				});
				setWishData(wishList)
				console.log('wishList', wishList);
			}).catch(err => { })
		} catch(err) {
			console.log(err);
		}
	}

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
				console.log('basket', basket);
				
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
			fetchWishData();
		} else setEmail('');
		return () => {
			
		}
	}, [userData])

	useEffect(() => {
		setBasketCount(basketData.length)
		return () => {
			
		}
	}, [basketData])

	useEffect(() => {
		// Next Link태그는 새로고침시 pre랜더된 html과 일치하지않는 hydration 오류가 발생하기때문에
		// 마운트된 후에 조건랜더링을 해야함
		setMounted(true);
		fetchCategories();
	}, [])
	
	const logoutPopup = () => {
		confirmAlert({ title: '로그아웃', message: '로그아웃 하시겠습니까?',
      buttons: [
        {
          label: '예',
          onClick: () => {
						logout();
					}
        },
        {
          label: '아니오',
          onClick: () => { }
        }
      ]
    });
	}
	
	const logout = () => {
		signOut(auth).then(() => {
			setAccess(false)
			setUserData({});
			setBasketData([]);
			router.replace('/');
		}).catch((error) => {
			console.log(error);
		});
	}

  return (
    <header className={classes.header}>
			<Grid container direction="row" justifyContent="left" alignItems="center"
				css={css`width:300px;height:100%;`}>
				<Button css={categoryBtn}
					aria-controls={open2 ? 'basic-menu' : undefined}
					aria-haspopup="true" aria-expanded={open2 ? 'true' : undefined}
					onClick={menuClick2} onMouseOver={menuClick2}>
					<Grid container justifyContent="center" alignItems="center">
						<MenuIcon css={css`color:white;`} sx={{fontSize: 40}} />
						카테고리
					</Grid>
				</Button>
				<Menu anchorEl={anchorEl2} open={open2} onClose={handleClose2}
					MenuListProps={{'aria-labelledby': 'basic-button', onMouseLeave: handleClose2}} 
					disableScrollLock={true}>
					{categories.map(item => (
						<MenuItem key={item} onClick={() => goCategorySearch(item)}>{item}</MenuItem>
					))}
				</Menu>
				<Link href="/">
					<Logo />
				</Link>
			</Grid>
      <nav>
				<ul>
					<div>{email}</div>
					{access && mounted ? <AccountCircleIcon color="info" /> : <AccountCircleIcon />}
					{access && mounted
						? <Button variant="text" onClick={logoutPopup} css={userBtn}>로그아웃</Button> 
						: <li><Link href="/login" css={css`line-height: 22.5px;`}>로그인</Link></li>
					}
				</ul>
        <ul>
					{userData.email == 'test@test.com' && mounted
						?	<li><Link href="/white-test">WhiteTest</Link></li>
						: <li></li>
					}
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
							padding-left: 5px;
						`}>{basketCount}</div>}
					</li>
          <li css={css`padding-top:3px !important;`}>
						<Button variant="text" css={css`${userBtn};padding:0;font-size:1rem;`} 
							aria-controls={open ? 'basic-menu' : undefined}
							aria-haspopup="true" aria-expanded={open ? 'true' : undefined}
							onClick={menuClick} onMouseOver={menuClick}>
							마이페이지
						</Button>
						<Menu anchorEl={anchorEl} open={open} onClose={handleClose}
							MenuListProps={{'aria-labelledby': 'basic-button', onMouseLeave: handleClose}} 
							disableScrollLock={true}>
							<MenuItem onClick={goWishList}>찜 목록</MenuItem>
							<MenuItem onClick={goMyInfo}>내정보</MenuItem>
						</Menu>
					</li>
        </ul>
      </nav>
			<SnackbarProvider preventDuplicate />
    </header>
  )
}

export default MainNavigation
