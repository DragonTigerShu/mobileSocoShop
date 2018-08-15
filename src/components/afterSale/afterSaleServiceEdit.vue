<template>
  <div class="afterSaleService">
    <mHead :title="'选择售后服务'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <div class="title">选择售后服务</div>
      <div class="goodsListContentAfterSaleLi" v-if="data['order_goods_info']">
        <ul>
          <li><img :src="baseHead+data['order_goods_info'].goods_thumb"></li>
          <li class="goodsListContentLi-content">
            <p>{{data['order_goods_info'].goods_name}} {{data['order_goods_info'].spec_key_name}}</p>
            <span></span>
            <div class="goodsListContentLi-content-footer">
              <span>￥{{data['order_goods_info'].goods_price}}</span><span>X{{data['order_goods_info'].goods_number}}</span>
            </div>
          </li>
        </ul>
      </div>
    </content>
    <footer>
      <div class="title">为您的产品选择服务类型</div>
      <button @click="jump(0)">退款</button>
      <button @click="jump(1)">退货退款</button>
      <button @click="jump(2)">换货</button>
      <p>*您的商品仅支持退款、退货退款、换货服务。</p>
    </footer>
  </div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  var $data = {
    'baseHead':'',
    'id':0,
    'data':{},
  }
  var $this = {}
  export default {
    name: 'afterSaleService',
    data () {
      $this = this
      return $data
    },
    created(){
      this.id=this.$route.params.id;
      this.baseHead=$baseHead;
      this.initOrder();
      $selectAddress=0;
      window.scrollTo(0,0);
    },
    props:{
      reload:Boolean
    },
    beforeRouteLeave(to, from, next) {
      this.$emit("appListen",'loading',false);
      next();
    },
    beforeRouteUpdate(to, from, next) {
      next(false);
    },
    mounted:function(){

    },
    watch:{
      
    },
    methods:{
      initOrder:function(){
        $this.$emit("appListen","loading",true);
        axios({
          method:'post',
          url: $basePath+'?c=ReturnGoods&m=userReturnGoodsDetail',
          data:{
            'returnGoodsId':$this.id,
          }
        })
        .then((response) => {
          $this.$emit("appListen","loading",false);
          switch(parseInt(response.data.code)){
            case 1600100 :{
              $this.data={}
              $this.data=response.data.data;
              break;
            }
            case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            default :$this.$router.push({path:'/after_sale_order'});window.scrollTo(0,0);mui.alert('服务器忙<br/>请稍后重试');break;
          }
        })
        .catch(function (error) {
          $this.$emit("appListen","loading",false);
          mui.alert('服务器忙<br/>请稍后重试');
        //console.log(error);
      });
      },
      goBack:function(){
        $this.$router.push({name:'/afterSaleOrder/check',params:{'id':this.id}});
      },
      jump($type){
        switch(parseInt($type)){
          case 0 :$this.$router.push({name:'/afterSaleOrder/afterSaleServiceOneApply/edit',params:{id:this.id}});break;
          case 1 :$this.$router.push({name:'/afterSaleOrder/afterSaleServiceTwoApply/edit',params:{id:this.id}});break;
          case 2 :$this.$router.push({name:'/afterSaleOrder/afterSaleServiceThreeApply/edit',params:{id:this.id}});break;
        }
      }
    },
    components:{
      'mHead':mHead
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .afterSaleService{
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
      padding-bottom:1.07rem;
    }
    footer{
      margin:0 1.25rem;
      .title{
        display:block;
        text-align:left;
        font-size:1.29rem;
        padding:1.79rem 0 1.43rem 0;
        background-color:white;
      }
      button{
        height:3.57rem;
        width:100%;
        border:1px solid #e0e0e0;
        border-radius:4px;
        display:flex;
        justify-content:center;
        align-items:center;
        font-size:0.929rem;
        margin-bottom:1.07rem;
        color:#9da2a6;
      }
      p{
        margin-top:0.714rem;
        font-size:0.929rem;
        color:#5c6670;
      }
    }
    .goodsListContentAfterSaleLi{
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
  }
</style>
