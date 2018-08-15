<template>
  <div class="shoppingCartFail">
    <mHead @clickListen="goBack"></mHead>
    <div style="height:3.2rem;"></div>
    <content>
      <section>
        <img :src="imgInform">
        <h1>支付失败了...</h1>
      </section>
    </content>
    <footer>
      <button>
        查看订单
      </button>
      <p>注意：&nbsp;soco速珂平台及销售商不会已订单异常，系统升级为由要求您点击任何网址链接进行退款操作。</p>
    </footer>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  var $data = {
    'imgInform':require('../../common/images/main/inform.png')
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
    created:function(){
      window.scrollTo(0,0);
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      goBack:function(){
        $this.$router.push({path:'/shoppingCart/Pay'});
      }
    },
    components:{
      'mHead':mHead
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .shoppingCartFail{  
    header{
      padding:0 1.04rem;
      height:3.57rem;
      z-index:9999;
      position:fixed;
      background-color:white;
    }
    content{
      margin-top:5.714rem;
      display:block;
      background-color:#f7f7f7;
      section{
        display:flex;
        flex-direction: column;
        justify-content:center;
        align-items: center;
        background-color:white;
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
      justify-content:center;
      align-items:center;
      flex-direction: column;
      margin-top:5.714rem;
      padding:0 1.04rem;
      .group{
        width:100%;
        display:flex;
        background-color:white;
        flex-direction:row;
        padding:0 1.07rem 1.07rem 1.07rem;
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
