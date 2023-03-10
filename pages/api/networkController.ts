import Axios, { AxiosRequestConfig } from "axios";
import { getAuth, createUserWithEmailAndPassword, 
	signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../firebaseConfig'

export default {
	async getAllProducts(): Promise<Array<object>> {
		const url = 'https://fakestoreapi.com/products';
		const response = await Axios({ url, method: 'GET' });
    return Promise.resolve(response.data);
	},
	async getProductData(id): Promise<Array<object>> {
		const url = `https://fakestoreapi.com/products/${id}`;
		const response = await Axios({ url, method: 'GET' });
    return Promise.resolve(response.data);
	},

	async firebaseSignUp(email, password): Promise<object> {
		// 회원가입
		try {
			const userCredential = await createUserWithEmailAndPassword(auth, email, password)
			return Promise.resolve(userCredential.user);
		} catch (err) {
			return Promise.reject(err);
		}
	},
	async firebaseSignIn(email, password): Promise<object> {
		// 로그인
		try {
			const userCredential = await signInWithEmailAndPassword(auth, email, password)
			return Promise.resolve(userCredential.user);
		} catch (err) {
			return Promise.reject(err);
		}
	},
}