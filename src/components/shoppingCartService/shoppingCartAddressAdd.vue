<template>
  <div class="shoppingCartAddressAdd">
    <addressAdd :url="'/shoppingCart/Address'" @appListen="appListen"></addressAdd>
  </div> 
</template>
<script>
  import addressAdd from '@/components/common/addressAdd.vue'
  var $this = {}
  export default {
    name: 'shoppingCartAddressAdd',
    data(){
      $this = this
      return {}
    },
    props:{

    },
    created:function(){
      window.scrollTo(0,0);
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      appListen:function($c,$d){
        $this.$emit('appListen',$c,$d);
      },
      goBack:function(){
        $this.$router.push({path:'/shoppingCart/Address'});
      }
    },
    components:{
      addressAdd:addressAdd,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .shoppingCartAddressAdd{
    
  }
</style>
