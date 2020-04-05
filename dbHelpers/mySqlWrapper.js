module.exports = {
    query: query
}

// pega objeto mysql
const mySql = require('mysql')

// objeto que fica com conexao com banco
let connection = null

// cria conexao com banco
function initConnection() {
    //cria conexao global com banco
    connection = mySql.createConnection({
        host: 'localhost',
        user: 'auth_dbuser',
        password: 'PGfeaCjHPdwejwaUhfKW',
        database: 'AUTH'
    })
}

//executa query sql
function query(queryString, callback){

//inicia conexao com banco
initConnection()

//conecta no banco
connection.connect()

//executa query e manda resultados no callback
connection.query(queryString, function(error, results, fields){
    // console.log('mySql: query: error is: ', error, ' and results are: ', results);
    //desconecta do banco
    connection.end();

    //manda resposta de resultado
    callback(createDataResponseObject(error, results))
})
}

// cria resposta de resultados do banco
function createDataResponseObject(error, results) {

    return {
    error: error,
    results: results === undefined ? null : results === null ? null : results
    }
}