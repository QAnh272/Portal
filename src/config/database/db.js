const mysql2 = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
async function createConnection() {
    try {
        const connection = await mysql2.createConnection({
            host: process.env.HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });
        console.log('Database connected');
        return connection;
    } catch (error) {
        console.log('Database connection failed');
        throw error;
    }
};


module.exports = {createConnection};