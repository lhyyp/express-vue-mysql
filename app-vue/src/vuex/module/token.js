import axios from 'axios'
const state={
	token:0,
	memberInfo:{}
}
const getters={
	getmess:state=>state.token,
	getMemberInfo:state=>state.memberInfo
}
const mutations={
	updataToken(state,payloade){
        state.token=payloade
      },
    updataMemberInfo(state,payloade){
        state.memberInfo=payloade;
      }
}
const actions={
	  loginmess({ commit,state}){
	    return axios.get('/api/admin').then((res) => {
		    	if(res.data.status==101){
		    		commit('updataToken',0)
		    	}else{
		    		commit('updataToken',100)
		    		commit('updataMemberInfo',res.data.data)
		    	}
		   
		    }, (err) => {
		      console.log(err)
	    })
	  }
}
export default({
	state,getters,mutations,actions
})