import fetch from 'auth/FetchInterceptor'

const CompanyService = {}

CompanyService.companies = function (data) {
	return fetch({
		url: '/company/filter',
		method: 'post',
		data: data
	})
}

export default CompanyService