import fetch from 'auth/FetchInterceptor'

const OrganizationService = {}

OrganizationService.getOrganizations = function (data) {
    // console.log(data)

   return fetch({
        url: '/organization/all',
        method: 'get',
        // params: data
    })
 
}

OrganizationService.getOrganizationById = function (data) {
    // console.log(data)

   return fetch({
        url: '/organization',
        method: 'get',
        params: data
    })
 
}


OrganizationService.searchOrganizations = function (data) {

   return fetch({
        url: '/search/all',
        method: 'get',
        params: data
    })
 
}

export default OrganizationService