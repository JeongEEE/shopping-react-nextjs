import React, { Fragment, useState, useEffect } from 'react'
import MainNavigation from './main-navigation'
import { css, jsx } from '@emotion/react'
import { useRouter } from 'next/router'

const mainContent = css`
	max-width: 1100px;
	min-width: 1100px;
	margin-left: auto;
	margin-right: auto;
`

const Layout = (props) => {
	const router = useRouter()
	const [noNav, setNoNav] = useState(false);

	// useEffect(() => {
	// 	if(router.asPath == '/login' || router.asPath == '/login/signUp') setNoNav(true)
	// 	router.events.on('routeChangeComplete',  (url) => {
	// 		if(url === '/login' || url === '/login/signUp') setNoNav(true)
	// 		else setNoNav(false)
  //   })
	// 	return () => {
	// 		router.events.off('routeChangeComplete', () => { })
	// 	}
	// }, [])

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
