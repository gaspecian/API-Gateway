let mySqlConnection

module.exports = injectedMySqlConnection => {
    mySqlConnection = injectedMySqlConnection
    return {
        saveAccessToken: saveAccessToken,
        getUserIDFromBearerToken: getUserIDFromBearerToken
    }
}

// salva o token com o userid
const saveAccessToken = (accessToken, userID) => {
    return new Promise((resolve, reject) => {
        const getUserQuery =  `INSERT INTO access_tokens (access_token, userid) VALUES ("${accessToken}", ${userID}) ON DUPLICATE KEY UPDATE access_token = "${accessToken}";`
        //executa a query para pegar o usuario
        mySqlConnection.query(getUserQuery, (dataResponseObject) => {
            //pass in the error which may be null and pass the results object which we get the user from if it is not null
            resolve()
            reject(dataResponseObject.error)
        })
    })
}

// pega o bearer token e retorna o usuario
const getUserIDFromBearerToken = (bearerToken) => {
    return new Promise((resolve) => {
        //cria query para pegar o userid
        const getUserIDQuery = `SELECT * FROM access_tokens WHERE access_token = '${bearerToken}';`
        //executa a query para pegar o userid
        mySqlConnection.query(getUserIDQuery, (dataResponseObject) => {
            const userID = dataResponseObject.results != null && dataResponseObject.results.length == 1 ? dataResponseObject.results[0].userid : null
            resolve(userID)
        })
    })
}