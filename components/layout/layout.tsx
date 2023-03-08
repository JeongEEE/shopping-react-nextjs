import React, { Fragment } from 'react'
import MainNavigation from './main-navigation'
import { css, jsx } from '@emotion/react'

const mainContent = css`
	max-width: 1100px;
	min-width: 1100px;
	margin-left: auto;
	margin-right: auto;
`

const Layout = (props) => {

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
