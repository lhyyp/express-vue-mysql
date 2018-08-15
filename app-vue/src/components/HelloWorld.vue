<template>
   <div>
     欢迎来到vue,我是{{data}}
   </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {
    return {
      data:''
    }
  },
  created(){
     this.getApi();
  },
  methods:{
    getApi(){
      var _this=this;
      axios.get('/api').then(function (response) {
        _this.data=response.data;
      }).catch(function (response) {
        console.log(response);
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
*{margin:0;padding: 0}
</style>
