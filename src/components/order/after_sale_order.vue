<template>
  <section class="after_sale_order">
    <m-head :title="title" @clickListen="goBack"></m-head>
    <div class="soco_after_sale_order" @click="ulClickListen($event)">
      <div class="my_muen">
        <ul>
          <li v-for="(item,index) in infoArray" :data-function="1" :data-index="(index+1)" :class="{active:(index+1)===orderStatus}">{{item}}</li>
        </ul>
      </div>
      <div v-if="datalist.length==0" class="soco_after_sale_order_empty">
        <img :data-id="'empty'" :src="imgEmpty">
        <p>暂无订单</p>
        <button @click="goIndex">返回商城首页</button>
      </div>
      <div v-else class="order_list_detail" v-for="(datainfo,index) in datalist">
        <div class="order-top">
         <div class="top-time">
           <span>订单日期 <small>{{transformTime(datainfo.addtime)}}</small>
             <a href="javascript:;">{{orderTypeArray[orderTypeShowList[index]]}}</a></span>
           </div>
           <div class="order_No">
             <p>订单编号:{{datainfo.return_order_sn}}</p>
           </div>
         </div>
         <div class="order-center" v-for="(item,index) in datainfo.goods_info">
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
            共<span v-if="datainfo.goods_info">{{datainfo.goods_info.length}}</span>件商品
          </div>
          <div class="button-data_detail">
            <!-- 取消按钮 -->
            <i :data-function="1" :data-id="datainfo.id" v-if="datainfo['status']!=-2&&(datainfo['status']<2||(datainfo['status']<1&&datainfo['type']==2))">取消售后</i>
            <i :data-function="3" :data-id="datainfo.id">订单详情</i>
            <i :data-function="2" :data-type="datainfo['type']" :data-id="datainfo.id" v-if="datainfo['status']==-1">编辑申请</i>
            <i :data-function="4" :data-id="datainfo.id" class="active" v-if="datainfo['status']==1&&datainfo['is_need_paid']==1&&datainfo['is_paid']==0">立即支付</i>
          </div>
        </div>
      </div>
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
    title:'售后订单',
    infoArray:['全部订单','待付款','待收货','已结束'],
    imgEmpty:require("../../common/images/order/empty.png"),
    typeArray:['退款退货','换货','仅退款'],
    orderTypeArray:['已完成','待审核','未通过','买家已取消','待商家退款','待买家寄回','待商家收货','商家已收货,准备发货中','商家已收货,待退款','商家已发货','同意换货,待付款'],
    orderTypeShowList:[],
    orderTypeList:[],
  }
  let $this = {}
  export default {
    name:'after_sale_order',
    data () {
      $this = this 
      return $data
    },
    created:function(){
      this.initOrder();
      this.baseHead=$baseHead;
    },
    watch:{
      orderStatus(c,d){
        this.initOrder();
      }
    },
    methods: {
      ulClickListen:function(e) {
        switch (e.target.nodeName.toLowerCase()){
          case 'i':{
            const fun = parseInt(e.target.dataset.function);
            const id = parseInt(e.target.dataset.id);
            switch(parseInt(fun)){
              case 1:{//取消订单
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
                          $this.$router.push({path:'/after_sale_order'});
                          break;
                        }
                        case 1600105:{
                          mui.alert('当前售后申请已经撤销');
                          $this.$router.push({path:'/after_sale_order'});
                          break;
                        }
                        case 1600106:{
                          mui.alert('当前售后申请无法取消');
                          $this.$router.push({path:'/after_sale_order'});
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
              case 2:{//编辑售后
                const type = parseInt(e.target.dataset.type);
                const id = parseInt(e.target.dataset.id);
                switch(parseInt(type)){
                  case 2:$this.$router.push({name:'/afterSaleOrder/afterSaleServiceOneApply/edit',params:{id:id}});break;
                  case 0:$this.$router.push({name:'/afterSaleOrder/afterSaleServiceTwoApply/edit',params:{id:id}});break;
                  case 1:$this.$router.push({name:'/afterSaleOrder/afterSaleServiceThreeApply/edit',params:{id:id}});break;
                }
                break;
              }
              case 3:{//订单详情
                $this.$router.push({name:'/afterSaleOrder/check',params:{'id':id}});
                window.scrollTo(0,0);
                break;
              }
              case 4:{//立即支付
                $this.$router.push({name:'/afterSaleOrder/check',params:{'id':id}});
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
            if(!isNaN(index))window.open(window.location.origin + '/#/detail/'+index);
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
            url: $basePath+'?c=ReturnGoods&m=userReturnGoodsList',
            data:{
              'page':1,
              'limit':100
            }
          })
          .then((response) => {
            //console.log(response.data.data);
            $this.$emit("appListen","loading",false);
            switch(parseInt(response.data.code)){
              case 1600100 :{
                $this.datalist=[];
                $this.orderTypeList=[];
                $this.orderTypeShowList=[];
                var tempList=response.data.data;
                //-1审核不通过，-2用户取消，0待审，1通过，2买家已发货，3商家已收货，4商家已发货，5已完成
                for(var i=0;i<tempList.length;i++){
                  switch (parseInt(tempList[i]['type'])){
                    case 0:{//退货退款
                      switch (parseInt(tempList[i]['status'])){
                        case -2:$this.orderTypeList.push(3);break;//已取消
                        case -1:$this.orderTypeList.push(2);break;//未通过
                        case 0:$this.orderTypeList.push(1);break;//待审核
                        case 1:$this.orderTypeList.push(5);break;//通过=>待寄回
                        case 2:$this.orderTypeList.push(6);break;//买家已发货=>待商家收货
                        case 3:$this.orderTypeList.push(8);break;//商家已收货=>商家已收货,准备发货中
                        case 5:$this.orderTypeList.push(0);break;//已完成=>已完成
                      }
                      break;
                    }
                    case 1:{//换货
                      switch (parseInt(tempList[i]['status'])){
                        case -2:$this.orderTypeList.push(3);break;//已取消
                        case -1:$this.orderTypeList.push(2);break;//未通过
                        case 0:$this.orderTypeList.push(1);break;//待审核
                        case 1:{
                          if(parseInt(tempList[i]['is_need_paid'])){
                            if(parseInt(tempList[i]['is_paid']))
                              $this.orderTypeList.push(5);//已支付
                            else
                              $this.orderTypeList.push(10);//未支付
                          }else{
                            $this.orderTypeList.push(5);
                          }
                          break;
                        }//通过=>待寄回
                        case 2:$this.orderTypeList.push(6);break;//买家已发货=>待商家收货
                        case 3:$this.orderTypeList.push(7);break;//商家已收货=>商家已收货,准备发货中
                        case 4:$this.orderTypeList.push(9);break;//商家已发货=>商家已发货
                        case 5:$this.orderTypeList.push(0);break;//已完成=>已完成
                      }
                      break;
                    }
                    case 2:{//仅退款
                      switch (parseInt(tempList[i]['status'])){
                        case -2:$this.orderTypeList.push(3);break;//已取消
                        case -1:$this.orderTypeList.push(2);break;//未通过
                        case 0:$this.orderTypeList.push(1);break;//待审核
                        case 1:$this.orderTypeList.push(4);break;//待退款
                        case 5:$this.orderTypeList.push(0);break;//已完成=>已完成
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
                      if($this.orderTypeList[i]==4||$this.orderTypeList[i]==8||$this.orderTypeList[i]==10){
                        $this.orderTypeShowList.push($this.orderTypeList[i]);
                        $this.datalist.push(tempList[i]);
                      }
                      break;
                    }
                    case 3:{//待收货
                      if($this.orderTypeList[i]==5||$this.orderTypeList[i]==6||$this.orderTypeList[i]==7||$this.orderTypeList[i]==9){
                        $this.orderTypeShowList.push($this.orderTypeList[i]);
                        $this.datalist.push(tempList[i]);
                      }
                      break;
                    }
                    case 4:{//已完成
                      if($this.orderTypeList[i]==0){
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
              default :mui.alert('服务器忙<br/>刷新重试');break;
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
  .after_sale_order{
    background: #f5f5f5;
    .soco_after_sale_order_empty{
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
    .soco_after_sale_order{
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
      width:33%;
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
