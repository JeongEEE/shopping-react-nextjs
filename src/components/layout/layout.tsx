import React, { Fragment, useState, useEffect } from 'react'
import MainNavigation from './main-navigation'
import { css, jsx } from '@emotion/react'
import { useRouter } from 'next/router'
import { auth } from 'src/firebaseConfig'
import { useRecoilState } from 'recoil';
import { wideState } from 'src/states/atoms';

type mainContentTypeProps = {
	wide: boolean;
};

const mainContent = (props: mainContentTypeProps) => css`
	max-width: ${props.wide ? '1300px' : '1100px'};
	min-width: ${props.wide ? '1300px' : '1100px'};
	/* max-width: 1100px;
	min-width: 1100px; */
	margin-left: auto;
	margin-right: auto;
	min-height: 100vh;
`

const Layout = (props: any) => {
	const router = useRouter()
	const [noNav, setNoNav] = useState(false);
	const [wide, setWide] = useState(false);
	const [localWideValue, setLocalWideValue] = useRecoilState(wideState);

	useEffect(() => {
		// firebase 로그인 상태 변경을 감지
		auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('로그인된 상태');
      } else {
        console.log('로그아웃된 상태');
      }
    });

		if(router.asPath.includes('/search')) {
			setWide(true);
			setLocalWideValue(true);
		}
		router.events.on('routeChangeComplete', (url) => {
			if(url.includes('/search')) {
				setWide(true);
				setLocalWideValue(true);
			} else {
				setWide(false);
				setLocalWideValue(false);
			}
    })
		return () => {
			router.events.off('routeChangeComplete', () => { })
		}
	}, [])

  return (
    <Fragment>
			<div css={mainContent({wide})}>
				<MainNavigation />
				<main>{props.children}</main>
			</div>
    </Fragment>
  )
}

export default Layout
