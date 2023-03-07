import React from 'react'
import Link from 'next/link'
import classes from './main-navigation.module.css'
import Logo from './logo'

function MainNavigation() {
  return (
    <header className={classes.header}>
      <Link href="/">
        <Logo />
      </Link>
      <nav>
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
