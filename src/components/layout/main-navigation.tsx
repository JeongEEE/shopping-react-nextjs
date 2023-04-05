import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import classes from './main-navigation.module.css'
import Logo from './logo'
import { useRouter } from "next/router";
import { useRecoilState } from 'recoil';
import { userDataState, wishState, basketState, categoriesState,
	searchTextState, wideState } from 'src/states/atoms';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { auth } from 'src/firebaseConfig'
import { signOut } from "firebase/auth";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { css, jsx } from '@emotion/react'
import { db } from 'src/firebaseConfig'
import { collection, getDocs, getDoc, doc, query, orderBy } from "firebase/firestore";
import { confirmAlert } from 'react-confirm-alert'; // https://github.com/GA-MO/react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css';
import MenuIcon from '@mui/icons-material/Menu';
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { Product } from 'src/types/product'
import { User } from 'src/types/user'
import useMediaQuery from '@mui/material/useMediaQuery';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

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
	&:hover {
		background-color: #415df9;
		color: white;
	}
`
const searchBtn = css`
	margin: 0;
	padding: 0;
	min-width: 35px;
	background-color: #415df9;
	border-radius: 0;
	&:hover {
		background-color: #7e90f7;
	}
`

const headerStyle = (props) => css`
	width: ${props.localWideValue ? '1000px' : '800px'};
	height: 100%;
`

function MainNavigation() {
	const router = useRouter();
	const [userData, setUserData] = useRecoilState<User>(userDataState);
	const [wishData, setWishData] = useRecoilState<Array<Product>>(wishState);
	const [basketData, setBasketData] = useRecoilState<Array<Product>>(basketState);
	const [categories, setCategories] = useRecoilState<Array<string>>(categoriesState);
	const [localSearchText, setLocalSearchText] = useRecoilState<string>(searchTextState);
	const [localWideValue, setLocalWideValue] = useRecoilState(wideState);
	const [access, setAccess] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [basketCount, setBasketCount] = useState<number>(0);
	const [mounted, setMounted] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const isMobile = useMediaQuery("(max-width: 600px)");
	const [searchText, setSearchText] = useState('');

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
	const goCategorySearch = (category: string) => {
		setAnchorEl2(null);
		router.push(`/search/category/${category}`);
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
	const goAdmin = () => {
		setAnchorEl(null);
		router.push('/admin');
	}
	const searchTextChange = (e) => {
		setSearchText(e.target.value);
	}

	const fetchCategories = async () => {
		try {
			getDoc(doc(db, 'category/categoryList'))
			.then((snapshot) => {
				const data = snapshot.data().data;
				console.log('categories', data);
				setCategories(data);
			}).catch((error) => { });
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
			if(router.asPath == '/') location.reload();
			else router.replace('/');
		}).catch((error) => {
			console.log(error);
		});
	}

	const requestSearch = () => {
		if(searchText === '') return;
		const blank_pattern = /^\s+|\s+$/g;
		if(searchText.replace(blank_pattern, '' ) == "" ) return;
		setLocalSearchText(searchText);
		setSearchText('');
		router.push(`/search/text/${searchText}`);
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

  return (
    <header className={classes.header}>
			<Grid container direction="row" justifyContent="left" alignItems="center"
				css={headerStyle({localWideValue})}>
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
					MenuListProps={{'aria-labelledby': 'basic-button'}} 
					disableScrollLock={true} onMouseLeave={handleClose2}>
					{categories.map(item => (
						<MenuItem key={item} onClick={() => goCategorySearch(item)}>{item}</MenuItem>
					))}
				</Menu>
				<Link href="/">
					<Logo />
				</Link>
				<Grid container direction="row" ml={localWideValue ? 20 : 8} 
					css={css`width:400px;`}>
					<TextField id="outlined-size-small" onChange={searchTextChange}
						css={css`border-radius: 0;`} placeholder="찾고싶은 상품을 검색해보세요"
						size="small" InputProps={{ sx: { width: '350px', height: '2.5rem',
							borderRadius: 0, border: '2px solid #415df9' } }} 
						value={searchText}
						onKeyPress= {(e) => {
							if (e.key === 'Enter') requestSearch();
						}} />
					<Button variant="text" css={searchBtn} onClick={requestSearch}>
						<SearchIcon fontSize="large" sx={{ color: 'white' }} />
					</Button> 
				</Grid>
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
							MenuListProps={{'aria-labelledby': 'basic-button'}} 
							disableScrollLock={true} onMouseLeave={handleClose}>
							<MenuItem>주문목록</MenuItem>
							<MenuItem onClick={goWishList}>찜 목록</MenuItem>
							<MenuItem onClick={goMyInfo}>내정보</MenuItem>
							{userData.email == 'test@test.com' && mounted
								? <MenuItem onClick={goAdmin}>관리자메뉴</MenuItem> : null }
						</Menu>
					</li>
        </ul>
      </nav>
			<SnackbarProvider preventDuplicate />
    </header>
  )
}

export default MainNavigation
