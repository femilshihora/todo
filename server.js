    const express = require('express'); 
    const cors = require('cors');
    const dotenv = require('dotenv');
    const cookieParser = require('cookie-parser');
    const mysqlPool = require('./config/db');
const { route } = require('./routes/auth');
const router = require('./routes/auth');
const todorouter = require('./routes/todo');




    const app = express();
    const PORT = process.env.PORT || 4004;
    console.log('mysql db connection');


    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({credentials: true}));

// Routes
    app.get('/', (req, res) => {
        res.send('api is running...');
    });
    app.use('/api/auth', router);
    app.use('/api/todo',todorouter);
   

    app.listen(PORT,() => console.log(`Server is running on port :${PORT}`));




