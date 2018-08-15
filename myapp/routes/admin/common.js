const express = require('express');
const mysql = require('mysql');
var db = mysql.createPool({ host: 'localhost', user: 'root', password: 'root', database: 'learn' })
var router = express.Router();
const async =require("async");

router.post('/login',(req,res)=>{
	var username = req.body.data.username.replace(/ /g,'');
	var password = req.body.data.password.replace(/ /g,'');
	if(!req.body.data.username || !req.body.data.password ){
		res.send({'status':1,'msg':'用户名、密码不能为空'}).end();
	}else{

        db.query(`SELECT * FROM user_table WHERE username='${username}'`,(err,data)=>{
			if(err){
				res.send({"status":500,"msg":"database err"}).end();
			}else{
				if(data.length==0){
					res.send({"status":2,"msg":"用户不存在"}).end();
				}else{
					if(data[0].password==password){
						var admin_info = {};
						    admin_info.id  = data[0].Id;
						    admin_info.src  = data[0].src;
						    admin_info.username = data[0].username;
						    req.session['admin_info'] = admin_info;
						res.send({"status":0,"msg":"登录成功"}).end();
					}else{
						res.send({"status":3,"msg":"密码错误"}).end();
					}
				}
				
			}
		});
	}

})
router.get('/login',(req,res)=>{
	res.json( {data:req.session['admin_info']})
})
router.post('/register',(req,res)=>{
	var username = req.body.data.username.replace(/ /g,'');
	var password = req.body.data.password.replace(/ /g,'');
	if(!req.body.data.username || !req.body.data.password ){
		res.send({'status':1,'msg':'用户名、密码不能为空'}).end();
	}else{
		db.query(`SELECT * FROM user_table WHERE username='${username}'`,(err,data)=>{
			if(err){
				res.send('{"status":2,"msg":'+err+'}').end();
			}else{
				if(data.length==0){
					db.query(`INSERT INTO user_table (username,password,src) VALUE('${username}','${password}','img.jpg')` ,(err,data)=>{
						if(err){
							res.send({"status":500,"msg":"database err"}).end();
						}else{
							console.log(data)
							var admin_info = {};
						    admin_info.id  = data.insertId;
						    admin_info.src  = 'img.jpg';
						    admin_info.username = username;
						    req.session['admin_info'] = admin_info;
							res.json({"status":0,"msg":"ok"});
						}
					});
				}else{
					res.send({"status":3,"msg":"用户已存在"}).end();
				}
				
			}
		});
	}

})
//退出
router.post('/logout',(req,res)=>{
    req.session['admin_info'] = '';
	res.json({"status":0,"msg":"ok"});
				
})

//修改资料

router.post('/Modification',(req,res)=>{
	if(!req.body.username){
		return res.json({"status":1,"msg":"用户名不能为空"})
	}
	if(!req.body.password){
		return res.json({"status":1,"msg":"密码不能为空"})
	}
	async.waterfall([
           function(cb){
           	   db.query(`select username from user_table where username='${req.body.username}'`,(err,data)=>{
           	   		if(err){
						cb(new Error({"stats":500,"msg":"database err"}));
					}else{ 
						console.log(1,data.length)
						cb(null,data);
						
					}
           	   })
           
           },
           function(data,cb){
	           	if(data.length == 0){
	           		db.query(`UPDATE  user_table SET username='${req.body.username}',password='${req.body.password}' WHERE Id=${req.session['admin_info'].id}`,(err,data)=>{
						if(err){
							cb(new Error({"stats":500,"msg":"database err"}));
						}else{ 
							req.session['admin_info'].username= req.body.username;
							req.session['admin_info'].password= req.body.password;
							cb(null,data);
						}
					})
	           	}else{
	           		cb(null,data);
	           	}
                
           }


		],function(err,data){
			if(err){
				res.json({"status":5000,"msg":"服务器内部错误"});
			}else{
				res.json({"status":0,"msg":"修改成功",'data':req.session['admin_info']});
			}
		 
		});
	
		
})
module.exports = router;