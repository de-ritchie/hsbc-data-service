const express = require('express');

const config = require('../config');
const MongoClient = require('../model/mongoClient');

const router = express.Router();

router.get('/players', (req, res) => {
    
    console.log(req.body)
    MongoClient.connectDB(config.MONGODB_DB)
    .then((db) => {
        db.collection('players')
        .find({
            "Name": new RegExp(req.query.name, "i")
        }, {
            "limit": 10,
            "projection": {
                "_id": 0,
                "Name": 1,
                "Nationality": 1,
                "Team": 1,
                "Is Captain(1=yes)": 1,
                "Runs scored": 1,
                "Highest score": 1,
                Matches: 1,
                "Is batsman": 1,
                "Is bowler?": 1,
                "Wkts taken": 1,
                "Bowling econ": 1,
            }
        })
        .toArray((err, results) => {
            // console.log('Error', err)
            // console.log('Res', results)
            if(err){
                res.status(500).json({
                    message: `Error occured ${err}`
                })
                return 0;
            }
            res.status(200).json({
                results: results
            })
        })
    });
});

module.exports = router;