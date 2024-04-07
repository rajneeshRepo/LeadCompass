import fetch from 'auth/FetchInterceptor'

const ContactService = {}

ContactService.createContact = function (data) {
    // console.log(data)

   return fetch({
        url: '/contact',
        method: 'post',
        data: data
    })
 
}

ContactService.getContactById = function (data) {
    // console.log(data)

   return fetch({
        url: '/contact',
        method: 'get',
        params: data
    })
 
}



ContactService.getContacts = function (data) {
    // console.log(data)

   return fetch({
        url: '/people/all',
        method: 'get',
        params: data
    })
 
}

ContactService.updateContactById = function (data) {

   return fetch({
        url: '/contact',
        method: 'put',
        data: data
    })
 
}

ContactService.deleteContactById = function (data) {

    return fetch({
         url: '/contact',
         method: 'delete',
         params: data
     })
  
 }

export default ContactService