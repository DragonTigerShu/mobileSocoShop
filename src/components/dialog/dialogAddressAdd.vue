<template>
  <div class="dialogAddressAdd">
    <mHead :title="title" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <addressAdd :url="''" @appListen="appListen"></addressAdd>
  </div>
</template>
<script>
  import addressAdd from '@/components/common/addressAdd.vue'
  import mHead from '../../components/common/m-head.vue'
  var $this = {}
  export default {
    name: 'dialogAddressAdd',
    data () {
      $this = this
      return {}
    },
    props:{

    },
    created:function(){
      
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
        
      }
    },
    components:{
      addressAdd:addressAdd,
      mHead:mHead
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .dialogAddressAdd{
    
  }
</style>
