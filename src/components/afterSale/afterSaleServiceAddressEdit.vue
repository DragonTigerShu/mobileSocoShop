<template>
  <div class="order_details_address_edit">
    <addressAdd :selected="addressId" :url="'/afterSale/afterSaleServiceAddress/'+recId" @appListen="appListen"></addressAdd>
  </div>
</template>
<script>
  import addressAdd from '@/components/common/addressAdd.vue'
  var $this = {
    recId:'',
    addressId:''
  }
  export default {
    name: 'order_details_address_edit',
    data () {
      $this = this
      return {}
    },
    props:{

    },
    created:function(){
      window.scrollTo(0,0);
      this.recId=this.$route.params.recId;
      this.addressId=this.$route.params.id;
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      appListen:function($c,$d){
        $this.$emit('appListen',$c,$d);
      }
    },
    components:{
      addressAdd:addressAdd,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .order_details_address_edit{
    
  }
</style>
