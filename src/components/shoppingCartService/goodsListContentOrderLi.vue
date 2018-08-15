<template>
  <div class="goodsListContentOrderLi">
    <ul>
      <li><img :src="baseHead+data.goods_thumb"></li>
      <li class="goodsListContentLi-content">
        <p>{{data.goods_name}} {{data.spec_key_name}}</p>
        <span></span>
        <div class="goodsListContentLi-content-footer">
          <span>￥{{data.goods_price}}</span><span>X{{data.goods_num}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
  var $data = {
    'baseHead':''
  }
  var $this = {}
  export default {
    name: 'goodsListContentOrderLi',
    created:function(){
      this.baseHead=$baseHead;
    },
    data () {
      $this = this
      return $data
    },
    props: {
      index:Number,
      data:Object
    },
    watch:{
      //值可以为methods的方法名
      // example0(curVal,oldVal){
      //   //console.log(curVal,oldVal);
      // },
      // example1:'HelloAxios',
      //注意：当观察的数据为对象或数组时，curVal和oldVal是相等的，因为这两个形参指向的是同一个数据对象
      // example2:{
      //   handler(curVal,oldVal){
      //     conosle.log(curVal,oldVal)
      //   },
      //   deep:true
      // }
    },
    methods:{
      aNClickListen:function($b){
      this.$emit('aNClickListen',this.index,$b);//this不能写为$this
    },
    checkClick:function(e){
      this.$emit('checkedListen',this.index,e.target.checked);
    },
    removeListen:function(){
      this.$emit('removeListen',this.index);
    },
    moveListen:function($b){
      this.$emit('moveListen',$b,this.index);
    }
  },
  components:{
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .goodsListContentOrderLi{
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
</style>
