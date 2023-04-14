import React, { useState, useEffect } from 'react';
import { css } from '@emotion/react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { whiteBtn } from 'src/styles/global';

const popWrap = css`
	position: absolute;
	top: 100px;
	left: 100px;
	z-index: 10;
	border-radius: 7px;
	/* box-shadow: 1px 1px 1px 1px gray; */
	border: 1px solid black;
	background-color: white;
	width: 250px;
`

const HomePopModal = ({ setShowPop }) => {
	const closePop = () => {
    setShowPop(false);
  };
  const closeTodayPop = () => {
    let expires = new Date();
    expires = expires.setHours(expires.getHours() + 24);
    localStorage.setItem("homeVisited", expires);
    // 현재 시간의 24시간 뒤의 시간을 homeVisited에 저장
    setShowPop(false);
  };

  return (
    <Grid p={2} container direction="column" alignItems="center" css={popWrap}>
			<Typography variant="h5" pb={1}>💡 안내사항</Typography>
			<Typography variant="h7" pb={1}>안녕하세요</Typography>
			<Typography variant="h7">J 쇼핑몰은 개발자가 학습을 목표로 만든 웹사이트 입니다.</Typography>
			<Typography variant="h7" pb={2}>영리 목적은 없으며 상품은 실제로 결제 및 배송되지 않습니다. 참고 바랍니다.</Typography>
      <Grid container direction="row" pb={1} justifyContent="center" alignItems="center">
        <Button variant="contained" onClick={closeTodayPop}
					css={css`${whiteBtn};border:1px solid gray;`}>오늘 하루 열지 않기</Button>
        <Button variant="contained" onClick={closePop} 
					css={css`${whiteBtn};border:1px solid gray;margin-left:5px;`}>닫기</Button>
      </Grid>
    </Grid>
  );
}

export default HomePopModal