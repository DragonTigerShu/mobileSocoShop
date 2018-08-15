<template>
  <section class="afterSaleOrderDetail">
    <m-head :title="title" @clickListen="goBack">
      <a slot="main-right" class="main" href="tel:400-021-2008">客服电话</a>
      <!-- <div slot="main-right" class="main" @click='callPhone'>{{tille_tel}}</div> -->
    </m-head>
    <div class="after_order" v-if="data['return_goods_info']">
      <div class="after_seller">
       <h4>{{orderTypeArray[orderType]}}</h4>
       <p><span></span>{{transformTime(data['return_goods_info']['addtime'])}}</p>
     </div>
     <div v-if="data['return_goods_info']['status']==-1"class="custom">
      <h3>客服回复:</h3>
      <div class="Refund">
        {{data['return_goods_info']['refuse_reason']}}
      </div>
    </div>
    <div class="seller_goods">
      <h3>商品</h3>
      <div class="order_list_detail">
        <div class="goodsListContentAfterSaleLi">
          <ul>
            <li><img :data-id="data['order_goods_info']['goods_id']" :src="baseHead+data['order_goods_info']['goods_thumb']"></li>
            <li class="goodsListContentLi-content">
              <p>{{data['order_goods_info'].goods_name}} {{data['order_goods_info'].spec_key_name}}</p>
              <span></span>
              <div class="goodsListContentLi-content-footer">
                <span>￥{{data['order_goods_info'].goods_price}}</span><span>X{{data['order_goods_info'].goods_number}}</span>
              </div>
            </li>
          </ul>
        </div>
        <sheet_service :data="data"></sheet_service>
      </div>
    </div>
    <div class="apply_for">
      <div v-if="data['return_goods_info']['status']==-1" class="apply_for_left" @click="goApply">修改申请</div>
      <div v-if="data['return_goods_info']['status']!=-2&&(data['return_goods_info']['status']<2||(data['return_goods_info']['status']<1&&data['return_goods_info']['type']==2))" class="apply_for_right" @click="cancelOrder">撤销申请</div>
      <div v-if="data['return_goods_info']['type']==1&&data['return_goods_info']['status']>3" class="apply_for_right" @click="goOrder">查看订单</div>
    </div>
  </div>
</section>
</template>
<script>
  import m_head from '../../components/common/m-head.vue'
import sheet_service from '../../components/order/info_sheet_service.vue'  //服务订单详情
import mui from '../../../static/mui.js'
import axios from 'axios'
let $data ={
  orderType:'',
  orderTypeArray:['已完成','待审核','未通过','买家已取消','待商家退款','待买家寄回','待商家收货','商家已收货,准备发货中','商家已收货,待退款','商家已发货','商家同意换货,待买家付款'],
  picList:[],
  baseHead:'',
  title :'售后订单',
  tille_tel:'客服电话',
}
let $this = {}
export default {
  beforeRouteLeave(to, from, next) {
    this.$emit("appListen",'loading',false);
    next();
  },
  beforeRouteUpdate(to, from, next) {
    next(false);
  },
  data (){
    $this = this
    return $data
  },
  created(){
    this.id=this.$route.params.id;
    this.baseHead=$baseHead;
    window.scrollTo(0,0);
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
    }
  },
  props:{
    data:Object
  },
  methods: {
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
    goOrder:function(){
      $this.$router.push({name: 'info_order_details',params:{id:this.data['return_goods_info']['seller_delivery']}});
      window.scrollTo(0,0);
    },
    goApply:function(){
      switch(parseInt(this.data['return_goods_info']['type'])){
       case 2:$this.$router.push({name:'/afterSaleOrder/afterSaleServiceOneApply/edit',params:{id:this.data['return_goods_info']['id']}});break;
       case 0:$this.$router.push({name:'/afterSaleOrder/afterSaleServiceTwoApply/edit',params:{id:this.data['return_goods_info']['id']}});break;
       case 1:$this.$router.push({name:'/afterSaleOrder/afterSaleServiceThreeApply/edit',params:{id:this.data['return_goods_info']['id']}});break;
     }
   },
   goBack:function(){
    $this.$router.push({path:'/after_sale_order'});
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
            'returnGoodsId':$this.id,
          }
        })
        .then((response) => {
          $this.$emit("appListen","loading",false);
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
  }
},
components:{
  'm-head':m_head,
  'sheet_service':sheet_service,
}
}
</script>
<style lang="scss">
  .afterSaleOrderDetail{
    background: #f5f5f5;
    .order_list_detail{
      background: #fff;
      margin-bottom:1rem;
      padding: 1rem 0;
      .goodsListContentAfterSaleLi{
        ul{
          border-top:1px solid #e0e0e0;
          border-bottom:1px solid #e0e0e0;
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
