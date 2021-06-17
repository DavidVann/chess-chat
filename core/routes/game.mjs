// let express = require('express');
import express from 'express';
let router = express.Router();

router.get('/', function(req, res, next) {
    res.render('game');
});

export default router;