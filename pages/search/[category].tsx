import React, { useState, useEffect } from 'react';

export async function getServerSideProps({ query: { category } }) {
	// 새로고침할때 쿼리값이 날라가는걸 방지하기위해 서버사이드로 쿼리를 받아옴
  return {
    props: {
      category,
    },
  };
}

const SearchPage = ({ category }) => {
	return (
		<div>SearchPage</div>
	)
}

export default SearchPage