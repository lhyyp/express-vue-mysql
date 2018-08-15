const express = require('express');
const async =require("async")
const mysql = require('mysql');
var db = mysql.createPool({ host: 'localhost', user: 'root', password: 'root', database: 'learn' })
var router = express.Router();


router.get('/',(req,res)=>{
           async.waterfall(
            [
              function(cb){
	              	db.query(`SELECT firstPrize,secondPrize FROM user_table where id=21`,(err,num)=>{
			            if(err){
			            	 cb(new Error(err));
			            }else{
			                cb(null, num);
			            }
			        })
              	},
              	function(num,cb){
              		var rum=Math.random();
              		var result;
              		var firstPrize=num[0].firstPrize;
              		var secondPrize=num[0].secondPrize;
              		if(rum<0.0001 && num[0].firstPrize>0 ){   //一等奖
              			result=1;
              			firstPrize=num[0].firstPrize-1;
				    }else if(rum<0.01 && num[0].secondPrize>0 ){ //二等奖
				   	    result=2;
				   	    secondPrize=num[0].secondPrize-1;
				    }else{
				   	    result=0; 
				    }
				    db.query(`UPDATE user_table SET secondPrize = '${secondPrize}',firstPrize = '${firstPrize}' WHERE id = 21 `,(err,data)=>{
			            if(err){
			            	cb(new Error(err));
			            }else{
			            	cb(null,result);
			            }
			        }) 
              	},function(result,cb){
			        if(result>0){
			        	var timer=new Date().getTime();
			        	db.query(`INSERT INTO user_recond (uid, timer,recond) VALUES (21, '${timer}','${result}') `,(err,data)=>{
				            if(err){
				            	cb(new Error(err));
				            }else{
				               cb(null,result);
				            }
				        }) 
			        }else{
			        	cb(null,result);
			        }
              	}

            ], function(err, result) {
                if (err) {
                    console.log(111111111111111,err);
                } else {
                    var result = JSON.stringify(result);
                   res.send('{"stats":500,"msg":"拿到了","data":'+result+'}').end();
                }
            });

      //   db.query(`SELECT firstPrize,secondPrize FROM user_table where id=21`,(err,num)=>{
      //       if(err){
      //       	console.log(err)
      //           res.send('{"stats":500,"msg":'+err+'}').end();
      //       }else{
      //           var rum=Math.random();
      //           console.log(rum)
			   // if(rum<0.0001 && num[0].firstPrize>0 ){

			   // 	    res.send('{"stats":500,"msg":"一等奖"}').end();
			   // }else if(rum<0.01 && num[0].secondPrize>0 ){
			   // 	    res.send('{"stats":500,"msg":"二等奖"}').end();
			   // }else{
			   // 	   res.send('{"stats":500,"msg":"继续努力"}').end();
			   // }
      //       }
      //   })


})

module.exports = router;