<template>
  <section class="afterSaleOrderReturn">
    <m-head :title="title" @clickListen="goBack">
     <div slot="main-right" class="main">{{tille_tel}}</div>
   </m-head>
   <div class="after_order" v-if="data['return_goods_info']">
    <div class="after_seller">
     <h4>{{orderTypeArray[orderType]}}</h4>
     <p><span>售后单号:</span>{{data['return_goods_info']['return_order_sn']}}</p>
   </div>
   <div class="address">
    <div class="address_center">
     <small>收货单位:</small>
     <small>速珂智能科技(上海)有限公司</small>
   </div>
   <div class="address_center">
     <small>联系电话:</small>
     <small>+86 02159845308</small>
   </div>
   <div class="address_center">
     <small>换货地址:</small>
     <small>上海市青浦区沪青平公路3938号移动智地72-2楼139-140室</small>
   </div>
 </div>
 <div class="logistics" :class="expressDisabled?'disabled':''">
  <h3>填写物流信息</h3>
  <div class="logistics_company">
    <small>物流公司*</small>
    <select id="express" v-model="expressCode" :class="{'selected-style':expressCode,'default-style':!expressCode,'disabled-style':expressDisabled}" :disabled="expressDisabled">
      <option value="">请选择物流公司</option>
      <option v-if="expressList.length>0" v-for="(d,index) in expressList" :value="d.express_code">{{d.express_name}}</option>
    </select>
  </div>
  <div class="logistics_No">
    <small>物流单号*</small><input v-model="expressSn" type="text" max-length="50" placeholder="请选择物流单号" :disabled="expressDisabled">
  </div>  
</div>
<div class="apply_for">
  <div v-if="data['return_goods_info']['status']==1" class="apply_for_left" @click="cancelOrder">撤销申请</div>
  <div v-if="data['return_goods_info']['status']==1||data['return_goods_info']['status']==2" class="apply_for_right" @click="clickListen">{{btnText}}</div>
</div>
</div>
</section>
</template>
<script>
  import m_head from '../../components/common/m-head.vue'
import sheet_service from '../../components/order/info_sheet_service.vue'  //服务订单详情
import axios from 'axios'
import mui from '../../../static/mui.js'
let $data ={
  title :'售后订单',
  tille_tel:'客服电话',
  orderType:'',
  orderTypeArray:['已完成','待审核','未通过','买家已取消','待商家退款','待买家寄回','待商家收货','商家已收货,准备发货中','商家已收货,待退款','商家已发货','商家同意换货,待买家付款'],
  btnText:'提交',
  id:0,
  expressList:[],
  expressSn:'',
  expressCode:'',
  expressDisabled:true
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
  beforeRouteLeave(to, from, next) {
    this.$emit("appListen",'loading',false);
    next();
  },
  beforeRouteUpdate(to, from, next) {
    next(false);
  },
  created(){
    this.id=this.$route.params.id;
    this.baseHead=$baseHead;
    if(this.data['return_goods_info']==null||this.data['return_goods_info']==''){
      this.$router.push({name:'/afterSaleOrder/check',params:{'id':this.id}});
    }else{
      //-1审核不通过，-2用户取消，0待审，1通过，2买家已发货，3商家已收货，4商家已发货，5已完成
      switch (parseInt(this.data['return_goods_info']['type'])){
        case 0:{//退货退款
          switch (parseInt(this.data['return_goods_info']['status'])){
            case -2:$this.orderType=3;break;//已取消
            case -1:$this.orderType=2;break;//未通过
            case 0:$this.orderType=1;break;//待审核
            case 1:$this.orderType=5;break;//通过=>待寄回
            case 2:$this.orderType=6;break;//买家已发货=>待商家收货
            case 3:$this.orderType=8;break;//商家已收货=>商家已收货,准备发货中
            case 5:$this.orderType=0;break;//已完成=>已完成
          }
          break;
        }
        case 1:{//换货
          switch (parseInt(this.data['return_goods_info']['status'])){
            case -2:$this.orderType=3;break;//已取消
            case -1:$this.orderType=2;break;//未通过
            case 0:$this.orderType=1;break;//待审核
            case 1:{
              if(parseInt(this.data['return_goods_info']['is_need_paid'])){
                if(parseInt(this.data['return_goods_info']['is_paid']))
                  $this.orderType=5;//已支付
                else
                  $this.orderType=10;//未支付
              }else{
                $this.orderType=5;
              }
              break;
            }//通过=>待寄回
            case 2:$this.orderType=6;break;//买家已发货=>待商家收货
            case 3:$this.orderType=7;break;//商家已收货=>商家已收货,准备发货中
            case 4:$this.orderType=9;break;//商家已发货=>商家已发货
            case 5:$this.orderType=0;break;//已完成=>已完成
          }
          break;
        }
        case 2:{//仅退款
          switch (parseInt(this.data['return_goods_info']['status'])){
            case -2:$this.orderType=3;break;//已取消
            case -1:$this.orderType=2;break;//未通过
            case 0:$this.orderType=1;break;//待审核
            case 1:$this.orderType=4;break;//待退款
            case 5:$this.orderType=0;break;//已完成=>已完成
          }
          break;
        }
      }
      this.getExpressList();
      if(this.data['return_goods_info']['buyer_delivery']!=''&&this.data['return_goods_info']['buyer_delivery']!=null){
        var json =JSON.parse(this.data['return_goods_info']['buyer_delivery']);
        this.expressSn=json.express_sn;
        this.expressCode=json.express_code;
        this.expressDisabled=true;
        $this.btnText='修改';
      }else{
        this.expressDisabled=false;
      }
    }
  },
  methods: {
    getExpressList:function(){
      $this.$emit("appListen","loading",true);
      axios({
        method:'post',
        url: $basePath+'?c=Express&m=getExpressList',
        data:{
          'type':1,
          'page':1,
          'limit':20
        }
      })
      .then((response) => {
        $this.$emit("appListen","loading",false);
        switch(parseInt(response.data.code)){
          case 2300100 :{
            $this.expressList=response.data.data;
            break;
          }
          case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
          default :$this.$router.push({path:'/'});window.scrollTo(0,0);mui.alert('服务器忙<br/>请稍后重试');break;
        }
      })
      .catch(function (error) {
        $this.$emit("appListen","loading",false);
        $this.appListen("inform","服务器忙,请稍后重试");
          //console.log(error);
        });
    },
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
    cancelOrder:function(){
      var btn = ["确认","取消"];
      mui.confirm('确认取消当前售后申请吗?','取消当前售后',btn,function(e){
        if(e.index==0){
          $this.$emit("appListen","loading",true);
          axios({
            method:'post',
            url: $basePath+'?c=ReturnGoods&m=cancelReturnGoods',
            data:{
              'returnGoodsId':id,
            }
          })
          .then((response) => {
            $this.$emit("appListen","loading",false);
            //console.log(response.data.data);
            $this.initOrder();
            switch(parseInt(response.data.code)){
              case 1600100 :{
                mui.alert('撤销成功');
                $this.$router.push({name:'/afterSaleOrder/check',params:{'id':$this.id}});
                window.scrollTo(0,0);
                break;
              }
              case 1600105:{
                mui.alert('当前售后申请已经撤销');
                $this.$router.push({name:'/afterSaleOrder/check',params:{'id':$this.id}});
                window.scrollTo(0,0);
                break;
              }
              case 1600106:{
                mui.alert('当前售后申请无法取消');
                $this.$router.push({name:'/afterSaleOrder/check',params:{'id':$this.id}});
                window.scrollTo(0,0);
                break;
              }
              case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
              default :mui.alert('服务器忙<br/>刷新重试');break;
            }
          })
          .catch(function (error){
            $this.$emit("appListen","loading",false);
            //console.log(error);
          });
        }
      });
    },
    clickListen:function(){
      if(!$this.expressDisabled){
        if($this.expressCode==''){
          mui.toast('请选择物流公司',{ duration:'short', type:'div' });
          return false;
        }
        if($this.expressSn==null||$this.expressSn==''){
          mui.toast('请填写物流单号',{ duration:'short', type:'div' });
          return false;
        }
        var  myselect=document.getElementById("express");
        var index=myselect.selectedIndex ; 
        myselect.options[index].text;
        $this.$emit("appListen","loading",true);
        axios({
          method:'post',
          url: $basePath+'?c=ReturnGoods&m=saveExchangeGoods',
          data:{
            'returnGoodsId':$this.id,
            'expressName':myselect.options[index].text,
            'expressSn':$this.expressSn,
            'expressCode':$this.expressCode
          }
        })
        .then((response) => {
          //console.log(response.data.data);
          $this.$emit("appListen","loading",false);
          switch(parseInt(response.data.code)){
            case 1600100 :{
              mui.alert('提交成功');
              $this.$router.push({name:'/afterSaleOrder/check',params:{'id':$this.id}});
              break;
            }
            case 888 :$this.$emit("appListen","loginAgain");break;
            default :$this.$router.push({name:'/afterSaleOrder/check',params:{'id':$this.id}});$this.$emit("appListen","inform","服务器忙,请稍后重试");break;
          }
        })
        .catch(function (error) {
          $this.$emit("appListen","loading",false);
          //console.log(error);
        });
      }else{
        $this.expressDisabled=false;
        $this.btnText='提交';
      }
    },
    goBack:function(){
      $this.$router.push({path:'/after_sale_order'});
    }
  },
  components:{
    'm-head':m_head,
    'sheet_service':sheet_service
  }
}
</script>
<style lang="scss">
  .afterSaleOrderReturn{
    background: #f5f5f5;
    select{
      height:45px;
      border-radius:3px;
      option{
        color:#333333;
        &:first-child{
          display:none;
        }
      }
      &.default-style{
        color:#9DA2A6;
      }
      &.selected-style{
        color:#333333;
      }
      &.disabled-style{
        background:#f5f5f5;
      }
    }
    .logistics{
      padding: 1.2rem 1rem;
      &.disabled{
        input{
          background:#f5f5f5;
          color:#9da2a6;
        }
      }
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
