import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { userDataState, wishState, basketState, purchaseState } from 'src/states/atoms';

const Purchase = () => {
	const [purchaseList, setPurchaseList] = useRecoilState<Array<Product>>(purchaseState);

	useEffect(() => {
		console.log('purchaseList', purchaseList);
	
		return () => {
			
		}
	}, [])
	

	return (
		<div>Purchase</div>
	)
}

export default Purchase