export default class ApiHandler {	
	static apiServerAddress = process.env.REACT_APP_API_SERVER
	static orgName = process.env.REACT_APP_ORG_NAME

	// should private
	static checker() {
		if(!(ApiHandler.apiServerAddress) || !(ApiHandler.orgName))
		throw new Error('.env is empty');
	}

	static get (func, channel, id = undefined, queries = undefined) {
		ApiHandler.checker()

		let url = "http://" + ApiHandler.apiServerAddress + "/" + func + "/" + channel + "/" + ApiHandler.orgName
		url += (id ? "/" + id : '')

		if (queries) {
			url += '?'

			queries.map((q) => url += q.key + '=' + q.value)
		}

		console.log(url)

		return fetch(url)
	}

	static put (func, channel, id, data) {
		ApiHandler.checker()
		const url = "http://" + ApiHandler.apiServerAddress + "/" + func + "/" + channel + "/" + ApiHandler.orgName +  "/" + id ;

		const requestOptions = {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		};

		return fetch(url, requestOptions)
			// .then(response => response.json())
			// .then(data => this.setState({ postId: data.id }));
	}

	static post (func, channel, data) {
		ApiHandler.checker()
		const url = "http://" + ApiHandler.apiServerAddress + "/" + func + "/" + channel + "/" + ApiHandler.orgName

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		};

		return fetch(url, requestOptions)
			// .then(response => response.json())
			// .then(data => this.setState({ postId: data.id }));
	}


	static uploadImage (formData) {
		ApiHandler.checker()
		const url = "http://" + ApiHandler.apiServerAddress + "/image/upload" ;

		const requestOptions = {
			method: 'POST',
			// headers: { 'Content-Type': 'multipart/form-data' },
			body: formData
		};

		return fetch(url, requestOptions)
	}





	static readProduct (id) {
		return ApiHandler.get('readProduct', 'channel0', id)
	}

	static readProducts () {
		return ApiHandler.get('readProducts', 'channel0')
	}

	static createProduct (product) {
		return ApiHandler.post('createProduct', 'channel0', product)
	}

	static updateProduct (product) {
		return ApiHandler.put('updateProduct', 'channel0', product.id, product)
	}



	static readBatch (id, date) {
		return ApiHandler.get('readBatch', 'channel0', id, date)
	}

	static readBatches (date) {
		return ApiHandler.get('readBatches', 'channel0', null, date)
	}

	static createBatch (batch) {
		return ApiHandler.post('createBatch', 'channel0', batch)
	}

	static updateBatch (batch) {
		return ApiHandler.put('updateBatch', 'channel0', batch.id, batch)
	}




	// SLAUGHTERER AREA ->

	static readSlaughterer (id) {
		return ApiHandler.get('readSlaughterer', 'channel0', id)
	}

	static readSlaughterers () {
		return ApiHandler.get('readSlaughterers', 'channel0')
	}

	static createSlaughterer (slaughterer) {
		return ApiHandler.post('createSlaughterer', 'channel0', slaughterer)
	}

	static updateSlaughterer (slaughterer) {
		return ApiHandler.put('updateSlaughterer', 'channel0', slaughterer.id, slaughterer)
	}
}