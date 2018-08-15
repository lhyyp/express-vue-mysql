<template>
	<div>
		 <Table border :columns="columns7" :data="data6"></Table>


          <!-- 角色分配权限弹窗 -->
        <Modal v-model="modal1" title="编辑管理员资料" @on-ok="ok" :loading='loading'>
                <h2>您正在为（{{groupName}}）分配权限</h2>
                <Tree :data="data4" show-checkbox multiple ref='tree'></Tree>

        </Modal>
        <Modal v-model="add" title="添加用户"  :loading='loading' :footer-hide='true'>
            <Input v-model="value13">
                <Select v-model="select3" slot="prepend" style="width: 80px">
                    <Option value="id">用户id</Option>
                    <Option value="username">用户名</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click='find'></Button>
            </Input>
            <Table :data="tableData1" :columns="tableColumns1" stripe class='table'></Table>
        </Modal>
	</div>
</template>		
<script type="text/javascript">
	import http from '@/libs/http'
    import axios from 'axios'
	 export default {
	 	data() {
	 		return {
                modal1: false,
                loading:true,
                add:false,
                value13: '',
                select3: 'id',
                groupName:'',       //角色名
                groupId:'',        //角色id
                data4:[],
	 			columns7: [
                    {
                        title: '角色ID',
                        key: 'id'
                        
                    },
                    {
                        title: '角色名称',
                        key: 'roleName'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 500,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'error'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                             this.$Message.info('太麻烦了，能不能不删除');
                                        }
                                    }
                                }, '删除'),
                                h('Button', {
                                    props: {
                                        type: 'primary'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal1=true;
                                            this.groupName= this.data6[params.index].roleName;
                                            this.groupId   = this.data6[params.index].id;
                                            this.aa(this.data6[params.index].id); 

                                        }
                                    }
                                }, '分配权限'),
                                h('Button', {
                                    props: {
                                        type: 'success'
                                    },
                                   
                                    on: {
                                        click: () => {
                                            this.add=true;
                                            this.groupId   = this.data6[params.index].id;
                                            this.getuser();
                                        }
                                    }
                                }, '添加成员')
                            ]);
                        }
                    }
                ],
                data6: [],
                tableData1: [],
                tableColumns1: [
                    {
                        title: 'ID',
                        key: 'name',
                        render: (h, params) => {
                            //render 函数传入两个参数，第一个是 h，第二个是对象，包含 row、column 和 index，分别指当前单元格数据，当前列数据，当前是第几行
                           return h('div', this.tableData1[params.index].id);
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
                        title: '操作',
                        key: 'people',
                        render: (h, params) => {
                            return h('div', [
                                h('Button',{
                                    props: {
                                        type: 'success'
                                    },
                                    on:{
                                        click:()=>{
                                            let is_click=true;
                                            if(is_click){
                                                is_click = false;
                                                http.post('/api/admin/adduser',{'id':this.tableData1[params.index].id,'role_id':this.groupId}).then((res)=>{
                                                    this.$Message.info(res.data.msg);
                                                    is_click= true;
                                                })

                                            }
                                            
                                        }
                                    }
                                },'添加')]
                            )  
                        }      
                        
                    }
                ]
	 		}
	 	},
	 	created () {
			var _this=this;
			axios.get('/api/admin/getGroup').then(
	        	function(res){
	        		if(res.data.status==101){
	        		    _this.$router.push({path: '/login'}); 
	        		}else{
						_this.data6=res.data;
	        		}
	        	}).catch(
	        	function(error){
	        		console.log(error);
	        	}
	        )  
			
		},
        methods:{
            aa(id){
                var _this=this;
                axios.get('/api/admin/getPermisson?id='+id).then(
                    function(res){
                        if(res.data.status==101){
                            _this.$router.push({path: '/login'}); 
                        }else{
                            _this.data4=res.data.whole;
                            console.log(res.data.whole)
                        }
                    }).catch(
                    function(error){
                        console.log(error);
                    }
                ) 
            },
            ok () {
                var arr=this.$refs.tree.getCheckedNodes();   //获取选中节点
                var newArr=[]
                for(var i=0; i<arr.length;i++){
                    if(!arr[i].children){          //判断不是菜单的，就把id放到新数组中
                        newArr.push(arr[i].id);    //
                    }
                }
                var _this=this;
                let params = {'roleId':this.groupId,'permissonId':newArr};
               const res=http.get('/api/admin/setPermisson', params).then(      //修改该角色对应的权限
                    function(res){
                        if(res.data.status==101){
                            _this.$router.push({path: '/login'}); 
                        }else if(res.data.stats==10002){
                            _this.$Message.info(res.data.msg);
                            _this.loading=false;
                            _this.$nextTick(() => {
                                _this.loading = true;
                            });
                        }else{
                            _this.modal1 = false;
                            _this.$Message.info(res.data.msg);
                        }
                    })
                ;  
            },
            getuser(){
                var _this=this
                const res=http.get('/api/admin/getuser').then(function(res){
                    _this.tableData1= res.data;
                })
            },
            find(){
                var _this=this
                let params = {};
                params[this.select3] = this.value13;
                http.post('/api/admin/find',params).then(function(res){
                    _this.tableData1= res.data;
                })

            }
        }
	 }
</script>	
<style type="text/css" scope>
    .table{margin: 30px auto;}
</style>