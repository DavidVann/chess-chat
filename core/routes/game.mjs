// let express = require('express');
import express from 'express';
import * as uuid from 'uuid';
import redis from 'redis';

let router = express.Router();
let client = redis.createClient();

router.get('/open', (req, res, next) => {
    
})

router.get('/:gameid', function(req, res, next) {
    let playerID = req.cookies['playerID'];
    if (playerID === undefined) {
        playerID = uuid.v4();
        res.cookie('playerID', playerID, {
            maxAge: 86400*1000 // Expire after one day
        })

        res.cookie('testCookie', 'testVal')
    }
    res.render('game', {'title': 'Connect 4'});
});

router.get('/', (req, res, next) => {
    /**
     * Create a random room ID and redirect to it.
     */
    let room = uuid.v4();
    res.redirect(`/game/${room}`);
})

export default router;