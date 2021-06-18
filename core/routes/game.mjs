// let express = require('express');
import express from 'express';
let router = express.Router();

router.get('/:gameid', function(req, res, next) {
    res.render('game');
});

export default router;