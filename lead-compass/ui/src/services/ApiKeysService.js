import fetch from 'auth/FetchInterceptor'

const ApiKeysService = {}

ApiKeysService.keys = function (data) {
	return fetch({
		url: `/business/${data.business_id}`,
		method: 'get'
	})
}

ApiKeysService.addKey = function (data) {
	return fetch({
		url: '/business/add',
		method: 'post',
        data
	})
}

ApiKeysService.updateKey = function (data) {
	return fetch({
		url: `/business/${data.business_id}`,
		method: 'put',
		data
	})
}

// ApiKeysService.deleteKeys = function (data) {
// 	return fetch({
// 		url: '/user/all',
// 		method: 'delete'
// 	})
// }

export default ApiKeysService