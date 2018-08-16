<template>
<div>
	 <Menu :theme="theme2" :active-name="activeName" :open-names="openNames" accordion  ref="side_menu">
        <Submenu  v-for='(list,num) in MenuList' :name="`${num}`" :key="`${num}`">
            <template slot="title">
                <Icon :type="list.icon"></Icon>
                {{list.name}}
            </template>
            <MenuItem v-for='(item,index) in list.chilren' :name='`${num}-${index}`' :key='`${num}-${index}`'  @click.native='asideClick(item.path,`${num}-${index}`)' >{{item.name}}</MenuItem>
        </Submenu>
    </Menu>

</div>
    
   
</template>
<script>
    export default {
        data () {
            return {
                theme2: 'dark',
                openNames:['0'],
                activeName:'0-0',
                MenuList:[
                   {
                       icon:'ios-paper',
                       name:'权限管理',
                       chilren:[
                          {
                            
                            name:'管理员列表',
                            path:'/admin'
                          },
                           {
                            name:'角色列表',
                            path:'/admin/group'
                          },
                           {
                            name:'权限列表',
                            path:'/admin/aaaa/rule'
                          }
                       ]
                   },
                   {
                       icon:'ios-paper',
                       name:'权限管理',
                       chilren:[
                          {
                            
                            name:'管理员列表',
                            path:'/admin/user'
                          }
                       ]
                   }
                ]

            }
        },
        computed: {
            activemenu() {
                console.log(this.$route)
                return this.$route.path;  // 获取到地址拦上#号后面的url地址
            },
            indexFn() {
                   
            }
        },
        mounted(){
            let _this = this;
            for(let i= 0; i<_this.MenuList.length;i++){
                for(let j=0;j<_this.MenuList[i].chilren.length;j++){
                    if(_this.MenuList[i].chilren[j].path == this.$route.path){
                        _this.openNames=[String(i)];
                        _this.activeName=i+'-'+j;
                        this.$nextTick(() => {
                          this.$refs.side_menu.updateOpened();
                          this.$refs.side_menu.updateActiveName();
                        })

                    }
                }
            }
        },
        methods: {
            asideClick(path,openNames){
                this.$router.push(path);
                this.activeName=openNames;
            }
        }    
    }   
</script>
<style type="text/css">
</style>
