
const express = require('express');
const async =require("async")
const mysql = require('mysql');
var db = mysql.createPool({ host: 'localhost', user: 'root', password: 'root', database: 'learn' })
var router = express.Router();

/* GET home page. */
 router.get('/',(req,res)=> {
        var result={};
         async.waterfall(
            [
                function(cb) {
                    db.query(`SELECT idcode FROM user_table`,(err,b)=>{
                        if(err){
                             cb(new Error(err));
                        }else{
                            cb(null, b);
                        }
                    })
                },
                function(b, cb) {
                    if (b[0].idcode != 0) {
                        var code = b[0].idcode;
                        var citycode = Math.floor(b[0].idcode / 100) * 100;
                        var province = Math.floor(b[0].idcode / 10000) * 10000;
                        db.query(`SELECT s.id,s.name ,s.type FROM lxjr_area_code As s where s.id IN ('${code}','${citycode}','${province}')`,(err,menberInfo)=>{
                            if(err){
                              cb(new Error(err));
                            }else{
                            	result.menberInfo=menberInfo;
                                cb(null, result);
                            }
                        });
                    }
                },
                function(result,cb){
                 	db.query(`SELECT s.id,s.name ,s.type FROM lxjr_area_code As s where s.type=1`,(err,province)=>{
                        if(err){
                          cb(new Error(err));
                        }else{
                        	result.province=province 
                        }
                    });
                    var code = result.menberInfo[0].id / 10000;    //当前省份的id的前两位
                    console.log(result.menberInfo.length)
                    if(result.menberInfo.length == 1){
                    	cb(null, result);

                    }else if(result.menberInfo.length >= 2){   //市
	                	db.query(`SELECT s.id,s.name ,s.type FROM lxjr_area_code As s where s.type =2 and s.id like '${code}%'`,(err,city)=>{
	                        if(err){
	                            cb(new Error(err));
	                        }else{
	                        	result.city = city;
	                        }
                       });
	                   if(result.menberInfo.length == 2){
	                   	   cb(null, result);
	                	}else{
	                		db.query(`SELECT s.id,s.name ,s.type FROM lxjr_area_code As s where s.type =3  and s.id like '${code}%'`,(err,county)=>{
		                        if(err){
		                            cb(new Error(err));
		                        }else{
		                        	result.county = county;
		                            cb(null, result);
		                        }
	                       });
	                	}
	                }
	                
                }
            ], function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    var result = JSON.stringify(result);
                   res.send('{"stats":500,"msg":"拿到了","data":'+result+'}').end();
                }
            });
       
    })






router.post('/',(req,res)=>{
    var idcode = req.body.address;
         db.query(`UPDATE user_table As s SET s.idcode='${idcode}' where s.id=21`, (err, data) => {
            if (err) {
                res.send('{"stats":500,"msg":"database err"}').end();
            } else {
                res.send('{"stats":1,"msg":"0k"}').end();
            }
        })
})
module.exports = router;
