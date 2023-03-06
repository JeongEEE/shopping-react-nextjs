/*
	Recoil 사용법 참조
	https://parkgang.github.io/blog/2021/05/06/using-recoil-in-nextjs/
*/

import { atom, selector } from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const sample = atom({
  key: 'sample',
  default: '',
	effects_UNSTABLE: [persistAtom],
});

export const sampleSelector = selector({
  key: 'sampleSelector',
	default: '',
	effects_UNSTABLE: [persistAtom],
  get: ({ get }) => get(sample) + '+plus',
  set: ({ set }, newValue) => set(sample, newValue),
});