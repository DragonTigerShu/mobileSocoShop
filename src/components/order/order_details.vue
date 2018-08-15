<template>
  <section class="order_details">
    <div class="order_details">
      <m-head :title="title" @clickListen="goBack">
        <a slot="main-right" class="main" href="tel:400-021-2008">客服电话</a>
        <!--         <div slot="main-right" class="main">客服电话</div> -->
      </m-head>
      <div class="payment_goods">
        <div>
          <h3>{{orderTypeArray[orderType]}}</h3>
          <template v-if="orderType==2">
            <span v-if="time>0">你还有<em>{{goClock}}</em> 来付款，超时订单自动关闭</span>
            <span v-else>{{transformTime(data.pay_time)}}</span>
          </template>
          <span v-else-if="orderType==2">{{transformTime(data.shipping_time)}}</span>
          <span v-else-if="orderType==3||orderType==0">{{transformTime(data.confirm_time)}}</span>
          <span v-else-if="time!=0">{{transformClock(time)}}</span>
          <span v-else>{{transformTime(data.add_time)}}</span>
        </div>
        <div>
          <i v-if="checkComfirmTime(data)" @click="goAfterSale">申请售后</i>
          <i v-if="data.pay_status==0&&data.order_status==0" @click="goEdit">编辑</i>
        </div>
      </div>
      <div class="goods_list">
        <ul>
          <li>
            <img :src="imgOrder1">
            <h6>递交订单</h6>
            <p>{{transformTime(data.add_time)}}</p>
            <i :class="data.pay_status==1?'active':''" >••••••</i>
          </li>
          <li>
            <img :src="data.pay_status==1?imgOrder2:imgOrder2_2">
            <h6>付款完成</h6>
            <template v-if="data.pay_time&&data.pay_time!=0"><p>{{transformTime(data.pay_time)}}</p></template>
            <i :class="data.order_status==2?'active':''">••••••</i>
          </li>
          <li>
            <img :src="data.order_status>0&&data.shipping_status==1?imgOrder2:imgOrder2_2">
            <h6>等待收货</h6>
            <template v-if="data.confirm_time&&data.confirm_time!=0"><p>{{transformTime(data.confirm_time)}}</p></template>
            <i :class="(data.order_status==3&&data.pay_status==0)||data.order_status==4||data.order_status==5||data.order_status==6||data.order_status==2?'active':''">••••••</i>
          </li>
          <li>
            <template v-if="(data.order_status==3&&data.pay_status==0)||data.order_status==4||data.order_status==5||data.order_status==6||data.order_status==2">
              <img :src="imgOrder2">
              <h6>完成</h6>
              <template v-if="data.confirm_time&&data.confirm_time!=0"><p>{{transformTime(data.confirm_time)}}</p></template>
            </template>
            <template v-else>
              <img :src="imgOrder2_2">
              <h6>完成</h6>
            </template>
          </li>
        </ul>
        <template v-if="data['kd_info']">
          <div class="logistics" :key="data.order_sn">
            <label :class="{'bg-primary':isActive}"  @click="toggle()">物流信息<img :src="avatar"></label>
            <div class="down_active" :class="{'slideleft-active':isActive}" v-show="isActive">
              <ul>
                <template v-if="data['kd_info']['Traces']==null||data['kd_info']['Traces'].length==0">
                  <li>
                    <i></i><span>暂无数据</span>
                  </li>
                </template>
                <template v-else>
                  <li v-for="(child,indexC) in data['kd_info']['Traces']" :key="indexC">
                    <i></i><span>{{child['AcceptTime']}} {{child['AcceptStation']}}</span>
                  </li>
                </template>
              </ul>    
            </div> 
          </div>
        </template>
      </div>
      <!--订单列表-->
      <section>
        <div class="order_detail_list" @click="ulClickListen($event)" v-if="data.order_goods_list"  >
          <div class="order_list_detail">
            <div class="order-top">
              <div class="top-time">
                <span>订单日期 <small>{{transformTime(data.add_time)}}</small><a v-if="data.order_status==0&&data.pay_status==0" href="javascript:;">未支付</a><a v-if="data.pay_status==1" href="javascript:;">已支付</a></span>
              </div>
              <div class="order_No">
                <p>订单编号:{{data.order_sn}}</p>
              </div>
            </div>
            <div class="order-center" v-for="(d,index) in data.order_goods_list" :key="index">
              <ul>
                <li>
                  <i><img :data-id="d.goods_id" :src="baseHead+d.goods_thumb"></i>
                </li>
                <li>
                  <h3>{{d.goods_name}}</h3>
                  <p>{{d.spec_key_name}}</p>
                  <h3>￥{{d.goods_price}}<small>X{{d.goods_number}}</small></h3>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--收货人信息-->
        <div class="information">
          <h3>收货信息</h3>
          <label>
            <span>
              <small>收货对象:</small>
              <small>{{data.consignee}}</small>
            </span>
            <span>
              <small>收货地址:</small>
              <small>{{data.province}} {{data.city}} {{data.area}} {{data.address}}</small>
            </span>
            <span>
              <small>手机号码:</small>
              <small>{{data.mobile}}</small>
            </span>
          </label>
        </div>
        <!--支付信息-->
        <div class="pay_info" v-if="data.pay_status==1">
          <h3>支付信息</h3>
          <label>
            <span>
              <small>支付方式:</small>
              <small>{{data.pay_name}}</small>
            </span>
            <span>
              <small>支付时间:</small>
              <small v-if="data.pay_time!=0&&data.pay_time!=null">{{transformTime(data.pay_time)}}</small>
            </span>
          </label>
        </div>
        <!--快递信息-->
        <div class="pay_info" v-if="data.shipping_status==1">
          <h3>快递信息</h3>
          <label>
            <span>
              <small>快递公司:</small>
              <small>{{data.delivery_list.express_co}}</small>
            </span>
            <span>
              <small>快递单号:</small>
              <small>{{data.delivery_list.express_no}}</small>
            </span>
            <span>
              <small>快递时间:</small>
              <small>{{transformTime(data.delivery_list.add_time)}}</small>
            </span>
          </label>
        </div>
        <!--发票-->
        <div class="receipt" v-if="data.inv_type==0">
          <h3>发票信息</h3>
          <label>
            <span>
              <small>发票类型:</small>
              <small>普通纸质发票</small>
            </span>
            <span v-if="data.inv_payee">
              <small>发票抬头:</small>
              <small>{{data.inv_payee}}</small>
            </span>
            <span v-if="data.co_name">
              <small>公司名称:</small>
              <small>{{data.co_name}}</small>
            </span>
            <span v-if="data.co_ident_no">
              <small>纳税人识别号:</small>
              <small>{{data.co_ident_no}}</small>
            </span>
          </label>  
        </div>
        <div class="receipt" v-if="data.inv_type==1">
          <h3>发票信息</h3>
          <label>
            <span>
              <small>发票类型:</small>
              <small>增值税专用发票</small>
            </span>
            <span>
              <small>公司名称:</small>
              <small>{{data.co_name}}</small>
            </span>
            <span>
              <small>纳税人识别号:</small>
              <small>{{data.co_ident_no}}</small>
            </span>
            <span>
              <small>开户银行:</small>
              <small>{{data.dep_bank}}</small>
            </span>
            <span>
              <small>开户银行账户:</small>
              <small>{{data.dep_bank_no}}</small>
            </span>
            <span>
              <small>注册地址:</small>
              <small>{{data.reg_address}}</small>
            </span>
            <span>
              <small>注册电话:</small>
              <small>{{data.reg_number}}</small>
            </span>
          </label>  
        </div>
        <!--订单金额-->
        <div class="order_amount">
          <h3>订单信息</h3>
          <label>
            <span>
              <small>商品总额:</small>
              <small>{{data.goods_amount}}元</small>
            </span>
            <span>
              <small>运费金额:</small>
              <small>{{data.shipping_fee}}元</small>
            </span>
            <span v-if="data.discount!=''&&data.discount!=0">
              <small>调整金额: </small>
              <small>{{data.discount}}元</small>
            </span>
          </label>  
        </div>
        <!--订单总额-->
        <div class="order_total_sum">
          <h3>总计金额:<span>{{data.total_amount}}</span>元</h3>
        </div>
      </section>
    </div>
    <div class="order_pay">
      <div class="order_total">
        <p>总计金额:</p>
        <span>￥{{data.total_amount}}</span>
      </div>
      <div v-if="data['shipping_status']==0&&(data['order_status']==0)&&data['total_amount']!=0" class="cancel_order" @click="cancelOrder">取消订单</div>
      <div v-if="data['order_status']==0&&data['pay_status']==0" class="go_pay" @click="goPay">去支付</div>
    </div>
  </section>

</template>
<script>
  import m_head from '../../components/common/m-head.vue'
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  let $data={
    title:'订单详情',
    sote:'客服电话',
    isActive: false,
    orderId:'',
    data:{},
    time:0,
    orderType:'',
    orderTypeArray:'',
    avatar:require("../../common/images/order/next.png"),
    'imgOrder1':require('../../common/images/order/icon1.png'),
    'imgOrder1_1':require('../../common/images/order/icon01.png'),
    'imgOrder2':require('../../common/images/order/icon2.png'),
    'imgOrder2_2':require('../../common/images/order/icon02.png'),
    'imgOrder3':require('../../common/images/order/icon3.png'),
    'imgOrder3_3':require('../../common/images/order/icon03.png'),
    'imgOrder4':require('../../common/images/order/icon4.png'),
    'imgOrder4_4':require('../../common/images/order/icon04.png'),
  }
  let $this ={}
  export default {
    data () {
      $this = this 
      return $data 
    },
    created () {
      this.orderId=this.$route.params.id;
      this.baseHead=$baseHead;
      this.orderTypeArray=$orderTypeArray;
      this.initOrderDetail();
    },
    mounted:function(){
      
    },
    computed:{
      goClock:function(){
        return this.transformClock(this.time);
      }
    },
    methods: {
      checkComfirmTime:function(data){
        if((parseInt(data.order_status)==2||parseInt(data.order_status)==4)){
          for(var i=0;i<data.order_goods_list.length;i++){
            if(parseInt(data.order_goods_list[i].receive_time) + 604800 < new Date().getTime()/1000){
              return false;
            }
          }
          return true;
        }else{
          return false;
        }
      },
      ulClickListen:function(e) {
        switch (e.target.nodeName.toLowerCase()){
          case 'img':{
            const index = parseInt(e.target.dataset.id);
            if(!isNaN(index))window.open($hostUrl + '/#/detail/'+index);
            break;
          }
        }
      },
      cancelOrder:function(){
        var btn = ["确定","取消"];
        mui.confirm('可能会失去再次购买的机会','确认取消当前订单',btn,function(e){
          if(e.index==0){
            $this.$emit("appListen","loading",true);
            axios({
              method:'post',
              url: $basePath+'?c=Order&m=cancelOrder',
              data:{
                'orderId':$this.orderId,
              }
            })
            .then((response) => {
              $this.$emit("appListen","loading",false);
              $this.initOrderDetail();
              switch(parseInt(response.data.code)){
                case 1100100 :{
                  $this.flag=false;
                  mui.alert("订单取消成功");
                  break;
                }
                case 1100105:{
                  mui.alert("商品已就绪或已在路上,请直接联系400-021-2008客服售后");
                  break;
                }
                case 1100106:{
                  mui.alert("订单已取消");
                  break;
                }
                case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
                default :mui.alert('服务器忙<br/>请稍后重试');break;
              }
            })
            .catch(function (error) {
              $this.$emit("appListen","loading",false);
              mui.alert('服务器忙<br/>请稍后重试');
            //console.log(error);
          });
          }
        });
      },
      initOrderDetail:function(){
        this.time=0;
        clearInterval(this.clock);
        $this.$emit("appListen","loading",true);
        axios({
         method:'post',
         url: $basePath+'?c=Order&m=userOrderDetail',
         data:{
           'orderId':this.orderId
         }
       })
        .then((response) => {
         //console.log(response.data.data);
         $this.$emit("appListen","loading",false);

         switch(parseInt(response.data.code)){
           case 1100100 :{
             $this.data=response.data.data;
               if($this.data.order_status==0&&$this.data.pay_status==0){//倒计时
                var nowtime=new Date().getTime();
                $this.time=parseInt($this.data.add_time)+86400-parseInt(nowtime/1000);
                if($this.time>0){
                 $this.flag=true;
                 $this.clock = setInterval(function(){
                  $this.time--;
                  if($this.time<=0){
                   clearInterval($this.clock);
                           //$this.cancelOrderInOfNoTime();
                         };
                       }, 1000);
               }else{
                    // $this.cancelOrderInOfNoTime();//已超时订单发送取消订单
                  }
                }
                switch (parseInt($this.data['order_status'])){
                  case 3:{//买家已取消
                   switch(parseInt($this.data['pay_status'])){
                        case 0:$this.orderType=7;break;//未付款=>已取消
                        case 3:$this.orderType=6;break;//已退款=>已退款
                        case 4:$this.orderType=5;break;//拒绝退款=>拒绝退款
                        case 1:;
                        case 2:$this.orderType=4;break;//已付款=>待退款
                      }
                      break;
                    }
                 case 5:$this.orderType=8;//商家已作废
                 case 6:$this.orderType=7;break;//系统取消=>已取消
                 case 2:;//买家收货
                 case 4:$this.orderType=3;break;//已完成=>已收货
                 case 0:{
                   if($this.data['pay_status']==0){
                     $this.orderType=1;//未付款=>待付款
                   }else{
                     $this.orderType=10;//已付款=>备货中
                   }
                   break;
                 }
                 case 1:{
                  if($this.data['shipping_status']==0){
                        $this.orderType=9;//已付款=>待发货
                      }
                      else{
                        $this.orderType=2;//已付款=>待收货
                      }
                      break;
                    }
                  }
                  break;
                }
                case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
                default :$this.$router.push({path:'/'});window.scrollTo(0,0);mui.alert('服务器忙<br/>请稍后重试');break;
              }
            })
        .catch(function (error) {
         $this.$emit("appListen","loading",false);
         //console.log(error);
       });
      },
      toggle:function(){
        $this.isActive = !this.isActive;
        if($this.isActive){
          $this.avatar = require("../../common/images/order/top.png")
        }else{
          $this.avatar = require("../../common/images/order/next.png")
        }
      },
      transformClock:function(timestamp) {
        var h=parseInt(timestamp/60/60);
        var m=parseInt(timestamp/60)%60;
        var s=timestamp%60;
        var str='';
        if(h!=null)str+=h+'小时';
        if(m!=null)str+=m+'分';
        if(s!=null)str+=s+'秒';
        return str;
      },
      transformTime:function(timestamp) {
        if(timestamp==0||timestamp==null)return '';
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
      $this.$router.push({path:'/info/order'});
      window.scrollTo(0,0);
    },
    goAfterSale:function(){
      $selectAddress=0;
      $this.$router.push({name: '/afterSale/afterSaleList',params:{id:$this.orderId}});
      window.scrollTo(0,0);
    },
    goPay:function(){
      $this.$router.push({name:'/info/order/pay',params:{id:$this.orderId}});
      window.scrollTo(0,0);
    },
    goEdit:function(){
      $selectAddress=0;
      $invFlag=true;
      $invType=1;//发票信息
      $invPayee='个人';//发票信息
      $coName='';//发票信息
      $coIdentNo='';//发票信息
      $depBank='';//发票信息
      $depBankNo='';//发票信息
      $regAddress='';//发票信息
      $regNumber='';//发票信息
      $this.$router.push({name:'info_order_details_edit',params:{id:$this.orderId}});
      window.scrollTo(0,0);
    }
  },
  components: {
    'm-head':m_head 
  }
}
</script>
<style lang = "scss">
  .order_details{
    background: #f5f5f5;
    .order_details{
      margin-bottom: 4rem;
      h3{
        font-size: 16px;
        color: #333;
      }
      section{
        .information{
          background: #fff;
          padding: 1rem 1rem 1.2rem 1rem;
          margin-bottom: 1rem;
          label{
            padding-top: 0rem;
            display: inline-block;
            span{
              display: block;
              font-size: 16px;
              small{
                color: #9da2a6;
              }
            }       
          }
        }
        .order_list_detail{
          background: #fff;
          margin-bottom:1rem;
          .order-top{
            padding: 1rem;
          }
          .top-time{
            color: #333;
            span{
              font-size: 16px;
              width: 100%;
              display: flex;
              small{
               font-size: 16px;
               margin-left: .5rem;
             }
             a{
              color: #C8161E;
              flex: 1;
              text-align: right;
              width: 100%;
            }
          }
        }
        .order_No{
         p{
          color: #9da2a6;
        }
      }
      .order-center{
        padding-bottom: 1rem;
        border-top: 1px solid #eee;
        padding-top:1rem;
        ul{
          width: 100%;
          display: flex;
          position: relative;
          overflow: hidden;
          align-items: center;
          padding: 1rem;
          li:nth-of-type(1){
            flex: 1;
            i{
              display: inline-block;
              width: 120px;
              height: 120px;
              background: #f5f5f5;
              >img{
                width: 100%;
                height: 100%;
              }
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
              color: #c8161e;
              font-size: 20px;
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
    .pay_info{
      @extend .information;
      span{
        color: #9da2a6;
      }
    }
    .receipt{
      @extend .information;
      a{
        color: #9da2a6;
        display: inline-block;
        float:right;
        font-size: 16px;
      }
    }
    .order_amount{
      @extend .information;
      @extend .receipt ,a;
      border-bottom: 1px solid #eee;
    }
  }
  .order_total_sum{
    margin-top: -1rem;
    padding-top: 1rem;
    background: #fff;
    padding-bottom: 1rem;
    h3{
      padding-right: 1rem;
      text-align: right;
      span{
        color: #c8161e;
        font-size: 18px;
        margin: 0 .5rem;
      }
    }
  }
  padding-top: 3.2rem;
  .main{
    color: #999;
    font-size: 16px;
  }
  .payment_goods{
    background: #c8161e;
    padding: 1.5rem 1rem;
    width: 100%;
    display: flex;
    align-items: center;
    color: #fff;
    div:nth-child(1){
      flex: 1;
    }
    h3{
     font-size: 16px;
     color: #fff;
   }
   span{
     color: #fff;
   }
   i{
    color: #fff;
    padding: 0.5rem 1rem;
    border: 1px solid #fff;
    font-size: 12px;
    letter-spacing: 1px;
  }

}
.goods_list{
  position: relative;
  background: #fff;
  padding: 1.5rem 1rem;
  margin-bottom: 10px;
  >ul{
    width: 100%;
    display: flex;
    text-align: center;
    li{
      flex: 1;
      position:relative;
      p{
        font-size: 12px;
      }
      >i{
        position: absolute;
        top: 0;
        margin-top: .3rem;
        color: #e0e0e0;
        margin-left: 3rem;
        display: inline-block;
        letter-spacing: 2px;
        right: 0;
        margin-right: -1.8rem;
        width: 50px;
        &.active{
          color: #ce0707;
        }
      }
    }
  }
  .logistics{
    label{
      font-size: 14px;
    }
    img {
      width: 10px;
      margin-left: .5rem;
    }
  }
  .bg-primary{
   width: 100%;
   display: inline-block;
   transition: all 0.3s;
 }
 .down_active{
  color: #7e8c8d;
  margin-top: 1rem;
  >ul{
    border: 1px solid #eee;
    padding: 1rem;
    >li{
      position: relative;
      line-height: 25px;
      >i{
        display: inline-block;
        width:8px;
        height:8px;
        border-radius: 50%;
        background: #0db72a;
      } 
      span{
        margin-left: 10px;
        color: #5c6670;
      }
    }
  }
}
}
}
.order_pay{
  width: 100%;
  display: flex;
  position: fixed;
  bottom:0;
  left: 0;
  text-align: center;
  height: 4rem;
  border-top: 1px solid #eee;
  .order_total{
    flex: 1;
    line-height: 1.5rem;
    padding-top: .5rem;
    background: #fff;
    font-size: 16px;
    p{
      margin: 0;
    }
    span{
      color: #c8161e;
      font-size: 18px;
    }
  }
  .cancel_order{
    flex: 1;
    line-height: 4rem;
    font-size: 16px;
    color: #333;
    background: #f5f5f5;
  }
  .go_pay{
    flex: 1;
    color: #fff;
    background: #c8161e;
    line-height: 4rem;
    font-size: 16px;
  }
}
}
</style>