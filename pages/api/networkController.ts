import Axios, { AxiosRequestConfig } from "axios";
import Product from '../../types/product'

export default {
	async getAllProducts(): Promise<Array<Product>> {
		const url = 'https://fakestoreapi.com/products';
		const response = await Axios({ url, method: 'GET' });
    return Promise.resolve(response.data);
	},
	async getProductData(id): Promise<Array<Product>> {
		const url = `https://fakestoreapi.com/products/${id}`;
		const response = await Axios({ url, method: 'GET' });
    return Promise.resolve(response.data);
	},
	async getAllCategories(): Promise<Array<string>> {
		const url = `https://fakestoreapi.com/products/categories`;
		const response = await Axios({ url, method: 'GET' });
    return Promise.resolve(response.data);
	},
	async getProductsSpecificCategory(category: string): Promise<Array<Product>> {
		const url = `https://fakestoreapi.com/products/category/${category}`;
		const response = await Axios({ url, method: 'GET' });
    return Promise.resolve(response.data);
	},
}