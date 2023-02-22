/*
	Recoil 사용법 참조
	https://parkgang.github.io/blog/2021/05/06/using-recoil-in-nextjs/
*/

import { atom } from "recoil";

export const sample = atom({
  key: "sample",
  default: "",
});