const API_URL = import.meta.env.VITE_API_URL || '/api';
export async function searchProducts(query: string) {
	const res = await fetch(API_URL + `/search/product?q=${encodeURIComponent(query)}`);

	if (!res.ok) {
		throw new Error('API Error');
	}

	return res.json();
}
