import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react'

const scrollContainer = css`
	position: fixed;
  right: 5%;
  bottom: 5%;
  z-index: 1;
`
const top = css`
	font-weight: bold;
  font-size: 15px;
  padding :15px 10px;
  background-color: #000;
  color:#fff;
  border: 1px solid rgb(210, 204, 193);
  border-radius: 50%;
  outline: none;
  cursor: pointer;
	&:hover {
		color :#415df9;
	}
`

const TopButton = () => {
	const [showButton, setShowButton] = useState(false);

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > 500) {
        setShowButton(true)
      } else {
        setShowButton(false)
      }
    }
    window.addEventListener("scroll", handleShowButton)
    return () => {
      window.removeEventListener("scroll", handleShowButton)
    }
  }, [])

  return showButton && (
    <div css={scrollContainer}>
      <button css={top} onClick={scrollToTop} type="button" > Top</button>
    </div>
  )
}

export default TopButton