<template>
  <div class="shoppingCart">
    <router-view :reloadCart="reloadCart" @parentListen="parentListen" @aNClickListen='aNClickListen' @appListen="appListen"></router-view>
  </div>
</template>
<script>
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  var $data = {
    'reloadCart':true
  }
  var $this = {}
  export default {
    name: 'shoppingCart',
    data () {
      $this = this
      return $data
    },
    created:function(){
      
    },
    watch:{
      
    },
    methods:{
      appListen:function($c,$d){
        $this.$emit("appListen",$c,$d);
      },
      parentListen:function($c){
        $this.$emit('appListen','loading',false);
        switch($c){
          case 'reloadCart':$this.getCart();break;
          default:break;
        }
      },
      getCart:function(){
        $this.$emit('appListen','loading',true);
        axios({
          method:'post',
          url: $basePath+'?c=Cart&m=getCarts',
          data:{}
        })
        .then((response) => {
        //console.log(response.data.data);
        switch(parseInt(response.data.code)){
          case 1000500 :{
            $cart=response.data.data;
            $this.reloadCart=!$this.reloadCart
            break;
          }
          case 1000510 :break;
          case 1000520 :break;
          case 888 :$this.$router.push({path:'/login'});;break;
        }
        $this.$emit('appListen','loading',false);
      })
        .catch(function (error) {
          $this.$emit('appListen','loading',false);
        //console.log(error);
      });
      },
      aNClickListen:function($i,$b){
        if($b){
          $this.data[$i].amount++;
        }else{
          $this.data[$i].amount--;
        }
      },
    // removeListen:function($removeGroup){
     
    //   var btn = ["确定","取消"];
    //     mui.confirm('确认关闭当前窗口？','',btn,function(e){
    //     if(e.index==0){
    //         //执行mui封装好的窗口关闭逻辑；
    //         //old_back();
    //         for(var i=0;i<$removeGroup.length;i++){
    //           $data.data.splice($removeGroup[i],1);
    //         }
    //     }else{
      
    //     }
    //   });
    // }
  },
  components:{
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .shoppingCart{
   
  }
</style>
