import React, { useEffect, useState } from 'react'

import { useRecoilValue, useRecoilState } from 'recoil';
import { sample, sampleSelector } from '../../states/atoms';

const RecoilTestPage = () => {
	const test = useRecoilValue(sample);

	const [text, setText] = useRecoilState(sample);
	const [sample2, setSample2] = useRecoilState(sampleSelector);

	const onChange = (event) => {
		setText(event.target.value);
		console.log(test);
  };

	const onChange2 = (event) => {
		setSample2(event.target.value);
  };

	return (
		<div>
			<h1>Recoil Test</h1>
			<h2>{text}</h2>
			<input type="text" value={text} onChange={onChange} />
			<h2>{sample2}</h2>
			<input type="text" value={sample2} onChange={onChange2} />
    </div>
	)
}

export default RecoilTestPage