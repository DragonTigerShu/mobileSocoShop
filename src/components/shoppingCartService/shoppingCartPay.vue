<template>
  <div class="shoppingCartPay">
    <mHead :title="'在线支付'" @clickListen="goBack">
      <div slot="main-right" @click="goOrder">我的订单</div>
    </mHead>
    <div style="height:3.57rem"></div>
    <content>
      <div class="money">应付金额: <span>￥{{data['total_amount']}}</span></div>
      <section>
        <div class="title">选择支付方式</div>
        <p>请在<span>24小时</span>内完成支付,超时后将取消订单</p>
      </section>
      <payList :orderId="data['order_id']" :orderSn="data['order_sn']" :url="'shoppingCart/Success/'"></payList>
    </content>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import payList from '@/components/common/payList.vue'
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  var $data = {
    'selected':1,
    'data':''
  }
  var $this = {}
  export default {
    name: 'shoppingCartPay',
    data () {
      $this = this
      return $data
    },
    props:{
    },
    beforeRouteUpdate(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
    next(false);
    //this.refreshData(to.params.id);
  },
  created:function(){
    this.orderId =  this.$route.params.id  //列表 id
    this.$emit("appListen","loading",true);
    axios({
      method:'post',
      url: $basePath+'?c=Order&m=userOrderDetail',
      data:{
        orderId:$this.orderId
      }
    })
    .then((response) => {
      //console.log(response.data.data);
      $this.$emit("appListen","loading",false);
      switch(parseInt(response.data.code)){
        case 1100100 :{
          $this.data=response.data.data;
          if($this.data['pay_status']==1){
            $this.$router.push({name: '/shoppingCart/Success',params:{id:$this.orderId}});
          }
          if($this.data['order_status']==3){
            $this.$router.push({name: 'info_order_details',params:{id:$this.orderId}});
          }
          window.scrollTo(0,0);
          break;
        }
        case 888 :$user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
        default :$this.$router.push({path:'/'});window.scrollTo(0,0);mui.alert('服务器忙<br/>请稍后重试');break;
      }
    })
    .catch(function (error) {
      $this.$emit("appListen","loading",false);
      //console.log(error);
    });
  },
  mounted:function(){
  },
  watch:{
    
  },
  methods:{
    transformTime:function(timestamp) {
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y+M+D+h+m+s;
    },
    goBack:function(){
      $this.$router.push({path:'/shoppingCart/Service'});
    },
    goOrder:function(){
      $this.$router.push({path:'/info/order'});
    },
  },
  components:{
    'payList':payList,
    'mHead':mHead
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .shoppingCartPay{  
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
      .money{
        display:flex;
        justify-content:center;
        align-items:center;
        height:9.64rem;
        width:100%;
        border-bottom:1.07rem solid #f7f7f7;
        font-size:1.29rem;
        box-sizing: content-box;
        span{
          margin-left:1rem;
          font-size:1.13rem;
          color:#c8161e;
          display:block;
        }
      }
      input{
        border-radius:0.143rem;
        border:1px solid #e0e0e0;
        height:3.57rem;
        padding:0 1.07rem;
        width:100%;
        margin-top:1.07rem;
        &:nth-child(1){
          margin-top:0;
        }
      }
      ul{
        padding:0 1.25rem;
        li{
          color:#cc1c1d;
          font-size:0.929rem;
          margin-bottom:0.357rem;
          &:last-child{
            margin-bottom:0;
          }
        }
      }
      .title{
        display:block;
        text-align:left;
        font-size:1.29rem;
        background-color:white;
        white-space:nowrap;
      }
      .group-btn{
        padding-top:1.43rem;
        padding-left:1.25rem;
        padding-right:1.25rem;
        padding-bottom:1.79rem;
        border-top:1px solid #e0e0e0;
        button{
          border-radius:0.143rem;
          border:1px solid #e0e0e0;
          color:#9da2a6;
          padding:1.04rem 1.79rem;
          font-size:0.93rem;
          &.selected{
           border:1px solid #c8161e;
           color:#c8161e;
         }
       }
       background-color:white;
       display:flex;
       flex-direction:row;
       justify-content:space-between;
     }
   }
   
 }
</style>
