//libs required
const express = require('express')
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const oAuth2Server = require('node-oauth2-server')

// porta do servico
const port = 3000

// opções de certificado para ssl
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.crt')
};

// framework usando para rodar com nodejs
const expressApp = express()

// dbHelpers require
const mySqlConnection = require('./dbHelpers/mySqlWrapper')
const userDBHelper = require('./dbHelpers/userDBHelper')(mySqlConnection)
const bearerTokensDBHelper = require('./dbHelpers/accessTokensDBHelper')(mySqlConnection)

// authMethods require
const authRoutesMethods = require('./authorization/authRoutesMethods')(userDBHelper)
const oAuthModel = require('./authorization/accessTokenModel')(userDBHelper, bearerTokensDBHelper)
// seta objeto oauth no express para passar grant type e o model usado
expressApp.oauth = oAuth2Server({
    model: oAuthModel,
    grants: ['password'],
    debug: false
})
const authRouter = require('./authorization/authRouter')(express.Router(), expressApp, authRoutesMethods)

// seta o bodyParser para parsear os dados codificados
expressApp.use(logger('dev'));
expressApp.use(helmet());
expressApp.use(express.json());
expressApp.use(express.urlencoded({ extended: false }));
expressApp.use(cookieParser());

// routes
expressApp.use('/auth', authRouter)

const servicesProxy = require('./services/index')
const servicesProxyRouter = servicesProxy(express.Router(), expressApp)
expressApp.use('/api', servicesProxyRouter)

// Tratativa de endpoint nao encontrado
expressApp.use(function(req, res, next){
    res.status(404).send({ error: 'Endpoint '+ req.url + ' nao encontrado!' }); 
})

// Tratativa de erro para autorizacao 
expressApp.use(expressApp.oauth.errorHandler())


//init the server
var server = https.createServer(options, expressApp);
server.listen(port, () => console.log("Server started successfully, running on port 3000."))