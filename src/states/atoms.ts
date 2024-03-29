/*
	Recoil 사용법 참조
	https://parkgang.github.io/blog/2021/05/06/using-recoil-in-nextjs/
*/

import { atom, selector } from "recoil";
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const userDataState = atom({
  key: 'userDataState',
	default: {},
	effects_UNSTABLE: [persistAtom],
});

export const wishState = atom({
  key: 'wishState',
	default: [],
	effects_UNSTABLE: [persistAtom],
});

export const basketState = atom({
  key: 'basketState',
	default: [],
	effects_UNSTABLE: [persistAtom],
});

export const categoriesState = atom({
  key: 'categoriesState',
	default: [],
	effects_UNSTABLE: [persistAtom],
});

export const searchTextState = atom({
  key: 'searchTextState',
	default: '',
	effects_UNSTABLE: [persistAtom],
});

export const purchaseState = atom({
  key: 'purchaseState',
	default: [],
	effects_UNSTABLE: [persistAtom],
});

export const wideState = atom({
  key: 'wideState',
	default: false,
	effects_UNSTABLE: [persistAtom],
});

export const couponState = atom({
  key: 'couponState',
	default: [],
	effects_UNSTABLE: [persistAtom],
});

// ########################################## sample
export const sample = atom({
  key: 'sample',
  default: '',
});

export const sampleSelector = selector({
  key: 'sampleSelector',
	default: '',
  get: ({ get }) => get(sample) + '+plus',
  set: ({ set }, newValue) => set(sample, newValue),
});