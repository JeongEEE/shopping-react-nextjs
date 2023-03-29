import React from 'react'
import classes from './logo.module.css'
import Image from 'next/image'

function Logo() {
  return (
    <div className={classes.logo}>
      <Image src="/images/Logo.png" alt="J Shopping" width={200} height={80} priority />
    </div>
  )
}

export default Logo
