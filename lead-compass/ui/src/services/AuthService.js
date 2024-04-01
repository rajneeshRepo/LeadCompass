import fetch from 'auth/FetchInterceptor'
import { AUTH_TOKEN } from 'constants/AuthConstant';
import { jwtDecode } from 'jwt-decode'

const AuthService = {}

AuthService.login = function (data) {
	return fetch({
		url: '/auth/login',
		method: 'post',
		data: data
	})
}

AuthService.register = function (data) {
	return fetch({
		url: '/auth/register',
		method: 'post',
		data: data
	})
}

AuthService.logout = function () {
	return fetch({
		url: '/auth/logout',
		method: 'post'
	})
}

AuthService.loginInOAuth = function () {
	return fetch({
		url: '/auth/loginInOAuth',
		method: 'post'
	})
}

// AuthService.currentUserId = function () {
// 	const jwt = localStorage.getItem(AUTH_TOKEN)
// 	return jwtDecode(jwt)['user_id'];
// }

AuthService.userDetails = function () {
	return fetch({
		url: `/auth/me`,
		method: 'get',
	})
}

export default AuthService;