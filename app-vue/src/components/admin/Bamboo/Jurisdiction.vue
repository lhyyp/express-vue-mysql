
<template>
	<div >
		<Table :data="tableData1" :columns="tableColumns1" stripe ></Table>
	    <div style="margin: 10px;overflow: hidden">
	        <div style="float: right;">
	            <Page :total="100" :current="1" @on-change="changePage"></Page>
	        </div>
	    </div>


        <!-- 修改角色弹窗 -->
        <Modal v-model="modal1" title="编辑管理员资料" @on-ok="ok" @on-cancel="cancel" :loading='loading'>
             <Form :model="formRight" label-position="right" :label-width="100">
                <FormItem label="用户名">
                    <Input v-model="formRight.username" disabled></Input>
                </FormItem>
                <FormItem label="密码">
                    <Input v-model="formRight.passWord"></Input>
                </FormItem>
                <FormItem label="用户组" prop="role_id">
                    <RadioGroup v-model="formRight.role_id">
                        <Radio v-for='item in role' :label="item.id" :key='item.id'>{{item.roleName}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>

        </Modal>
   
	</div>
   
</template>
<script>
    import axios from 'axios'
    export default {
        data () {
            return {
                modal1: false,
                loading:true,
                formRight: {
                    username: '',
                    passWord: '',
                    role_id: '',
                    id    :''
                },
                role:[
                    { 
                        id:'',
                        roleName:''

                    }
                ],

                tableData1: [],
                tableColumns1: [
                    {
                        title: 'ID',
                        key: 'name',
                        render: (h, params) => {
                        	//render 函数传入两个参数，第一个是 h，第二个是对象，包含 row、column 和 index，分别指当前单元格数据，当前列数据，当前是第几行
                           return h('div', this.tableData1[params.index].Id);
                        }
                    },
                    {
                        title: '用户名',
                        key: 'status',
                        render: (h, params) => {
                        	//render 函数传入两个参数，第一个是 h，第二个是对象，包含 row、column 和 index，分别指当前单元格数据，当前列数据，当前是第几行
                           return h('div', this.tableData1[params.index].username);
                        }
                    },
                    {
                        title: '所属用户组',
                        key: 'portrayal',
                        width:400, 
                        render: (h, params) => {
                            if (this.tableData1[params.index].role.length) {
                                return h('div', this.tableData1[params.index].role.map(function (item) {
                                  return h('Button', {
                                        'class':"ivu-btn-info",
                                        'style':{
                                            'margin-left':'10px'
                                        },
                                        'on':{
                                            'click': function () {
                                                // alert(0)
                                              }
                                        }
                                    },item.roleName)
                                }))
                            }
                          
                      }
                    },
                    {
                        title: '操作',
                        key: 'people',
                        render: (h, params) => {
                             return h('div', [
                                h('Button',{
                                    'class':"ivu-btn-error",
                                    on:{
                                        click:()=>{
                                            this.remove(params.index)
                                        }
                                    }
                                },'删除'),
                                h('Button',{
                                    'class':"ivu-btn-info",
                                     'style':{
                                            'margin-left':'10px'
                                        },
                                    on:{
                                        click:()=>{
                                            this.modal1=true;
                                            this.formRight.id   = this.tableData1[params.index].Id;
                                            this.formRight.username = this.tableData1[params.index].username;
                                            this.formRight.role_id = this.tableData1[params.index].role[0].role_id;
                                            this.aa(); 
                                        }
                                    }
                                },'编辑')
                                ]);
                        }
                    }
                ]
            }
        },
        created () {
			var _this=this;
				axios.post('/api/admin/Jurisdiction',{'act':'select'}).then(
		        	function(res){
		        		if(res.data.status==101){
		        		    _this.$router.push({path: '/login'}); 
		        		}else{
							_this.tableData1=res.data;
                            // console.log(res.data)
		        		}
		        	}).catch(
		        	function(error){
		        		console.log(error);
		        	}
		        )  
			
		},
        methods: {
            aa(){
                var _this=this;
                axios.get('/api/admin/getGroup').then(
                    function(res){
                        if(res.data.status==101){
                            _this.$router.push({path: '/login'}); 
                        }else{
                            _this.role=res.data;
                            // console.log(res.data)
                        }
                    }).catch(
                    function(error){
                        console.log(error);
                    }
                ) 
            },
            mockTableData1 () {
            	var _this=this;
				axios.post('/api/admin/Jurisdiction',{'act':'select'}).then(
		        	function(res){
		        		if(res.data.status==101){
		        		    _this.$router.push({path: '/login'}); 
		        		}else{
							_this.data=res.data;
		        		}
		        	}).catch(
		        	function(error){
		        		console.log(error);
		        	}
		        )  
            },
           
            changePage () {
                this.mockTableData1();
            },
       
            remove (index) {
                var _this=this;
                axios.post('/api/admin/remove',{'id':this.tableData1[index].Id}).then(
                    function(res){
                        if(res.data.status==101){
                            _this.$router.push({path: '/login'}); 
                        }else if(res.code == 200){
                            _this.$Message.info(res.msg);
                            _this.tableData1.splice(index, 1);
                        }else{
                            _this.$Message.info(res.data.msg);
                        }
                    }).catch(
                    function(error){
                        console.log(error);
                    }
                )  
                
            },
            ok () {
                var _this=this,
                roleId = this.formRight.role_id,
                psw    = this.formRight.passWord,
                id    = this.formRight.id;
                axios.post('/api/admin/editMemberInformation',{'id':id,'psw':psw,'roleId':roleId}).then(
                    function(res){
                        if(res.data.status==101){
                            _this.$router.push({path: '/login'}); 
                        }else if(res.code==200){
                            _this.$Message.info({content:res.data.msg});
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
                    }
                )  
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            }
            
        }
    }
</script>

<style type="text/css">

</style>