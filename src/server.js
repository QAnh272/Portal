const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const route = require('./routes');
const db = require('./config/database/db');
const cookieParser = require('cookie-parser');
const session = require('express-session');

route(app);
db.createConnection();

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 15 * 60 * 1000 } // Session sẽ tồn tại trong 1 phút
}));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
})


