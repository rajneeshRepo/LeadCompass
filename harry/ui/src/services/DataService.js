import fetch from 'auth/FetchInterceptor'

const DataService = {}

DataService.getStateCounty = function (data) {
    // console.log(data)

   return fetch({
        url: '/state/county',
        method: 'get',
        // params: data
    })
 
}

DataService.getFilterOrganization= function (data) {
    // console.log(data)

   return fetch({
        url: '/filter/organization',
        method: 'get',
        params: data
    })
 
}

export default DataService