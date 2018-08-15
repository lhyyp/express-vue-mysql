const express = require('express');
const path = require('path');
var router = express.Router();
router.use((req,res,next)=>{
   var fileName=path.join(__dirname, '../public/index.html');
  res.render(fileName);
})
module.exports =router ;