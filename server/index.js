require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose');
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 5000;
//const PORT = 5001;

const app = express()

app.use(express.json());

//обеспечиваем работу конструкции res.cookie(...) в user-controller 
app.use(cookieParser());

app.use(cors({ // Cross-Origin Resource Sharing
    credentials: true, // разрешаем запросы
    // url нашего фроненда, с каким доменом будем обмениваться куками
    // это localhost:3000
    origin: process.env.CLIENT_URL 
}));
app.use('/api', router);

app.use(errorMiddleware); // errorMiddleware - функция

const start = async () => {
// подключаемся к mongodb в контейнере docker
const DB_URI = "mongodb://localhost:27017/base_jwt_auth";    
    try {
        // согласно информации в сообщении с варнингом
        // надо указать {useNewUrlParser:true}
        await mongoose.connect(DB_URI,{useNewUrlParser:true});
        
        app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`))
    } catch (e) {
        console.log(e);
    }
}

start()
