import fetch from 'auth/FetchInterceptor'

const BlobService = {}

BlobService.config = function (data) {
	return fetch({
		url: '/config/all',
		method: 'post',
		data
	})
}

export default BlobService;