/*
	Recoil 사용법 참조
	https://parkgang.github.io/blog/2021/05/06/using-recoil-in-nextjs/
*/

import { atom, selector } from "recoil";

export const sample = atom({
  key: "a",
  default: "abc",
});

export const sampleSelector = selector({
  key: "sampleSelector",
	default: '',
  get: ({ get }) => get(sample) + '+plus',
  set: ({ set }, newValue) => set(sample, newValue),
});