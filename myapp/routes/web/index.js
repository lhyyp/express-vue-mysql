
const express = require('express');
const async =require("async")
const mysql = require('mysql');
var db = mysql.createPool({ host: 'localhost', user: 'root', password: 'root', database: 'learn' })
var router = express.Router();

router.get('/',(req,res)=>{
    res.send('web')
})
module.exports = router;
