import fetch from 'auth/FetchInterceptor'

const ApiService = {}

ApiService.harryBackendApi = async function(url,method,params,data) {
	return  await fetch({
		url: url,
		method: method,
		params: params,
		data: data

	})
}

export default ApiService;