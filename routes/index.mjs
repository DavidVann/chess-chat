// let express = require('express');
import express from 'express';
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', (req, res, next) => {
  res.render('about')
})

export default router;
