<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
    html,body,div,h1,h2,h3,h4,h5,h6,p,table,form,label,ol,ul,li,dl,dt,dd,img,p{margin:0; padding:0;}
	html,body{text-size-adjust:none;-webkit-text-size-adjust:none;-webkit-user-select:none;}
	*{box-sizing:border-box;}
	a{color:#333; text-decoration:none;}
	a,input:focus,div,select{tap-highlight-color:rgba(0,0,0,0);-webkit-tap-highlight-color:rgba(0,0,0,0);}
	ul,li{list-style:none;}	
	input{outline: none;border: none;}
	img{vertical-align: top;}
	body{font-family: helvetica,'microsoft yahei'; width:100%; position: absolute;}
	/*弹窗*/
	.overlay{width: 100%; height:100%; background: #000; opacity: 0.6; filter: alpha(opacity=60); position: fixed; left: 0; top: 0; z-index: 10; display: none;}
	/*错误提示弹窗*/
	.ditital_cer{font-size:20;color:#fff;width: 360px;padding:0.6rem 0;background-color:#000;position: absolute;left: 50%;top:50%;text-align: center;border-radius: 0.2rem;opacity: 0.7;filter:alpha(opacity=70);z-index: 5555;display: none}
</style>
