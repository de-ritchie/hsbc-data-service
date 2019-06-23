const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const mongoClient = require('./model/mongoClient');
const config = require('./config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

app.use('/api', require('./routes/fetch'));

app.get('/', (req, res) => {
    res.json({
        ping: "pong"
    })
})

app.use('/', function(req, res){
    res.status(404).json({
        title: '404 Error'
    });
})

var port = process.env.PORT || 3001;

const server= http.createServer(app);
mongoClient.connectDB(config.MONGODB_DB)
.then((dbname) => {
    server.listen(port, ()=>{
        console.log('App running at port:', port)
    });
})
.catch((err) => {
    console.log('Error occurred while connecting to DB', err);
})