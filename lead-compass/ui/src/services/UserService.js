import fetch from 'auth/FetchInterceptor'

const UserService = {}

UserService.users = function (data) {
	return fetch({
		url: '/user/all',
		method: 'get'
	})
}

UserService.user = function (data) {
	return fetch({
		url: `/user/${data.id}`,
		method: 'get',
	})
}

UserService.updateUser = function (data) {
    return fetch({
        url: `/user/${data.id}`,
        method: 'put',
        data: data
    })
}

export default UserService