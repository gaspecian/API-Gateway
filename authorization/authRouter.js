module.exports = (router, expressApp, authRoutesMethods) => {
    // rota para registrar novo usuario
    router.post('/registerUser', authRoutesMethods.registerUser)

    // rota para criar bearer token
    router.post('/login', expressApp.oauth.grant())

    return router
}