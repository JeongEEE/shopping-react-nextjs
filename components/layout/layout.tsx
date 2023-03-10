import React, { Fragment, useState, useEffect } from 'react'
import MainNavigation from './main-navigation'
import { css, jsx } from '@emotion/react'
import { useRouter } from 'next/router'
import { auth } from '../../firebaseConfig'
import { useRecoilState } from 'recoil';
import { loginStatus } from '../../states/atoms';

const mainContent = css`
	max-width: 1100px;
	min-width: 1100px;
	margin-left: auto;
	margin-right: auto;
`

const Layout = (props) => {
	const router = useRouter()
	const [noNav, setNoNav] = useState(false);
	const [status, setStatus] = useRecoilState(loginStatus);

	useEffect(() => {
		// firebase 로그인 상태 변경을 감지
		auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('로그인된 상태');
				setStatus(true)
      } else {
        console.log('로그아웃된 상태');
				setStatus(false)
      }
    });

		return () => {
			
		}
	}, [])

  return (
    <Fragment>
			<div css={mainContent}>
				<MainNavigation />
				<main>{props.children}</main>
			</div>
    </Fragment>
  )
}

export default Layout
