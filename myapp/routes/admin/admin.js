
const express = require('express');
const mysql = require('mysql');
var db = mysql.createPool({ host: 'localhost', user: 'root', password: 'root', database: 'learn' })
var router = express.Router();
const fs=require('fs');
const pathlib=require('path');
const async =require("async")
const common =require("../../libs/common")

router.use((req,res,next)=>{
   if(!req.session['admin_info']  && req.url!='/common/login' && req.url!='/common/register'){
   	    res.json({
			'status':101,
			'msg':'未登录'
		});
   	    
   }else{
	   next();	
   }
})
//登录、注册、退出
router.use('/common', require('./common'));
router.get('/',(req,res)=>{
	res.json({
		'status':0,
		'data':req.session['admin_info']
	})
})
//修改头像
router.post('/portrait',(req,res)=>{
    async.waterfall([
    	function(cb){
    		if(req.files[0]){
    			var imgPath={};
				imgPath.oldpath=req.files[0].path;  //图片原名
				imgPath.newpath=req.files[0].path+pathlib.parse(req.files[0].originalname).ext; //图片原名+后缀
				imgPath.newFilename=req.files[0].filename+pathlib.parse(req.files[0].originalname).ext;
				cb(null,imgPath)	
    	    }else{
    	    	cb(new Error({"stats":1,"msg":'请选择图片'}));
    	    }
    	},function(imgPath,cb){
    		fs.rename(imgPath.oldpath,imgPath.newpath,function(err){
					if(err){
						cb(new Error({'status':102,'msg':'图片重命名错误'}));
					}else{
                        cb(null,imgPath)
					}
				})
    	},function(imgPath,cb){
            db.query(`SELECT * FROM user_table WHERE Id=${req.session['admin_info'].id}`,(err,data)=>{
            	if(err){
				    cb(new Error({"stats":500,"msg":"database err"}));
				}else{
					if(data.length==0){
		    			cb(new Error({"stats":1,"msg":"用户信息有误"}));
		    		}else{
		    			imgPath.data=data;
						cb(null,imgPath);
					}
				}
            })
    	},function(imgPath,cb){
    		
			if(imgPath.data[0].src=='img.jpg' || !imgPath.data[0].src){    //判断是默认的图片就不用删除
		        cb(null,imgPath);
		    }else{     //不是默认的图片就要先删除后上传
		    	fs.access('public/upload/'+imgPath.data[0].src,function(err){    // 文件和目录不存在的情况下；
				    if(err){         // 文件和目录不存在的情况下；
				       cb(null,imgPath);
				    }else{          // 文件和目录存在的情况下,删除原文件；
				    	fs.unlink('public/upload/'+imgPath.data[0].src,(err)=>{
					        if(err){
					        	cb(new Error({"stats":500,"msg":"database err"}));

					        }else{
					        	cb(null,imgPath);
					        }
					    })
				    }
				})
		        
		    }
    	},function(imgPath,cb){
    		db.query(`UPDATE  user_table SET src='${imgPath.newFilename}' WHERE Id=${req.session['admin_info'].id}`,(err,data)=>{
				if(err){
					cb(new Error({"stats":500,"msg":"database err"}));
				}else{ 
					req.session['admin_info'].src= imgPath.newFilename;
					cb(null,imgPath)
				}
			});
    	}], function(err, imgPath) {
            if (err) {
                console.log(err);
                res.json({"status":5000,"msg":"服务器内部错误"});
            } else {
              res.json({"status":0,"msg":"修改成功",'src':imgPath.newFilename});
            }
        }
   );
})
//会员权限
router.post('/Jurisdiction',(req,res)=>{ 
	switch(req.body.act){
		case 'select':
			let arr = [];
			db.query(`SELECT Id,username FROM user_table  order  by id limit 0,10`,(err,data)=>{
				if(err){
					return res.json({"status":5000,"msg":"服务器内部错误"});
				}
		       	for(let i=0; i<data.length;i++){
		       		arr.push(function (cb) {

		       			db.query(`select r.role_id,t.roleName from t_user_role as r left JOIN t_role as t on r.role_id = t.id where r.user_id = ${data[i].Id}`,(err,result)=>{
							if(err){
								cb(new Error({"stats":500,"msg":"database err"}));
							}else{
								data[i].role=result;
								if(i==data.length-1){
			                		cb(null,data);							
								}else{
									cb(null)
								}
							};
						});
		       		})
				};
				async.series(arr,function(err,data){
					if(err){
						res.json({"status":5000,"msg":"服务器内部错误"});
					}else{
						res.json(data[data.length-1]);
					}
				 
				});
			});
			break;
	}

/*

	switch(req.query.act){

		case 'select':
            async.waterfall([
            	function(cb){
					db.query(`SELECT Id,username FROM user_table  order  by id limit 0,10`,(err,data)=>{
						if(err){
							cb(new Error({"stats":500,"msg":"database err"}));
						}else{
			               cb(null,data);
						}
					});
            	},
            	function (data,cb){

            		for(let i=0; i<data.length;i++){
						db.query(`select r.role_id,t.roleName from t_user_role as r left JOIN t_role as t on r.role_id = t.id where user_id = ${data[i].Id}`,(err,result)=>{
							if(err){
								cb(new Error({"stats":500,"msg":"database err"}));
							}else{
								console.log(i)
								data[i].role=result;
				                if(i==data.length-1){
				                	cb(null,data);
				                }
							};
						});
            		};
            	}
    	
	    	], function(err, data) {
		            if (err) {
		                res.json({"status":5000,"msg":"服务器内部错误"});
		            } else {
		              res.json(data);
		            }
		        }
		   );

		break;
	}
*/
})

// 删除会员
router.post('/remove',(req,res)=>{
	var id=req.body.id;
	if(id == req.session['admin_info'].id){
		res.json({'code':201,'msg':'不能删除自己'}).end();
	}else{
		async.waterfall([
			function(cb){
				db.query(`select t.permissionid from t_user_role as r left JOIN t_role_permisson as t on t.role_id = r.role_id where r.user_id = ${req.session['admin_info'].id}`,(err,result)=>{
					if(err){
						cb(new Error({"stats":500,"msg":"database err"}));
					}else{
						cb(null,result);
						//result= [{"permissionid":1},{"permissionid":2},{"permissionid":3},{"permissionid":4}]
					};
				});
			},
			function(result,cb){
				new Promise((res,rej) => {
					for(var i=0;i<result.length;i++){
						if(result[i].permissionid == 102003){    //有编辑权限
							return res()
						}
					}
					rej();
				}).then(()=> {
					db.query(`delete from user_table where id=${id}`,(err,data)=>{
						if(err){
							cb(new Error({"stats":500,"msg":"database err"}));
						}else{
							cb(null,'data');
							//result= [{"permissionid":1},{"permissionid":2},{"permissionid":3},{"permissionid":4}]
						};
					})
				}).catch(()=>{
					cb(new Error({"stats":10002,"msg":"没有权限"}));
				})


			},function(data,cb){
				db.query(`delete from t_user_role where user_id=${id}`,(err,data)=>{
					if(err){
						cb(new Error({"stats":500,"msg":"database err"}));
					}else{
						cb(null,data);
						//result= [{"permissionid":1},{"permissionid":2},{"permissionid":3},{"permissionid":4}]
					};

				})
			}
			],function(err,data){
				if(err){
					res.json({"status":5000,"msg":"服务器内部错误"});
				}else{

					res.json({'code':200,'msg':'删除成功'});
				}
			}
		)

	}
	
})

//编辑会员资料
router.post('/editMemberInformation',(req,res)=>{
	var id=req.body.id;
	var psw = req.body.psw;
	var roleId = req.body.roleId;
	async.waterfall([
			function(cb){
				db.query(`select t.permissionid from t_user_role as r left JOIN t_role_permisson as t on t.role_id = r.role_id where r.user_id = ${req.session['admin_info'].id}`,(err,result)=>{
					if(err){
						cb(new Error({"stats":500,"msg":"database err"}));

					}else{
						cb(null,result);   //查找该用户的权限
						//result= [{"permissionid":1},{"permissionid":2},{"permissionid":3},{"permissionid":4}]
					};
				});
			},
			function(result,cb){
				new Promise((res,rej) => {
					for(var i=0;i<result.length;i++){
						if(result[i].permissionid == 100202){    //有编辑权限
							return res()
						}
					}
					rej();
				}).then(()=> {
					db.query(`update user_table  set password=${psw} where id=${id}`,(err,data)=>{
						if(err){
							cb(new Error({"stats":500,"msg":"database err"}));
						}else{
							cb(null,data);
						};
					})
				}).catch(()=>{
					cb(new Error(JSON.stringify({"stats":10002,"msg":"没有权限"})));
				})
				
			},
			function(data,cb){
				console.log(data)
				db.query(`update t_user_role  set role_id=${roleId} where user_id=${id}`,(err,data)=>{
					if(err){
						cb(new Error({"stats":500,"msg":"database err"}));
					}else{
						cb(null,data);
					};
				})
			}
			],function(err,data){
				if(err){
					res.json(JSON.parse(err.message));
				}else{
					res.json({'code':200,'msg':'修改成功'});
				}
			}
		)


})






//获取所有的角色
router.get('/getGroup',(req,res)=>{
	db.query(`select * from t_role`,(err,data)=>{
		if(err){
			res.json({"stats":500,"msg":"database err"});
		}else{
			res.json(data);
		}	
	})
})

//获取权限列表

router.get('/getPermisson',(req,res)=>{
	let id= req.query.id;
	let result={};
	async.waterfall([
		function(cb){
			db.query(`select permissionid from t_role_permisson where role_id=${id}`,(err,data)=>{
				if(err){
					cb(new Error(JSON.stringify({"stats":500,"msg":"database err"})));
				}else{
					result.Owned=[];
					for(let i = 0 ;i<data.length;i++){
                        result.Owned.push(data[i].permissionid)
					}
					cb(null,result);
				}	
			})

		},
		function(result,cb){
			db.query(`select id,type,permissionName as title from t_permission`,(err,data)=>{
				if(err){
					cb(new Error(JSON.stringify({"stats":500,"msg":"database err"})));
				}else{
					for(var i=0;i<result.Owned.length;i++){
						for(var j=0;j<data.length;j++){
							if(result.Owned[i]==data[j].id){
                                data[j].checked=true;
							}
							data[j].expand=true;
							
						}
						
					}
					result.whole=common.toTree(data);   //把拿到的数组变成树形结构数据

					cb(null,result);

				}	
			})


		}

		],function(err,data){
			if(err){
				res.json(JSON.parse(err.message));
			}else{
				res.json(data);
			}
		}
	)
})

router.get('/setPermisson',(req,res)=>{
	var roleId=req.query.roleId;
	var permissonId=req.query.permissonId || [];
	var sql='';
	if(permissonId.length>0){
		for(var i = 0;i<permissonId.length;i++){
			sql += "or p.id=" + permissonId[i] + " ";
		}
		sql = sql.replace(/or /,''); 
	}
	   
	async.waterfall([
        function(cb){
            db.query(`delete from t_role_permisson where role_id=${roleId}`,(err,data)=>{
            	if(err){
					cb(new Error(JSON.stringify({"stats":500,"msg":"database err"})));
					console.log(0)
				}else{
					cb(null,data);	
				}	
            })
        },
        function(data,cb){
        	if(permissonId.length>0){
				db.query(`INSERT INTO t_role_permisson (permissionid,role_id) 
	        		SELECT p.id as permissionid,role.id as role_id FROM t_permission as p JOIN t_role as role ON role.id = ${roleId} WHERE ${sql}`,(err,data)=>{
						if(err){
							cb(new Error(JSON.stringify({"stats":500,"msg":"database err"})));
						}else{
							cb(null,JSON.stringify({"stats":200,"msg":"添加成功"}));
						}
					}	
				)
			}else{
				cb(null,JSON.stringify({"stats":200,"msg":"添加成功"}));
			}
        	
        }
	],function(err,data){
				if(err){
					res.json(JSON.parse(err.message));
				}else{
					res.json(JSON.parse(data));
				}
			}
	)
		
})

// 获取所有的用户列表

router.get('/getuser',(req,res)=>{
	db.query(`select id ,username from user_table order by id limit 0,10 `,(err,data)=>{
		if(err){
			console.log(0)
            res.json({"stats":500,"msg":"database err"});
		}else{
			res.json(data);
		}
	})
})

//角色组添加添加用户
router.post('/adduser',(req,res)=>{
	let id= req.body.id;
	let role_id = req.body.role_id;
	db.query(`INSERT INTO t_user_role (role_id,user_id) 
			SELECT a.id as role_id,b.Id as user_id 
			FROM t_role as a 
			JOIN user_table as b ON b.Id = ${id} 
			WHERE a.id = ${role_id} AND not exists (select id from t_user_role where user_id = ${id} AND role_id = ${role_id})`,(err,data)=>{
				if(err){
		            res.json({"stats":500,"msg":"database err"});
				}else{
					if(data. affectedRows>0){
						res.json({'status':200,'msg':'添加成功'});
					}else{
						res.json({'status':201,'msg':'添加失败'});
					}
					
				}
			})
})

//根据id、用户名查找
router.post('/find',(req,res)=>{
	let id=req.body.id || '';
	let username= req.body.username || '';
	console.log(id,username)
	if(!id && !username){
		res.json({'status':201,'msg':'请输入用户名或者用户id'});
	}
	
	let parameterKey=(id && !username) ? 'id' : 'username';
	let parameterName=(id && !username) ? id : username;
	db.query(`select id,username from user_table where ${parameterKey}='${parameterName}' `,(err,data)=>{
		if(err){
			console.log(err)
            res.json({"stats":500,"msg":"database err"});
		}else{
			console.log(data)
			if(data.length>0){
				res.json(data);
			}else{
				res.json({'status':201,'msg':'没有该用户'});
			}
			
		}
	})
	

})
module.exports = router; 