<template>	
	<div class="list_header">
	   <h1 class="logo">理想宝</h1>
	    <Dropdown class="use_message"  @on-click='logout($event)'>
	        <a href="javascript:void(0)">
	        	  <img :src="['/upload/'+this.$store.getters.getMemberInfo.src]"  class="header_portrait" > 
	              <span class='usename'>您好，<span>{{this.$store.getters.getMemberInfo.username}}</span></span>
	        </a>
	        <Dropdown-menu slot="list">
	            <Dropdown-item  name='logout'>退出</Dropdown-item>
	            <Dropdown-item  name='modifyMember'>修改资料</Dropdown-item>
	            <Dropdown-item disabled>豆汁儿</Dropdown-item>
	            <Dropdown-item>冰糖葫芦</Dropdown-item>
	            <Dropdown-item divided>北京烤鸭</Dropdown-item>
	        </Dropdown-menu>
	    </Dropdown>
		<Modal  v-model="modal1" title="修改资料" @on-ok="ok" @on-cancel="cancel"  :loading="loading">
			<Form ref="formCustom"  :model="data" :rules="ruleCustom" :label-width="80">
		        <FormItem label="用户名" prop="username">
		            <Input type="text" v-model='data.username'></Input>
		        </FormItem>
		        <FormItem label="密码" prop="password">
		            <Input type="password" placeholder='密码' v-model='data.password'></Input>
		        </FormItem>
		        <FormItem label="头像" >
		           <modify-member></modify-member>
		        </FormItem>
		    </Form>
		</Modal>


	</div>
</template>
<script type="text/javascript">
 import axios from 'axios'
 import modifyMember from '@/temp/modifyMember'
export default{
	data(){
		    const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('Please enter your password'));
                } else {
                    callback();
                }
            };
            const validateUaerName = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('用户名不可为空'));
                } else {
                    callback();
                }
            };
            
			return {
				data:{},
				modal1: false,
				loading: true,
				ruleCustom: {
                    username: [
                        { validator: validateUaerName, trigger: 'blur' }
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ]
                }
			}
		},
		components:{
            modifyMember
        },computed: {
        	getmember(){
        		return this.$store.getters.getMemberInfo
        	}
        },
		created () {
			var _this=this;
			axios.get('/api/admin').then(
	        	function(res){
	        		if(res.data.status==101){
	        		    _this.$router.push({path: '/login'}); 
	        		}else{
						_this.data=res.data.data;
	        		}
	        	}).catch(
	        	function(error){
	        		console.log(error);
	        	}
	        )  
		},
		methods:{
			logout:function(name){
				var _this=this;
				if(name=='logout'){
					axios.post('/api/admin/common/logout').then(
			        	function(res){
			        		if(res.data.status==0){
			        		   _this.$Message.info({content:res.data.msg});
		                	   _this.$store.commit('updataToken',0);
		                	   window.location.reload();
			        		}
			        	}).catch(
			        	function(error){
			        		console.log(error);
			        })
				}else if(name=='modifyMember'){
					this.modal1 = true;
					_this.data.password='';
				}      
			},
			handleSuccess(res, file){
				file.url ='https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
				this.$store.dispatch('loginmess');   //跟新vux的个人信息
			},
			ok () {
                var _this=this;
                axios.post('/api/admin/common/Modification',_this.data).then(
			        	function(res){
			        		if(res.data.status==0){
			        		   _this.modal1 = false;
			        		   _this.$Message.info({content:res.data.msg});
			        		   _this.$store.commit('updataMemberInfo',res.data.data)  //跟新vux的个人信息
			        		}else{
			        			_this.$Message.info({content:res.data.msg});
			        			_this.loading=false;
			        			_this.$nextTick(() => {
						             _this.loading = true;
						         });	
			        		}
			        	}).catch(
			        	function(error){
			        		console.log(error);
			        		_this.loading=false;
		        			_this.$nextTick(() => {
					             _this.loading = true;
					         });	
						})
                },
            cancel () {
                this.$Message.info('点击了取消');
            }
		}
}
</script>
<style type="text/css" scoped>
	.list_header{height: 100px;background: #324157;min-width: 1200px;}
	.logo{float: left;width:250px;text-align: center;color: #fff;line-height: 100px;}
	.use_message{float: right;height: 50px;margin-top: 25px;margin-right: 100px;}
	.header_portrait{float: left;width: 50px;height: 50px;border-radius: 100%;}
	.usename{float: left;margin-left: 20px;line-height: 50px;color: #fff;}
	
</style>
<style type="text/css">
	.use_message.ivu-dropdown .ivu-select-dropdown{margin:50px 0px 50px 80px;}
</style>