<template>
	<div  class="login-wrap">
        <div  class="ms-title">理想宝</div>
        <form class="ms-login">
            <div>
            	<input type="text"  class='username' placeholder='请输入用户名'  v-model="data.username" > 
            </div>
            <div>
            	<input type="password"  class='password' placeholder='请输入密码'  v-model='data.password'  @keyup.enter='register()'>
            </div>
            <div>
            	<i-button type="success"  class="login-btn" @click='register()'>立即注册</i-button>
            	<p class="already">还没有理账号？<a href="/login">请立即登入</a></p>
            </div>
      </form>  
       <div class="ditital_cer"></div> 
    </div>
</template>
<script type="text/javascript">
 import axios from 'axios'
	export default{
		data(){
			return {
				data:{
					username:'',
					password:''
				}
			}
		},
		computed:{
           
		},
		methods:{
			register(){
				var _this=this;
                axios.post('/api/admin/common/register',{data:_this.data}).then(
                	function(res){
                		if(res.data.status==0){
                			_this.$Message.info({content:res.data.msg});
                            _this.$store.commit('updataToken',100);
                			_this.$router.push({path: '/admin'});
                		}else{
 							_this.$Message.info(res.data.msg);
                		}
                	}).catch(
                	function(error){
                		console.log(error);

                	})
			} 
		}

	}
	
</script>
<style type="text/css" scoped>
.login-wrap{position: fixed; top:0; left:0; right: 0; bottom: 0; width:100%; height:100%; background: #324157; }
 .ms-title{position: absolute; top:50%; width:100%; margin-top: -230px; text-align: center; font-size:30px; color: #fff;}
.ms-login{position: absolute; left:50%; top:50%; width:380px; height:240px; margin:-150px 0 0 -190px; padding:40px; border-radius: 5px; background: #fff; }
.username,.password{border:1px solid #67c23a;height: 40px;padding:0 15px;width: 100%;border-radius: 4px;margin-bottom: 22px;}
.login-btn{/*color: #fff; background-color: #409EFF; border-color: #409EFF;text-align: center;border-radius: 4px;*/display: block;width: 100%;height: 36px;}
.already{font-size: 12px;color: #333; line-height: 16px;text-align: center;margin-top: 10px;}
.already a{color: #029bf0;margin-left: 4px;}
	
</style>