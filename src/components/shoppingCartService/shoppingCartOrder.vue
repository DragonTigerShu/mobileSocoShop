<template>
  <div class="shoppingCartOrder">
    <mHead :title="'用户结算'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <div class="title">选择地址</div>
      <ul class="address" @click="goAddress">
        <li><img :src="imgLocate"></li>
        <li class="address-content" v-if="selectAddressData['consignee']">
          <div>
            <p>{{selectAddressData['consignee']}}</p>
            <p>{{selectAddressData['mobile']}}</p>
          </div>
          <p>{{selectAddressData['pname']}} {{selectAddressData['xname']}} {{selectAddressData['zname']}}</p>
        </li>
        <li v-else><p>请选择收货地址</p></li>
        <li><img :src="imgRight" style="width:1.04rem;"></li>
      </ul>
      <div class="goodsTitle"><p>商品列表</p><p v-if="scData">共{{scData.length}}件商品</p></div>
      <gOLi name="goodsListContentLi" v-for="(d,index) in scData" :index="index" :key="index" :data="d" >
      </gOLi>
      <ul class="order-list">
        <li>
          <h1>支付方式</h1>
          <p>在线支付(支付宝,微信支付)</p>
        </li>
        <li @click="goInvoice">
          <h1>发票</h1>
          <div>{{invName}}</span><img :src="imgRight" style="margin-left:0.714rem;"></div>
        </li>
        <li>
          <h1>商品金额</h1>
          <p>{{total}}元</p>
        </li>
        <li>
          <h1>运费</h1>
          <p>{{shippingFee}}元</p>
        </li>
      </ul>
    </content>
    <div style="height:7.714rem"></div>
    <footer>
      <ul class="shopping-footer">
        <li><p>应付总额:<span>{{pay.toFixed(2)}}</span>元</p></li>
        <li><button @click="goPay">提交订单</button></li>
      </ul>
    </footer>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import goodsListContentOrderLi from '@/components/shoppingCartService/goodsListContentOrderLi.vue';
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  var $data = {
    'invName':'',
    'selectAddressData':{},
    'scData':[],
    'total':0,
    'pay':0,
    'shippingFee':0,
    'imgLocate':require('../../common/images/main/locate.png'),
    'imgRight':require('../../common/images/main/right.png'),
  }
  var $this = {}
  export default {
    name: 'shoppingCartOrder',
    data () {
      $this = this
      return $data
    },
    beforeRouteLeave(to, from, next) {
      this.$emit("appListen",'loading',false);
      next();
    },
    created:function(){
      window.scrollTo(0,0);
      if($invType==3){
        this.invName = '增值税专用发票';
      }else if($invType==2){
        this.invName = '普通纸质发票(公司)';
      }else{
        this.invName = '普通纸质发票(个人)';
      }
      this.initOrder();
    },
    props:{

    },
    watch:{
      
    },
    mounted:function(){
      
    },
    methods:{
      initOrder:function(){
        $this.total=0;
        $this.pay=0;
        $this.scData=[];
        $this.total=0;
        $this.$emit('appListen','loading',true);
        axios({
          method:'post',
          url: $basePath+'?c=Cart&m=getCarts',
          data:{}
        })
        .then((response) => {
        //console.log(response.data.data);
        $this.$emit('appListen','loading',false);
        switch(parseInt(response.data.code)){
          case 1000500 :{
            $cart=response.data.data;
            $this.scData=[];
            if($cart.list.length!=0){
              for(var i=0;i<$cart.list.length;i++){
                if($cart.list[i].selected==1){
                  $this.scData.push($cart.list[i]);
                }
              }
            }
            if($this.scData.length==0){
              mui.alert('购物车内无可结算商品');
              $this.$router.push({path:'/shoppingCart/Service'});
              return false;
            }
            $this.total=$cart.totalPrice;
            $this.pay=($this.total*100+$this.shippingFee*100)/100;
            $this.getListByUser();
            break;
          }
          case 1000510 :break;
          case 1000520 :break;
          case 888 : $this.$router.push({path:'/shoppingCart/Service'});break;
        }
      })
        .catch(function (error) {
          $this.$emit('appListen','loading',false);
        //console.log(error);
      });
      },
      selectAddressListen:function($addressId){
        var recIds=[];
        for(var i=0;i<$this.scData.length;i++){
          recIds.push($this.scData[i]['rec_id']);
        }
        $this.$emit("loading",true);
      axios({   //现实省会城市信息
        method:'post',
        url: $basePath+'?c=Order&m=getShippingFeeByUser',
        data:{
          rec_ids:recIds,
          address_id:$selectAddress
        }
      })
      .then((response) => {
        $this.$emit("loading",false);
        switch(parseInt(response.data.code)){
          case 1100100:{
            $this.shippingFee=response.data.data.shippingFee;
            $this.pay=parseFloat($this.total)+parseFloat($this.shippingFee);
            break;
          }
          case 888 :$user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
          default:mui.alert('服务器忙<br/>请稍后重试');
        }
      })
      .catch(function (error) { 
        $this.$emit("loading",false);
          //console.log(error);
        });
    },
    getListByUser:function(){
      $this.selectAddressData={};
      $this.$emit('appListen','loading',true);
      axios({   //获取地址
        method:'post',
        url: $basePath+'?c=UserAddress&m=getListByUser',
      })
      .then((response) => {
        $this.$emit('appListen','loading',false);
        if(parseInt(response.data.code)==600230){
          if(response.data==null||response.data=='')return false;
          var data=[];
          var length= Object.keys(response.data.data).length;
          for(var i=0;i<length-1;i++){
            if($selectAddress==0){
              if(parseInt(response.data.data[i].is_default)==1){
                $selectAddress=response.data.data[i]['address_id'];
                $this.selectAddressData=response.data.data[i];
              }
            }else{
              if(response.data.data[i]['address_id']==$selectAddress){
                $this.selectAddressData=response.data.data[i];
              }
            }
          }
          $this.selectAddress=$selectAddress;
          if($selectAddress!=0){
            $this.selectAddressListen($selectAddress);
          }
        }else if(parseInt(response.data.code)==888){
          $user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});
        }else{
          mui.alert('服务器忙<br/>请稍后重试');
        }
      })
      .catch(function (error){
        $this.$emit('appListen','loading',false);
        //console.log(error);
      });
    },
    goBack:function(){
      $this.$router.push({path:'/shoppingCart/Service'});
    },
    goPay:function(){
      var data={};
      if($selectAddress==0){
        mui.alert('请选择收货地址');
        return false;
      }
      switch(parseInt($invType)){
        case 1:{
          data={
            'addressId':$selectAddress, 
            'invType':0,
            'invPayee':$invPayee,
            'coName':'',
            'coIdentNo':'',
            'dep_bank':'',
            'dep_bank_no':'',
            'regAddress':'',
            'reg_number':'',
          }
          break;
        }
        case 2:{
          data={
            'addressId':$selectAddress, 
            'invType':0,
            'invPayee':'',
            'coName':$coName,
            'coIdentNo':$coIdentNo,
            'dep_bank':'',
            'dep_bank_no':'',
            'regAddress':'',
            'reg_number':'',
          }
          break;
        }
        case 3:{
          data={
            'addressId':$selectAddress, 
            'invType':1,
            'invPayee':'',
            'coName':$coName,
            'coIdentNo':$coIdentNo,
            'dep_bank':$depBank,
            'dep_bank_no':$depBankNo,
            'regAddress':$regAddress,
            'reg_number':$regNumber,
          }
          break;
        }
      }
      $this.$emit("appListen","loading",true);
      axios({
        method:'post',
        url: $basePath+'?c=Order&m=addOrder',
        data:data
      })
      .then((response) => {
          //console.log(response.data.data);
          $this.$emit("appListen","loading",false);
          switch(parseInt(response.data.code)){
            case 1100100 :{
              $this.$router.push({name:'/shoppingCart/Pay',params:{id:response.data.data.order_id}});
              $selectAddress=0;
              window.scrollTo(0,0);
              break;
            }
            case 1100105 :{
              mui.alert('非常抱歉<br>部分商品已下架<br>请返回移除下架商品');break;
            }
            case 1100106 :{
              mui.alert('提交订单失败<br>收货地址已失效<br>请刷新页面重试');break;
            }
            case 1100116 :{
              mui.alert("部分商品库存数量不足<br>无法提交订单");break;
            }
            case 1100107 :{
              mui.alert("非常抱歉<br>部分商品当前地址无法配送<br>无法提交订单");break;
            }
            case 888 :$user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            default :mui.alert('服务器忙<br/>请稍后重试');break;
          }
        })
      .catch(function (error) {
          //console.log(error);
        });
    },
    goAddress:function(){
      $this.$router.push({path:'/shoppingCart/Address'});
    },
    goInvoice:function(){
      $this.$router.push({path:'/shoppingCart/Invoice'});
    }
  },
  components:{
    'gOLi':goodsListContentOrderLi,
    'mHead':mHead
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .shoppingCartOrder{
    footer{
      z-index:9999;
      position:fixed;
      background-color:white;
    }
    p{
      color:#333333;
      font-size:1.07rem;
      margin-bottom:0;
    }
    content{
      display:block;
      background-color: #f7f7f7;
      .title{
        display:block;
        text-align:left;
        font-size:1.29rem;
        padding:1.07rem 1.25rem;
        background-color:white;
        border-bottom:1px solid #e0e0e0;
      }
      .address{
        display:flex;
        background-color:white;
        justify-content: space-between;
        align-items:center;
        padding:2.14rem 1.25rem;
        height:8.93rem;
        margin-bottom: 1.07rem;
        .address-content{
          padding: 0 1.07rem;
          img{
            padding:0 2.14rem;
          }
          display:flex;
          flex-direction:column;
          div{
            display:flex;
            flex-direction:row;
            margin-bottom:1.07rem;
          }
          p{
            padding:0 1.07rem;
            margin-bottom:0;
          }
        }
      }
      .goodsTitle{
        display:flex;
        justify-content:space-between;
        background-color:white;
        padding:1.43rem 1.25rem 0.36rem 1.25rem;
        p{
          font-size:1.29rem;
        }
      }
    }
    .order-list{
      margin-top:1.07rem;
      background-color:#f7f7f7;
      flex-direction:column;
      display:flex;
      align-items: center;
      bottom:0;
      width:100%;
      div{
        display:flex;
        align-items: center;
        color:#9da2a6;
        font-size:1.29rem;
      }
      h1{
        font-size:1.29rem;
        color:#333333;
        margin:0;
      }
      img{
        width:1.07rem;
      }
      >li{
        padding:1.79rem 1.25rem;
        font-size:0.714rem;
        background:white;
        width:100%;
        margin-bottom:1.07rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:first-child{
          display:block;
          p{
            margin-top:0.714rem;
            font-size:0.928rem;
            color:#9da2a6;
          }
        }
        &:nth-child(3){
          margin-bottom:0;
          padding-bottom:0
        }
        &:nth-child(4){
          margin-bottom:0;
        }
        p{
          color:#c8161e;
          font-size:1.29rem;
        }
      }
    }
    .shopping-footer{
      border-top:1px solid #e0e0e0;
      background-color:#f7f7f7;
      flex-direction:column;
      position:fixed;
      display:flex;
      align-items: center;
      bottom:0;
      width:100%;
      p{
        font-size:1.29rem;
        color:#333333;
        text-align:right;
      }
      >li{
        background:white;
        width:100%;
        height:3.57rem;
        &:first-child{
          padding:1.07rem 1.25rem;
          height:auto;
          p{
            color:#333333;
            font-size:1.29rem;
            margin-bottom:0;
            text-align: right;
            display: flex;
            justify-content:flex-end;
            span{
              font-size:1.29rem;
              color:#c8161e;
              display:block;
              width:6rem;
            }
          }
        }
      }
      button{
        background-color:#c8161e;
        color:#ffffff;
        font-size:1.1rem;
        height:100%;
        width:100%;
      }
    }
    
  }
</style>
