<template>
  <div class="hello">
    {{msg}}
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  var $data = {
    'msg' : 'Welcome to Your Vue.js App'
  }
  var $this = {}
  export default {
    name: 'HelloWorld',
    data () {
      $this = this
      return $data
    },
    watch:{
      //值可以为methods的方法名
      // example0(curVal,oldVal){
      //   //console.log(curVal,oldVal);
      // },
      // example1:'HelloAxios',
      //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      // example2:{
      //   handler(curVal,oldVal){
      //     conosle.log(curVal,oldVal)
      //   },
      //   deep:true
      // }
    },
    methods:{
    // HelloAxios:function(){
    //   this.$http.get("/v2/book/search?q=python&fields=id,title")
    //   .then(function(reponse){
    //     //console.log(reponse.data);
    //    })
    //   .catch(function(err){
    //   //console.log(err)
    //   })
    
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
