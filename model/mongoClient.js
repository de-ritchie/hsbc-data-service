const config = require('../config');
const MongoClient = require('mongodb').MongoClient;
//In future, if multiple databases comes then, URL has to be constructed based on Database name
const url = "mongodb://"+config.MONGODB_USER+":"+config.MONGODB_PASS+"@"+config.MONGODB_URL;

var dbs = {};

let connect = (url, dbName) => {

    return new Promise((resolve, reject) => {

        if(dbs[dbName]){

            console.log('Database already available.....', dbName)
            resolve(dbs[dbName].db(dbName));
        }else{

            MongoClient.connect(url, {
                poolSize: 10
            })
                .then((res) => {
                    
                    dbs[dbName] = res;
                    console.log('Connection established for DB,', dbName);
                    resolve(dbs[dbName].db(dbName));
                })
                .catch((rej)=>{
                    
                    console.log('Error occurred while connecting...', dbName, rej);
                    reject(rej);
            });
        }
    });
}

let connectDB = (dbName) => {

    return new Promise((resolve, reject) => {
        connect(url, dbName).then((res) => {

            resolve(res);
        })
        .catch((rej) => {

            console.log('Error in getting DB', rej);
            reject();
        });
    });
}

let disconnectDB = (dbName) => {

    return new Promise((resolve, reject) => {
        if(dbs[dbName]){

            dbs[dbName].close()
            .then((res) => {
                console.log(dbName, 'Closed successfully')
                dbs[dbName] = null
                resolve(res);
            })
            .catch((rej) => {
                console.log('Failed while closing the', dbName);
            });
        }else{

            console.log(dbName, 'DB doesn\'t exist');
            resolve('DB doesn\'t exist');
        }
    });
}

let disconnectAllDB = ()=>{

    var promises = [];
    for(let db of Object.keys(dbs)){
        console.log(`Disconnecting DB: ${db}...`);
        promises.push(disconnectDB(db));
    }
    return promises;
}

module.exports = {

    connectDB: connectDB,
    disconnectDB: disconnectDB,
    disconnectAllDB: disconnectAllDB
}