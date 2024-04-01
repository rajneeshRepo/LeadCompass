import fetch from 'auth/FetchInterceptor'

const CompanyService = {}

CompanyService.getContact = function (data) {
    return fetch({
        url: '/contact',
        method: 'get',
        params: data
    })
}

CompanyService.addContact = function (data) {
	return fetch({
		url: '/contact/add',
		method: 'post',
		data: data
	})
}

CompanyService.updateContact = function (data) {
    return fetch({
        url: `/contact/${data.id}`,
        method: 'put',
        data: data
    })
}

CompanyService.deleteContact = function (data) {
    return fetch({
        url: '/contact',
        method: 'delete',
        params: data
    })
}

export default CompanyService