import Axios, { AxiosRequestConfig } from "axios";

export default {
	async getAllProducts(): Promise<Array<object>> {
		const url = 'https://fakestoreapi.com/products';
		const response = await Axios({ url, method: 'GET' });
    return Promise.resolve(response.data);
	},
}