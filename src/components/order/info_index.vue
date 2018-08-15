<template>
  <div class="info_index">
    <router-view :reload="reload" @appListen="appListen"></router-view>
  </div>
</template>
<script>
  var $data = {
    
  }
  var $this = {}
  export default {
    name: 'info_index',
    data () {
      $this = this
      return $data
    },
    props:{
      reload:{type:Boolean,default:false}
    },
    created:function(){
     
    },
    methods:{
      appListen:function($c,$d){
        $this.$emit('appListen',$c,$d);
      }
    },
    components:{
      
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .info_index{
   
  }
</style>
