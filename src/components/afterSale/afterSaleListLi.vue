<template>
  <div class="afterSaleListLi" @click="clickListen">
    <ul> 
      <i><img :data-id="data.goods_id" :src="baseHead+data.goods_thumb"></i>
      <li class="goodsListContentLi-content">
        <p>{{data.goods_name}}</p>
        <span>{{data.spec_key_name}}</span>
        <div class="goodsListContentLi-content-footer">
          <span>￥{{data.goods_price}}</span><span>X{{data.goods_number}}</span>
        </div>
      </li>
      <li><img :src="imgRight"></li>
    </ul>
  </div>
</template>
<script>
  var $data = {
    'imgRight':require('../../common/images/main/right.png'),
    'baseHead':''
  }
  var $this = {}
  export default {
    name: 'goodsListContentOrderLi',
    data () {
      $this = this
      return $data
    },
    created:function(){
      this.baseHead=$baseHead;
    },
    props: {
      index:Number,
      data:Object
    },
    watch:{
      
    },
    methods:{
      clickListen:function(){
        $this.$emit("clickListen");
      }
    },
    components:{
      
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
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
</style>
