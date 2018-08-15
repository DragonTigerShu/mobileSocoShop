<template>
  <div class="dialogAddress">
    <mHead :title="'我的地址'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <addressList :addUrl="'/info/address/add'" :editUrl="'/info/address/edit'" @appListen="appListen"></addressList>
  </div>
</template>
<script>
  import addressList from '@/components/common/addressList.vue'
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  var $data = {
    
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
      window.scrollTo(0,0);
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      clickListen:function(){

      },
      goBack:function(){
        $this.$router.push({path:'/info'});
      },
      appListen:function($c,$d){
        $this.$emit("appListen",$c,$d);
      }
    },
    components:{
      'mHead':mHead,
      'addressList':addressList
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .dialogAddress{

  }
</style>
