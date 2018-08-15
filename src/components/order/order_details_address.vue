<template>
  <div class="order_details_address">
    <mHead :title="'收货地址'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <addressList :selected="parseInt(selectAddress)" :addUrl="'/info/order/detail/address/'+orderId+'/add'" :editUrl="'/info/order/detail/address/'+orderId+'/edit'" @clickListen="clickListen" @appListen="appListen"></addressList>
  </div>
</template>
<script>
  import addressList from '@/components/common/addressList.vue'
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  var $data = {
    orderId:'',
    selectAddress:0
  }
  var $this = {}
  export default {
    name: 'order_details_address',
    data(){
      $this = this
      return $data
    },
    props:{
      
    },
    created:function(){
      window.scrollTo(0,0);
      this.orderId=this.$route.params.orderId;
      if($selectAddress==0){
        this.initOrder();
      }else{
        this.selectAddress=$selectAddress;
      }
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      initOrder:function(){
        $this.$emit("appListen","loading",true);
        axios({
         method:'post',
         url: $basePath+'?c=Order&m=userOrderDetail',
         data:{
           'orderId':this.orderId
         }
       })
        .then((response) => {
         $this.$emit("appListen","loading",false);
         switch(parseInt(response.data.code)){
           case 1100100 :{
            $selectAddress=parseInt(response.data.data['address_id']);
            $this.selectAddress=$selectAddress;
            break;
          }
          case 888 :$this.$emit("appListen","loginAgain");break;
          default :$this.$router.push({path:'/'});window.scrollTo(0,0);$this.$emit("appListen","inform","服务器忙,请稍后重试");break;
        }
      })
        .catch(function (error) {
         $this.$emit("appListen","loading",false);
         //console.log(error);
       });
      },
      clickListen:function($selected){
        $selectAddress=$selected;
        $this.selected=$selected;
        $this.$router.push({name:'info_order_details_edit',params:{id:this.orderId}});  
      },
      goBack:function(){
        $this.$router.push({name:'info_order_details_edit',params:{id:this.orderId}});
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
  .order_details_address{

  }
</style>
