<template>
  <div class="dialogAddress">
    <mHead :title="'我的地址'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <addressList :addUrl="''" :editUrl="''"></addressList>
  </div>
</template>
<script>
  import addressList from '@/components/common/addressList.vue'
  import mHead from '../../components/common/m-head.vue'
  var $data = {
    'addressData':[]
  }
  var $this = {}
  export default {
    name: 'dialogAddress',
    data(){
      $this = this
      return $data
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
      goBack:function(){
        
      }
    },
    components:{
      'addressList':addressList,
      'mHead':mHead
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .dialogAddress{
    
  }
</style>
