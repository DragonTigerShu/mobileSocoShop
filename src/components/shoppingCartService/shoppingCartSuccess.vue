<template>
  <div class="shoppingCartSuccess">
    <Header></Header>
    <div style="height:3.2rem;"></div>
    <content>
      <section>
        <img :src="imgOk">
        <h1>支付成功!</h1>
      </section>
    </content>
    <footer>
      <section>
        <div class="group">
          <label>支付金额:</label><p style="color:#c8161e">{{data['order_amount']}}元</p>
        </div>
        <div class="group">
          <label>支付方式:</label><p>{{data['pay_name']}}支付</p>
        </div>
      </section>
      <button @click="goOrder">查看订单</button>
      <p>注意：&nbsp;soco速珂平台及销售商不会已订单异常，系统升级为由要求您点击任何网址链接进行退款操作。</p>
    </footer>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
import Header from '@/components/header/header.vue'; //头部信息
import axios from 'axios'
import mui from '../../../static/mui.js'
var $data = {
  'imgOk':require('../../common/images/main/ok.png'),
  'orderId':0,
  'data':{}
}
var $this = {}
export default {
  name: 'shoppingCartSuccess',
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
    this.orderId =  this.$route.params.id;
    window.scrollTo(0,0);
    if(this.orderId!=0){
      this.$emit("appListen","loading",true);
      axios({
        method:'post',
        url: $basePath+'?c=Order&m=userOrderDetail',
        data:{
          orderId:this.orderId
        }
      })
      .then((response) => {
        //console.log(response.data.data);
        this.$emit("appListen","loading",false);
        switch(parseInt(response.data.code)){
          case 1100100 :{
            $this.data=response.data.data;
            if($this.data['pay_status']==0){
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
    }else{
      $this.$router.push({path:'/'});
    }
  },
  mounted:function(){
  },
  watch:{
    
  },
  methods:{
    goOrder:function(){
      if(this.orderId==0){
        $this.$router.push({path:'/info/order'});
      }else{
        $this.$router.push({name: 'info_order_details',params:{id:this.orderId}});
      }
    }
  },
  components:{
    'Header':Header
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .shoppingCartSuccess{
    header{
      padding:0 1.25rem;
      height:3.57rem;
      z-index:9999;
      position:fixed;
      background-color:white;
    }
    content{
      margin-top:2.86rem;
      padding-bottom:1.07rem;
      display:block;
      background-color:#f7f7f7;
      section{
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items: center;
        background-color:white;
        padding-bottom: 2.5rem;
        img{
        }
        h1{
          font-size:1.29rem;
          color:#333333;
          margin:1.79rem 0 0 0;
          letter-spacing: 0.1rem;
          color:#444444;
        }
      }
    }
    footer{
      width:100%;
      display:flex;
      padding:0 1.25rem;
      justify-content:flex-start;
      align-items:flex-start;
      flex-direction: column;
      margin-top:1.43rem;
      section{
        padding:1.79rem 0 3.21rem 0;
      }
      .group{
        width:100%;
        display:flex;
        background-color:white;
        label{
          font-size:1.07rem;
          color:#333333;
          width:6.8rem;
        }
        p{
          font-size:1.07rem;
          color:#333333;
          margin:0;
        }
      }
      button{
        box-sizing:border-box;
        width:100%;
        height:3.21rem;
        font-size:1.29rem;
        line-height:1.285rem;
        color:#fff;
        background:#c8161e;
        border:none;
        border-radius:4px;
        letter-spacing:1px;
      }
      p{
        font-size:0.929rem;
        color:#9da2a6;
        margin-top:1.79rem;
      }
    }
    
  }
</style>
