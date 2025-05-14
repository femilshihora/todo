const mysql = require('mysql2/promise')

const mysqlPool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : 'Admin@123',
    database : 'temp1'
})

module.exports = mysqlPool