<template>
  <div class="order_details_edit">
    <mHead :title="'编辑订单'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <div class="title">选择地址</div>
      <ul class="address" @click="goAddress">
        <li><img :src="imgLocate"></li>
        <li class="address-content">
          <div>
            <p>{{selectAddressData['consignee']}}</p>
            <p>{{selectAddressData['mobile']}}</p>
          </div>
          <p>{{selectAddressData['pname']}} {{selectAddressData['xname']}} {{selectAddressData['zname']}}</p>
        </li>
        <li><img :src="imgRight" style="width:1.04rem;"></li>
      </ul>
      <div class="goodsTitle"><p>商品列表</p><p v-if="data">共{{data.length}}件商品</p></div>
      <div class="goodsListContentLi" v-for="(d,index) in data" :index="index" :key="index">
        <ul>
          <li><img :src="baseHead+d.goods_thumb"></li>
          <li class="goodsListContentLi-content">
            <p>{{d.goods_name}} {{d.spec_key_name}}</p>
            <span></span>
            <div class="goodsListContentLi-content-footer">
              <span>￥{{d.goods_price}}</span><span>X{{d.goods_number}}</span>
            </div>
          </li>
        </ul>
      </div>
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
          <p>{{detailData.goods_amount}}元</p>
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
        <li><button @click="edit">确认修改</button></li>
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
    'baseHead':'',
    'invName':'',
    'selectAddressData':{},
    'detailData':{},
    'orderId':'',
    'data':{},
    'shippingFee':{},
    'pay':0,
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
    created:function(){
      window.scrollTo(0,0);
      this.baseHead=$baseHead;
      this.orderId=this.$route.params.id;
      this.initOrder();
    },
    mounted:function(){
    },
    beforeRouteLeave(to, from, next) {
      this.$emit("appListen",'loading',false);
      next();
    },
    methods:{
      selectAddressListen:function($addressId){
        $this.$emit("loading",true);
      axios({   //现实省会城市信息
        method:'post',
        url: $basePath+'?c=Order&m=getShippingFeeByUserEdit',
        data:{
          order_id:$this.orderId,
          address_id:$selectAddress
        }
      })
      .then((response) => {
        $this.$emit("loading",false);
        switch(parseInt(response.data.code)){
          case 1100100:{
            $this.shippingFee=response.data.data.shippingFee;
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
          $this.detailData=response.data.data;
          $this.data=response.data.data.order_goods_list;
          if($selectAddress==0){
            $selectAddress=parseInt($this.detailData['address_id']);
          }
          $this.getListByUser();
          $this.shippingFee=$this.detailData['shipping_fee'];
          $this.pay=parseFloat($this.detailData['total_amount']);
          if($invFlag){
            $invFlag=false;
            if($this.detailData['inv_type']==0){
              if($this.detailData['inv_payee']!=null&&$this.detailData['inv_payee']!=''){
                $invPayee=$this.detailData['inv_payee'];
                $this.invName = '普通纸质发票(个人)';
                $invType=1;
              }else{
                $coName=$this.detailData['co_name'];
                $coIdentNo=$this.detailData['co_ident_no'];
                $this.invName = '普通纸质发票(公司)';
                $invType=2;
              }
            }else{
              $coName=$this.detailData['co_name'];
              $coIdentNo=$this.detailData['co_ident_no'];
              $depBankNo=$this.detailData['dep_bank_no'];
              $depBank=$this.detailData['dep_bank'];
              $regAddress=$this.detailData['reg_address'];
              $regNumber=$this.detailData['reg_number'];
              $this.invName = '增值税专用发票';
              $invType=3;
            }
          }else{
            switch(parseInt($invType)){
              case 1:$this.invName = '普通纸质发票(个人)';break;
              case 2:$this.invName = '普通纸质发票(公司)';break;
              case 3:$this.invName = '增值税专用发票';break;
            }
          }
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
    goBack:function(){
      $this.$router.push({name: 'info_order_details',params:{id:this.orderId}});
      window.scrollTo(0,0);
    },
    edit:function(){
      var data={};
      switch(parseInt($invType)){
        case 1:{
          data={
            'orderId':this.orderId,
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
            'orderId':this.orderId,
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
            'orderId':this.orderId,
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
        url: $basePath+'?c=Order&m=saveEditOrder',
        data:data
      })
      .then((response) => {
          //console.log(response.data.data);
          $this.$emit("appListen","loading",false);
          switch(parseInt(response.data.code)){
            case 1100100 :{
              mui.alert('编辑信息成功');
              $this.$router.push({name:'info_order_details',params:{id:$this.orderId}});
              window.scrollTo(0,0);
              break;
            }
            case 1100106:{
              mui.alert('已付款订单生效不可编辑');
              $this.$router.push({name:'info_order_details',params:{id:$this.orderId}});
              window.scrollTo(0,0);
              break;
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
      $this.$router.push({name:'info_order_details_address',params:{orderId:this.orderId}});
    },
    goInvoice:function(){
      $this.$router.push({name:'order_details_Invoice',params:{orderId:this.orderId}});
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
  .order_details_edit{
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
      .goodsListContentLi{
        ul{
          display:flex;
          flex-direction:row;
          width:100%;
          background:white;
          padding: 0 1.25rem;
          >li{
            margin:2.14rem 0 2.14rem 0;
            display:flex;
            align-items: center;
            width:auto;
            &:first-child{
              label{
                display: flex;
                font-size:0.714rem;
                align-items: center;
              }
            }
            &.goodsListContentLi-content{
              display:flex;
              flex-direction:column;
              align-items: baseline;
              justify-content: flex-start;
              background:white;
              flex: 1;
              >p{
                font-size:1.07rem;
                color:#333333;
                margin-bottom:0;
                height:auto;
              }
              >span{
                font-size:0.929rem;
                color:#9da2a6;
                margin-top:1.07rem;
              }
              div.goodsListContentLi-content-footer{
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                width: 100%;
                flex:1;
                >span{
                  &:first-child{
                    color:#c8161e;
                  }
                  color:#9da2a6;
                  font-size:1.29rem;
                  height:1.79rem;
                  margin-right:2.14rem;
                }
              }
            }
            >img{
              width:7.14rem;
              height:7.14rem;
              background-color:#f7f7f7;
              margin-right:2.14rem;
            }
          }
        }
      }
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
