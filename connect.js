const util = require('util');
const mysql = require('mysql');
require('dotenv').config();

const dbConf = {
	port: process.env.MYSQL_PORT || 3306,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

function getDBConnection(){
	const connection = mysql.createConnection(dbConf);
	return {
		beginTransaction() {
			return util.promisify(connection.beginTransaction).call(connection);
		},
		commit() {
			return util.promisify(connection.commit).call(connection);
		},
		rollback() {
			return util.promisify(connection.rollback).call(connection);
		},
		query(sql, args) {
			return util.promisify(connection.query).call(connection, sql, args); 
		},
		close() {
			return util.promisify(connection.end).call(connection);
		}
	};
}

module.exports = getDBConnection;
