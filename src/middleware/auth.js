const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createConnection, addUser} = require('../config/database/db');
const dotenv = require('dotenv');

dotenv.config();

const loginUser = async (username, password) => {
    const connection = await createConnection();
    const rows = await connection.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );
    if (rows.length === 0) {
        throw new Error('User not found');
    }
    const user = rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        throw new Error('Invalid password');
    }
    const token = jwt.sign({id: user.id, username: user.username}, process.env.JWT, {expiresIn: '1h'});
    return token;
}
const registerUser = async (username, password, email, phone) => {
        const connection = await createConnection();
        try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await connection.execute(
            `INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)`,
            [username, hashedPassword, email, phone]
        )
        return result.insertId;
    } catch (error) {
        throw new Error ('Register failed' + error.message);
    } finally {
        await connection.end()
    }
}

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({message: 'Auth failed'});
    }
    try {
        const verify = jwt.verify(token, process.env.JWT);
        req.user = verify;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Auth failed'});
    }
}
module.exports = {loginUser, registerUser, authMiddleware};