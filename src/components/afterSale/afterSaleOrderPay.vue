<template>
  <section class="afterSaleOrderPay">
    <m-head :title="'售后订单'" @clickListen="goBack">
      <a slot="main-right" class="main" href="tel:400-021-2008">客服电话</a>
      <!-- <div slot="main-right" class="main">客服电话</div> -->
    </m-head>
    <div class="after_order">
      <div class="after_seller">
       <h4>商家同意换货请支付额外费用</h4>
       <p><span>售后单号:</span>{{data['return_goods_info']['return_order_sn']}}</p>
     </div>
     <div class="pay_freight">
      <div class="pay">请支付费用:<span>￥{{data['return_goods_info']['need_pay_money']}}</span></div>
    </div>
    <div class="custom">
      <h3>客服回复:</h3>
      <div class="Refund">
       {{data['return_goods_info']['remark']}}
     </div>
   </div>
   <content>
    <section>
      <div class="title">选择支付方式</div>
      <!-- <p>请在<span>24小时</span>内完成支付,超时后将取消订单</p> -->
    </section>
    <payList :orderId="data['return_goods_info']['id']" :orderSn="data['return_goods_info']['return_order_sn']" :url="'afterSaleOrder/check/'" ></payList>
  </content>
</div>
</section>
</template>
<script>
  import m_head from '../../components/common/m-head.vue'
import payList from '../../components/common/payListAfterSale.vue'  //售后支付组件
let $data ={
  
}
let $this = {}
export default {
  data (){
    $this = this
    return $data
  },
  props:{
    data:Object
  },
  created () {
    this.id=this.$route.params.id;
    this.baseHead=$baseHead;
    if(this.data['return_goods_info']==null||this.data['return_goods_info']==''){
      this.$router.push({name:'/afterSaleOrder/check',params:{'id':this.id}});
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$emit("appListen",'loading',false);
    next();
  },
  beforeRouteUpdate(to, from, next) {
    next(false);
  },
  methods: {
    goBack:function(){
      $this.$router.push({path:'/after_sale_order'});
    }
  },
  components:{
    'm-head':m_head,
    'payList':payList
  }
}
</script>
<style lang="scss">
  .afterSaleOrderPay{
    background: #f5f5f5;
    content{
      margin-bottom: 2.5rem;
      display:block;
      background-color:white;
      section{
        display:flex;
        justify-content:space-between;
        padding:1.79rem 1.25rem 0.714rem 1.25rem;
        align-items: baseline;
        border-bottom:1px solid #e0e0e0;
        .title{
          display:block;
          text-align:left;
          font-size:1.29rem;
          background-color:white;
          white-space:nowrap;
        }
        p{
          font-size:0.714rem;
          color:#9da2a6;
          margin-bottom:0;
          white-space:nowrap;
        }
        span{
          font-size:0.714rem;
          color:#c8161e;
        }
      }
    }
    .payList{
      padding: 0 1.25rem;
      background: white;
    }
    .order_list_detail{
      background: #fff;
      margin-bottom:1rem;
      padding: 1rem 0;
      .order-center{
        border-bottom: 1px solid #eee;
        padding-bottom: 2rem;
        border-top: 1px solid #eee;
        padding-top: 2rem;
        ul{
          width: 100%;
          display: flex;
          position: relative;
          overflow: hidden;
          align-items: center;
          padding: 0 1rem;
          li:nth-of-type(1){
            flex: 1;
            i{
              display: inline-block;
              width: 120px;
              height: 120px;
              background: #444;
            }
          }
          li:nth-of-type(2){
            flex: 2;
            margin-left: 2rem;
            h3{
              font-size: 16px;
            }
            p{
              margin-bottom:1.2rem;
              margin-top: 1rem;
            }
            h3:nth-of-type(2){
              font-size: 20px;
              color: #c8161e;
              small{
                color: #9da2a6;
                font-size: 14px;
                margin-left: 1rem;
              }
            }
          }
        }
      }
    }
    .apply_for{
      width: 100%;
      position: fixed;
      display: flex;
      text-align: center;
      height: 50px;
      bottom:0;
      left:0;
      .apply_for_left{
        flex: 1;
        color: #c8161e;
        line-height: 50px;
        font-size: 15px;
        letter-spacing: 1px;
        background: #fff;
        z-index: 999;
      }
      .apply_for_right{
        flex: 1;
        background: #c8161e;
        color: #fff;
        line-height: 50px;
        font-size: 15px;
        letter-spacing: 1px;
      }
    }
  }
</style>
