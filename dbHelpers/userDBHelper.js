let mySqlConnection;

module.exports = injectedMySqlConnection => {

  mySqlConnection = injectedMySqlConnection

  return {

   registerUserInDB: registerUserInDB,
   getUserFromCrentials: getUserFromCrentials,
   doesUserExist: doesUserExist
 }
}

const registerUserInDB =  (username, password) => {
    return new Promise(() => {
        //create query using the data in the req.body to register the user in the db
        const registerUserQuery = `INSERT INTO users (username, user_password) VALUES ('${username}', SHA('${password}'))`

        //execute the query to register the user
        mySqlConnection.query(registerUserQuery, (dataResponseObject) => {})
    })
}

const getUserFromCrentials = (username, password) => {
    return new Promise((resolve) => {
        //create query using the data in the req.body to register the user in the db
        const getUserQuery = `SELECT * FROM users WHERE username = '${username}' AND user_password = SHA('${password}')`

        //execute the query to get the user
        mySqlConnection.query(getUserQuery, (dataResponseObject) => {
            //pass in the error which may be null and pass the results object which we get the user from if it is not null
            if (dataResponseObject.results.length  === 1){
                resolve(dataResponseObject.results[0])
            } else {
                resolve(false)
            }
        })
    })
}

// checa se usuario
const doesUserExist = username => {
    return new Promise((resolve, reject) => {
        //create query to check if the user already exists
        const doesUserExistQuery = `SELECT * FROM users WHERE username = '${username}'`

        //execute the query to check if the user exists
        mySqlConnection.query(doesUserExistQuery, (dataResponseObject) => {
            //calculate if user exists or assign null if results is null
            const doesUserExist = dataResponseObject.results !== null ? dataResponseObject.results.length > 0 ? true : false : null

            //check if there are any users with this username and return the appropriate value
            resolve(doesUserExist)
            reject(dataResponseObject.error) 
        })
    })
}
