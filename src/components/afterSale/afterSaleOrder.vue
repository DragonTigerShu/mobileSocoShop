<template>
  <div class="afterSaleOrder">
    <router-view :data="data" @checkOrderListen="checkOrderListen"></router-view>
  </div>
</template>
<script>
  import axios from "axios";
  var $data = {
    data:{}
  }
  var $this = {}
  export default {
    name: 'afterSale',
    data () {
      $this = this
      return $data
    },
    created:function(){
      
    },
    mounted:function(){
      
    },
    watch:{
      
    },
    methods:{
      checkOrderListen:function(id){
        $this.$emit("appListen","loading",true);
        axios({
          method:'post',
          url: $basePath+'?c=ReturnGoods&m=userReturnGoodsDetail',
          data:{
            'returnGoodsId':id,
          }
        })
        .then((response) => {
          $this.$emit("appListen","loading",false);
          switch(parseInt(response.data.code)){
            case 1600100 :{
              $this.data={}
              $this.data=response.data.data;
              switch (parseInt($this.data['return_goods_info']['type'])){
              case 0:{//退货退款
                switch (parseInt($this.data['return_goods_info']['status'])){
                  case -2:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//已取消
                  case -1:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//未通过
                  case 0:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//待审核
                  case 1:$this.$router.push({name:'/afterSaleOrder/return',params:{'id':id}});break;//待审核//通过=>待寄回
                  case 2:$this.$router.push({name:'/afterSaleOrder/return',params:{'id':id}});break;//买家已发货=>待商家收货
                  case 3:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//商家已收货=>商家已收货,待退款
                  case 5:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;
                }
                break;
              }
              case 1:{//换货
                switch (parseInt($this.data['return_goods_info']['status'])){
                  case -2:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//已取消
                  case -1:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//未通过
                  case 0:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//待审核
                  case 1:{
                    if(parseInt($this.data['return_goods_info']['is_need_paid'])){
                      if(parseInt($this.data['return_goods_info']['is_paid']))
                        $this.$router.push({name:'/afterSaleOrder/return',params:{'id':id}});
                      else
                        $this.$router.push({name:'/afterSaleOrder/pay',params:{'id':id}});//待审核
                    }else{
                      $this.$router.push({name:'/afterSaleOrder/return',params:{'id':id}});break;
                    }
                    break;
                  }//通过=>待寄回
                  case 2:$this.$router.push({name:'/afterSaleOrder/return',params:{'id':id}});break;//买家已发货=>待商家收货
                  case 3:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//商家已收货=>商家已收货,准备发货中
                  case 4:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//商家已发货=>商家已发货
                  case 5:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//已完成=>已完成
                }
                break;
              }
              case 2:{//仅退款
                switch (parseInt($this.data['return_goods_info']['status'])){
                  case -2:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//已取消
                  case -1:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//未通过
                  case 0:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//待审核
                  case 1:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//待退款
                  case 5:$this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});break;//已完成=>已完成
                }
                break;
              }
            }
            break;
          }
          case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
          default :$this.$router.push({path:'/after_sale_order'});window.scrollTo(0,0);mui.alert('服务器忙<br/>请稍后重试');break;
        }
        window.scrollTo(0,0);
      })
        .catch(function (error) {
          $this.$emit("appListen","loading",false);
          mui.alert('服务器忙<br/>请稍后重试');
        //console.log(error);
      });

      // switch(id){//根据状态跳转到对应售后订单状态页面 参考路由index.js中的/afterSale_order内子路由
      //   case 0 :$this.$router.push({name:'info_aftersale_cation_one_application',params:{id:$this.id}});break;
      // }
    }
  },
  components:{
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .afterSaleOrder{
    
  }
</style>
