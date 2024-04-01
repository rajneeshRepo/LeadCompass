import fetch from 'auth/FetchInterceptor'

const LeadService = {}
LeadService.leads = function (data) {
	return fetch({
		url: '/leads/filter',
		method: 'post',
		data: data
	})
}

LeadService.lead = function ({id}) {
	return fetch({
		url: `/leads/${id}`,
		method: 'get'
	})
}

export default LeadService