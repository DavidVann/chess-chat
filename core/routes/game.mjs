// let express = require('express');
import express from 'express';
import * as uuid from 'uuid';
let router = express.Router();

router.get('/:gameid', function(req, res, next) {
    res.render('game');
});

router.get('/', (req, res, next) => {
    /**
     * Create a random room ID and redirect to it.
     */
    let room = uuid.v4();
    res.redirect(`/game/${room}`);
})

export default router;