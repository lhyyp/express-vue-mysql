<template>	
	<div>
	  <my-header></my-header>
	  <div class="body">
	     <div class="left">
	     	<left-side></left-side>
	     </div>
  	 	<div class="right">
  	 		<router-view></router-view>
  	 	</div>
	  	 
	  </div>
     
	</div>
</template>
<script type="text/javascript">
import axios from 'axios'
import myHeader from '@/temp/header'
import leftSide from '@/temp/leftSide'
export default{
	data(){
	    return {
			data:{},
		}
	},
	components:{
        myHeader,leftSide
    },computed: {
    	
    },
	created () {
		
	},
	methods:{
		
	}
}
</script>
<style type="text/css">
	.body{overflow: hidden;min-width: 1230px;}
    .left{float: left;width: 240px;}
	.right{float: left;overflow: hidden;width: 75%;margin: 50px 0 0 30px;}
</style>
