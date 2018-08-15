<template>
  <div class="payList">
    <ul>
      <li @click="clickListen(1)"><img :src="aliPay"><p>支付宝支付</p><img v-if="parseInt(selected)==1" :src="imgPick"></li>
      <li  @click="clickListen(2)"><img :src="wechat"><p>微信支付</p><img v-if="parseInt(selected)==2" :src="imgPick"></li>
    </ul>
    <footer>
      <button @click="goFinish">
        立即支付
      </button>
    </footer>
  </div>
</template>
<script>
  import axios from 'axios'
  var $data = {
    imgPick:require("../../common/images/main/checkbox-checked.png"),
    aliPay:require("../../common/images/main/aliPay.png"),
    wechat:require("../../common/images/main/wechat.png"),
    selected:1
  }
  var $this = {}
  export default {
    name: 'payList',
    data () {
      $this = this
      return $data
    },
    props:{
      orderSn:String,
      orderId:String,
      url:String
    },
    created:function(){
      
    },
    mounted:function(){

    },
    watch:{
      
    },
    methods:{
      isWeiXin:function() {
        var ua = window.navigator.userAgent.toLowerCase();
      console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
      } else {
        return false;
      }
    },
    clickListen:function($selected){
      $this.selected=$selected;
    },
    goFinish:function(){
      switch(parseInt($this.selected)){
        case 1:{//支付宝
          $this.AliPayListen();
          break;
        }
        case 2:{
          $this.WeChatListen();
          break;
        }
      }
      //$this.$router.push({path:'/shoppingCart/Success'});
    },
    AliPayListen:function(){
      if(this.orderId!=null){
        if(this.  isWeiXin()){
          $this.$emit('appListen','loading',true);
          axios({
            method:'post',
            dataType:'json',
            url: $basePath+'?c=Pay&m=payAliAft',
            data:{
            'returnGoodsId':this.orderId,//正式环境使用
            "return_url" : $hostUrl+'/#/'+this.url+this.orderId
          }
        })
          .then((response) => {
            $this.$emit('appListen','loading',false);
            var data=response.data;
            if(data.status == 'error')
            {
              alert(data.msg);
            }
            else
            {
              window.localStorage.setItem("alipay",data.data.alipay_res);
              window.location.href = $hostUrl+'/pay.html';
            }
          })
          .catch(function (error) {
            $this.$emit("appListen","loading",false);
            //console.log(error);
          });
        }else{
          var newWin = window.open('about:blank');
          newWin.document.body.innerHTML = '速珂带你去支付宝支付,请不要关闭页面...';
          axios({
            method:'post',
            dataType:'json',
            url: $basePath+'?c=Pay&m=payAliAft',
            data:{
            'returnGoodsId':this.orderId,//正式环境使用
            "return_url" : $hostUrl+'/#/'+this.url+this.orderId
          }
        })
          .then((response) => {
            var data=response.data;
            if(data.status == 'error')
            {
              alert(data.msg);
            }
            else
            {
              window.localStorage.setItem("alipay",data.data.alipay_res);
              newWin.location.href = $hostUrl+'/pay.html';
            }
          })
          .catch(function (error) {
            $this.$emit("appListen","loading",false);
            //console.log(error);
          });
        }
      }
    },
    WeChatListen:function(){
      if(this.orderId!=null){
        if(this.isWeiXin()){
          window.location.href = 'http://wx.supersoco.com/scshop/server/index.php?c=Pay&m=payWeAft&returnGoodsId='+this.orderId+'&key='+$user.auid;
        }else{
          var newWin = window.open('about:blank');
          newWin.document.body.innerHTML = '速珂带你去微信支付,请不要关闭页面...';
          newWin.location.href = 'http://wx.supersoco.com/scshop/server/index.php?c=Pay&m=payWeAft&returnGoodsId='+this.orderId+'&key='+$user.auid;
        }
      }
    },
  },
  components:{

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .payList{
    ul{
      margin-bottom:1.07rem;
      padding:0 1.25rem;
      li{
        display:flex;
        justify-content:flex-start;
        align-items:center;
        background-color:#f5f5f5;
        border-radius:0.142rem;
        margin-top:1.07rem;
        height:3.57rem;
        position:relative;
        padding:0 1.25rem;
        p{
          margin:0 1.79rem;
          margin-bottom:0;
          font-size:1.07rem;
          color:#333333;
          flex:1;
        }
        img{
          &:first-child{
          }
          &:last-child{
            width:1.07rem;
            height:1.07rem;
            border-radius:2rem;
          }
        }
      }
    }
    footer{
      width:100%;
      display:flex;
      justify-content:center;
      align-items:center;
      padding:0 1.04rem;
      margin-bottom:1.07rem;
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
    }
  }
</style>
