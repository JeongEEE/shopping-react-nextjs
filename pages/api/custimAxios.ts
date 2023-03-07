import axios, { AxiosInstance } from 'axios';

export const customAxios: AxiosInstance = axios.create({
  baseURL: '', // 기본 서버 주소 입력
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
});