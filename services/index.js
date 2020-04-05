const httpProxy = require('express-http-proxy')
const urls = require('./URLs.js')

module.exports =  (router, expressApp) => {

    //criando proxy para cada serviço
    const cmdbServiceProxy = httpProxy(urls.CMDB_API);
    
    // serviço de users
    router.use('/cmdb', expressApp.oauth.authorise(), (req, res, next) => {
        cmdbServiceProxy(req, res, next);
    })
    
    return router
}