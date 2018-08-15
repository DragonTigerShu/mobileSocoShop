<template>
  <section class="my_order">
    <m-head :title="title" @clickListen="goBack"></m-head>
    <div class="soco_my_order" @click="ulClickListen($event)">
      <div class="my_muen">
        <ul>
          <li v-for="(item,index) in infoArray" :data-function="1" :data-index="(index+1)" :class="{active:(index+1)===orderStatus}">{{item}}</li>
        </ul>
      </div>
      <template v-if="datalist.length==0">
        <div class="soco_my_order_empty">
          <img :data-id="'empty'" :src="imgEmpty">
          <p>暂无订单</p>
          <button @click="goIndex">返回商城首页</button>
        </div>
      </template>
      <template v-else>
        <div class="order_list_detail" v-for="(datainfo,index) in datalist">
          <div class="order-top">
           <div class="top-time">
             <span>订单日期 <small>{{transformTime(datainfo.add_time)}}</small>
               <a href="javascript:;">{{orderTypeArray[orderTypeShowList[index]]}}</a></span>
             </div>
             <div class="order_No">
               <p>订单编号:{{datainfo.order_sn}}</p>
             </div>
           </div>
           <div class="order-center" v-for="(item,index) in datainfo.order_goods_list">
             <ul>
               <li>
                <i><img :data-id="item.goods_id" :src="baseHead+item.goods_thumb"/></i>
              </li>
              <li>
                <h3>{{item.goods_name}}</h3>
                <p>{{item.spec_key_name}}</p>
                <h3>￥{{item.goods_price}}<small>X{{item.goods_number}}</small></h3>
              </li>
            </ul>
          </div>
          <div class="order-bottom">
            <div class="bottom-right">
              共<span v-if="datainfo.order_goods_list">{{datainfo.order_goods_list.length}}</span>件商品 订单金额: <span>{{datainfo.order_amount}}</span>元
            </div>
            <div class="button-data_detail">
              <!-- 取消按钮 -->
              <i v-if="datainfo['shipping_status']==0&&(datainfo['order_status']==0)&&datainfo['total_amount']!=0" :data-function="1" :data-id="datainfo.order_id">取消订单</i>
              <!-- 申请售后按钮 -->
              <i v-if="checkComfirmTime(datalist)" :data-function="2" :data-id="datainfo.order_id">申请售后</i>
              <i :data-function="3" :data-id="datainfo.order_id">订单详情</i>
              <i v-if="datainfo['order_status']==0&&datainfo['pay_status']==0" :data-function="4" :data-id="datainfo.order_id" class="active">立即支付</i>
            </div>
          </div>
        </div>
      </template>
    </div>  
  </section>
</template>
<script>
  import m_head from '../../components/common/m-head.vue'
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  let $data = {
    baseHead:'',
    orderStatus:1,
    datalist:[],
    title:'我的订单',
    infoArray:['全部订单','待付款','待收货','已结束'],
    order:['申请售后','立即支付','订单详情'],
    imgEmpty:require("../../common/images/order/empty.png"),
    orderTypeArray:'',
  orderTypeList:[],//按照orderTypeArray分类所有订单成4类
  orderTypeShowList:[],
}
let $this = {}
export default {
  name:'my_order',
  data () {
    $this = this 
    return $data
  },
  created:function(){
    this.initOrder();
    this.baseHead=$baseHead;
    this.orderTypeArray=$orderTypeArray;
  },
  watch:{
    orderStatus(c,d){
      this.initOrder();
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
        case 'i':{
          const fun = parseInt(e.target.dataset.function);
          const orderId = parseInt(e.target.dataset.id);
          switch(parseInt(fun)){
              case 1:{//取消订单
                var btn = ["确认","取消"];
                mui.confirm('可能会失去再次购买的机会','取消当前订单',btn,function(e){
                  if(e.index==0){
                    $this.$emit("appListen","loading",true);
                    axios({
                      method:'post',
                      url: $basePath+'?c=Order&m=cancelOrder',
                      data:{
                        'orderId':orderId,
                      }
                    })
                    .then((response) => {
                      $this.$emit("appListen","loading",false);
                      //console.log(response.data.data);
                      $this.initOrder();
                      switch(parseInt(response.data.code)){
                        case 1100100 :{
                          break;
                        }
                        case 1100105:{
                          mui.alert('商家已发货,无法取消<br/>请申请售后退款');
                          break;
                        }
                        case 1100106:{
                          mui.alert("订单已取消");
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
                break;
              }
              case 2:{//申请售后
                $selectAddress=0;
                $this.$router.push({name: '/afterSale/afterSaleList',params:{id:orderId}});
                window.scrollTo(0,0);
                break;
              }
              case 3:{//订单详情
                $this.$router.push({name: 'info_order_details',params:{id:orderId}});
                window.scrollTo(0,0);
                break;
              }
              case 4:{//立即支付
                $this.$router.push({name:'/info/order/pay',params:{id:orderId}});
                window.scrollTo(0,0);
                break;
              }
            }
            break;
          }
          case 'li':{
            const fun = parseInt(e.target.dataset.function);
            if(parseInt(fun)==1){
              const index = parseInt(e.target.dataset.index);
              $this.orderStatus=index;
            }
            break;
          }
          case 'img':{
            const index = parseInt(e.target.dataset.id);
            if(!isNaN(index))window.open($hostUrl + '/#/detail/'+index);
            break;
          }
        }
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
        initOrder:function(){
          $this.$emit("appListen","loading",true);
          axios({
            method:'post',
            url: $basePath+'?c=Order&m=userOrderList',
            data:{
              'page':1,
              'limit':100
            }
          })
          .then((response) => {
            //console.log(response.data.data);
            $this.$emit("appListen","loading",false);
            switch(parseInt(response.data.code)){
              case 1100100 :{
                $this.datalist=[];
                $this.orderTypeList=[];
                $this.orderTypeShowList=[];
                var tempList=response.data.data.list;
                for(var i=0;i<tempList.length;i++){
                  switch (parseInt(tempList[i]['order_status'])){
                    case 3:{//买家已取消
                      switch(parseInt(tempList[i]['pay_status'])){
                        case 0:$this.orderTypeList.push(7);break;//未付款=>已取消
                        case 3:$this.orderTypeList.push(6);break;//已退款=>已退款
                        case 4:$this.orderTypeList.push(5);break;//拒绝退款=>拒绝退款
                        case 1:;
                        case 2:$this.orderTypeList.push(4);break;//已付款=>待退款
                      }
                      break;
                    }
                    case 5:$this.orderTypeList.push(8);break;//卖家已作废
                    case 6:$this.orderTypeList.push(7);break;//系统取消=>已取消
                    case 2:;//买家收货
                    case 4:$this.orderTypeList.push(3);break;//已完成=>已收货
                    case 0:{
                      if(tempList[i]['pay_status']==0){
                        $this.orderTypeList.push(1);//未付款=>待付款
                      }
                      else{
                        $this.orderTypeList.push(10);//已付款=>备货中
                      }
                      break;
                    }
                    case 1:{
                      if(tempList[i]['shipping_status']==0){
                          $this.orderTypeList.push(9);//已付款=>待发货
                        }
                        else{
                          $this.orderTypeList.push(2);//已付款=>待收货
                        }
                        break;
                      }
                    }
                    switch(parseInt($this.orderStatus)){
                    case 1:{//全部订单
                      $this.orderTypeShowList.push($this.orderTypeList[i])
                      $this.datalist.push(tempList[i]);
                      break;
                    }
                    case 2:{//待付款
                      if($this.orderTypeList[i]==1){
                        $this.orderTypeShowList.push($this.orderTypeList[i]);
                        $this.datalist.push(tempList[i]);
                      }
                      break;
                    }
                    case 3:{//待收货
                      if($this.orderTypeList[i]==2||$this.orderTypeList[i]==9){
                        $this.orderTypeShowList.push($this.orderTypeList[i]);
                        $this.datalist.push(tempList[i]);
                      }
                      break;
                    }
                    case 4:{//已完成 =>已完成，已收货
                      if($this.orderTypeList[i]==0||$this.orderTypeList[i]==3){
                        $this.orderTypeShowList.push($this.orderTypeList[i]);
                        $this.datalist.push(tempList[i]);
                      }
                      break;
                    }
                  }
                }
                break;
              }
              case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
              default:mui.alert('服务器忙<br/>刷新重试');break;
            }
          })
          .catch(function (error) {
            $this.$emit("appListen","loading",false);
            //console.log(error);
          });
        },
        goBack:function(){
          $this.$router.push({path:'/info'});
        },
        goIndex:function(){
          $this.$router.push({path:'/'});
        }
      },
      components: {
       'm-head':m_head 
     }
   }
 </script>
 <style lang="scss">
  .my_order{
    background: #f5f5f5;
    .soco_my_order_empty{
      background:white;
      padding:6rem 2.5rem 0 2.5rem;
      display:flex;
      justify-content:center;
      align-items:center;
      flex-direction:column;
      p{
        font-size:1.29rem;
        color:#333333;
        margin-top:2.14rem;
      }
      button{
        margin-top:2.86rem;
        border:0;
        height:3.21rem;
        font-size:1.29rem;
        width:100%;
        border-radius:4px;
        background-color:#c8161e;
        color:white;
      }
    }
    .soco_my_order{
      padding-top: 3.57rem;
      .my_muen{
        background: #fff;
        padding: 1.2rem 0;
        ul{
          width: 100%;
          position: relative;
          display: flex;
          text-align: center;
          align-items: center;
          li{
            flex: 1;
            padding-bottom:0.5rem;
            height: 2rem;
            a{
              color: #333;
              font-size: 16px;
            }
            &.active{
              border-bottom: 2.5px solid #C8161E;
            }
          }
        }
      }
      .order_list_detail{
        background: #fff;
        margin-bottom:1rem;
        padding: 1rem;
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
            li:nth-of-type(1){
              flex: 1;
              text-align: center;
              i{
                display: inline-block;
                width: 120px;
                height: 120px;
                >img{
                  width:100%;
                  height:100%;
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
        .order-bottom{
          .bottom-right{
            text-align: right;
            margin: 1rem auto;
          }
          .button-data_detail{
            display: flex;
            width: 100%;
            height: 100%;
            justify-content: flex-end;
            i{
              display: inline-block;
              width: 33%;
              padding: 0.5rem 0rem;
              border: 1px solid #5c6670;
              float: right;
              border-radius: 2px;
              color: #333;
              text-align:center;
              margin:0 1rem 0 0;
              &.active{
                border: 1px solid #c8151e;
                color: #C8161E
              }
              &:nth-last-child(1){
                margin-right:0;
              }
              &.default{
                border: 0px solid #5c6670;
              }
            }
          }
        }
      }
    }
  }
</style>
