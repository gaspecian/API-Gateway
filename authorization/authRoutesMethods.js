// objeto que cuida de operacoes do usuario no banco de dados
let userDBHelper

// modulo que registra usuarios
module.exports = injectedUserDBHelper => {
    //chama o objeto userDBHelper
    userDBHelper = injectedUserDBHelper
    return {
        registerUser: registerUser
    }
}

//cuida das requisicoes de registro de usuarios verificando se e um usuario novo ou nao
function registerUser(req, res){

    //get the username and password:
    const username = req.body.username
    const password = req.body.password
    //validate the request
    if (!isString(username) || !isString(password)){

        return sendResponse(res, "Invalid Credentials", true)
    }

    //query db to see if the user exists already
    userDBHelper.doesUserExist(username)
        .then(doesUserExist => {
            //check if the user doesn't exist
            if (doesUserExist === false) {

                /* now we know that the user doesn't exist we attempt to store them in
                the database. The userDBHelper.registerUserInDB() method returns a
                promise which will only resolve if we  have successfully stored the user */
                userDBHelper.registerUserInDB(username, password)
                //create message for the api response
                return sendResponse(res, "User created", null)
            }
            //here the user already exists
            else {
                //throw an error to break out of the promise chain
                return sendResponse(res, "Failed to register user" , "User already exists")
            }
        }, error => {
            return sendResponse(res, "Failed to register user" , error)
        }
    )
}

// manda resposta da requisicao
function sendResponse(res, message, error) {
    res.status(error != null ? 400 : 200 )
        .json({
            'message': message,
            'error': error,
        })
}

// verifica se o parametro e uma string
function isString(parameter) {
    return parameter != '' && (typeof parameter === "string" || parameter instanceof String) && parameter != null ? true : false
}