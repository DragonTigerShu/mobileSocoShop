<template>
  <div class="afterSaleServiceAddress">
    <mHead :title="'收货地址'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <addressList :selected="parseInt(selectAddress)" :addUrl="'/afterSale/afterSaleServiceAddress/'+recId+'/add'" :editUrl="'/afterSale/afterSaleServiceAddress/'+recId+'/edit'" @clickListen="clickListen" @appListen="appListen"></addressList>
  </div>
</template>
<script>
  import addressList from '@/components/common/addressList.vue'
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  var $data = {
    recId:'',
    selectAddress:0
  }
  var $this = {}
  export default {
    name: 'afterSaleServiceAddress',
    data(){
      $this = this
      return $data
    },
    props:{
      
    },
    created:function(){
      window.scrollTo(0,0);
      this.recId=this.$route.params.recId;
      this.selectAddress=$selectAddress;
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      clickListen:function($selected){
        $selectAddress=$selected;
        $this.selected=$selected;
        $this.$router.push({name:'/afterSale/afterSaleServiceThreeApply',params:{id:this.recId}});
      },
      goBack:function(){
        $this.$router.push({name:'/afterSale/afterSaleServiceThreeApply',params:{id:this.recId}});
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
  .afterSaleServiceAddress{

  }
</style>
