import fetch from 'auth/FetchInterceptor'

const UploadService = {}

UploadService.companies = function (data) {
	return fetch({
		url: '/blob',
		method: 'post',
		data: data
	})
}

UploadService.leads = function (data) {
	return fetch({
		url: '/leads/add',
		method: 'post',
		data: data
	})
}

export default UploadService