<template>
  <div class="shoppingCartAddress">
    <mHead :title="'收货地址'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <addressList :selected='parseInt(selected)' :addUrl="'/shoppingCart/Address/add'" :editUrl="'/shoppingCart/Address/edit'" @clickListen="clickListen" @appListen="appListen"></addressList>
  </div>
</template>
<script>
  import addressList from '@/components/common/addressList.vue'
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  var $data = {
    'selected':0,
  }
  var $this = {}
  export default {
    name: 'shoppingCartAddress',
    data(){
      $this = this
      return $data
    },
    props:{
      scData:Array
    },
    created:function(){
      this.selected=$selectAddress;
      window.scrollTo(0,0);
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      clickListen:function($selected){
        $selectAddress=$selected;
        $this.selected=$selected;
        $this.$router.push({path:'/shoppingCart/Order'});
      },
      goBack:function(){
        $this.$router.push({path:'/shoppingCart/Order'});
      },
      appListen:function($c,$d){
        $this.$emit("appListen",$c,$d);
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
  .shoppingCartAddress{
    
  }
</style>
