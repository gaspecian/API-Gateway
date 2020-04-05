let userDBHelper
let accessTokensDBHelper

//modulo que cria o token bearer
module.exports =  (injectedUserDBHelper, injectedAccessTokensDBHelper) => {
    userDBHelper = injectedUserDBHelper
    accessTokensDBHelper = injectedAccessTokensDBHelper
    return  {
        getClient: getClient,
        grantTypeAllowed: grantTypeAllowed,
        getUser: getUser,
        saveAccessToken: saveAccessToken,
        getAccessToken: getAccessToken
    }
}

// pega o client que esta tentando acessar com clientid e clientsecret
function getClient(clientID, clientSecret, callback){
    //create the the client out of the given params.
    //It has no functional role in grantTypes of type password
    const client = {
        clientID,
        clientSecret,
        grants: null,
        redirectUris: null
    }

    callback(false, client);
}

// verifica se o cliente esta permitido para o grantType
function grantTypeAllowed(clientID, grantType, callback) {

    callback(false, true);
}


// pega autenticacao por usuario e senha
function getUser(username, password, callback){

    // tenta pegar usuario por credenciais
    userDBHelper.getUserFromCrentials(username, password)
        .then(user => callback(false, user))
        .catch(error => callback(error, null))
}

// salva o access token disponibilizado para o cliente
function saveAccessToken(accessToken, clientID, expires, user, callback){
    //salva o access token junto com o userid
    accessTokensDBHelper.saveAccessToken(accessToken, user.userid)
        .then(() => callback(null), (error) => callback(error))
}

// verifica se o access token e valido
function getAccessToken(bearerToken, callback) {
    // tenta pegar o userid pelo access token
    accessTokensDBHelper.getUserIDFromBearerToken(bearerToken)
        .then(userID => createAccessTokenFrom(userID))
        .then(accessToken => {
            if (accessToken){
                callback(null, accessToken)
            } else {
                callback(null, false)
            }
            
        })
        .catch(error => callback(true , null))
}

// cria e retona um access token com data de expiracao
function createAccessTokenFrom(userID) {
    if (userID){
        return Promise.resolve({
            user: {
                id: userID,
            },
            expires: null
        })
    } else {
        return Promise.resolve({})
    }
}