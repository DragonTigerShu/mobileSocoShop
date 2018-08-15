<template>
  <div class="afterSaleList">
    <mHead :title="'申请售后服务'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content @click="parentListen($event)">
      <div class="title">申请售后服务</div>
      <section class="afterSaleListLi" v-for="(d,index) in scData" :index="index" :key="index" :data-id="d.rec_id">
        <template v-if="checkComfirmTime(d)">
          <ul :data-id="d.rec_id"> 
            <i><img :src="baseHead+d.goods_thumb" :data-id="d.rec_id"></i>
            <li class="goodsListContentLi-content" :data-id="d.rec_id">
              <p :data-id="d.rec_id">{{d.goods_name}}</p>
              <span :data-id="d.rec_id">{{d.spec_key_name}}</span>
              <div class="goodsListContentLi-content-footer" :data-id="d.rec_id">
                <span :data-id="d.rec_id">￥{{d.goods_price}}</span><span>X{{d.goods_number}}</span>
              </div>
            </li>
            <li :data-id="d.rec_id"><img :src="imgRight" :data-id="d.rec_id"></li>
          </ul>
        </template>
      </section>
    </content>
  </div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  var $data = {
    scData:[],
    'imgRight':require('../../common/images/main/right.png'),
    'baseHead':''
  }
  var $this = {}
  export default {
    name: 'afterSaleList',
    data () {
      $this = this
      return $data
    },
    props:{
    },
    created:function(){
      window.scrollTo(0,0);
      this.baseHead=$baseHead;
      this.orderId=this.$route.params.id;
      this.initOrderDetail();
    },
    mounted:function(){

    },
    watch:{
      
    },
    methods:{
      checkComfirmTime:function(data){
        if(parseInt(data.receive_time) + 604800 < new Date().getTime()/1000){
          return false;
        }
        return true;
      },
      parentListen:function(e) {
        const id = e.target.dataset.id;
        if(id!=''&&id!=null){
          $this.$router.push({name:'/afterSale/afterSaleService',params:{id:id}});
          window.scrollTo(0,0);
        }
      },
      initOrderDetail:function(){
        $this.$emit("appListen","loading",true);
        axios({
         method:'post',
         url: $basePath+'?c=Order&m=userOrderDetail',
         data:{
           'orderId':$this.orderId
         }
       })
        .then((response) => {
         //console.log(response.data.data);
         $this.$emit("appListen","loading",false);
         switch(parseInt(response.data.code)){
           case 1100100 :{
            $this.scData=response.data.data.order_goods_list;
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
      goBack:function(){
        $this.$router.push({name: 'info_order_details',params:{id:this.orderId}});
        window.scrollTo(0,0);
      }
    },
    components:{
      'mHead':mHead
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .afterSaleList{
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
      .afterSaleListLi{
        ul{
          display:flex;
          flex-direction:row;
          width:100%;
          background:white;
          padding: 0 1.25rem;
          justify-content:space-between;
          border-bottom:1px solid #e0e0e0;
          >li{
            margin:1.96rem 0;
            display:flex;
            align-items: center;
            width:auto;
            img{
              width: 1.04rem;
            }
            &:first-child{
              label{
                display: flex;
                font-size:0.714rem;
                align-items: center;
              }
              >img{
                width:7.14rem;
                height:7.14rem;
                background-color:#f7f7f7;
              }
            }
            &.goodsListContentLi-content{
              display:flex;
              flex-direction:column;
              align-items: baseline;
              justify-content: flex-start;
              background:white;
              >p{
                font-size:1.07rem;
                color:#333333;
                margin-bottom:0;
              }
              >span{
                font-size:0.929rem;
                color:#9da2a6;
                margin-top:1.07rem;
              }
              div.goodsListContentLi-content-footer{
                display: flex;
                justify-content: flex-start;
                align-items: flex-end;
                width: 100%;
                height: 100%;
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
          }
        }
      }
    }
  }
</style>
