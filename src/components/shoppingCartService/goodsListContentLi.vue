<template>
  <div class="goodsListContentLi">
    <ul>
      <li>
        <input type="checkbox" style="display:none" name="gLi" :id="'goodListLi'+index" @click="checkClick" :checked="data.selected==1?true:false"><label :for="'goodListLi'+index"><img :src="data.selected==1 ? imgchecked : imgUnChecked "></label>
      </li>
    </li>
    <li><router-link :to="{name: 'detail',params:{id:data.goods_id}}"><img :src="baseHead+data.goods_thumb"></router-link></li>
    <li class="goodsListContentLi-content">
      <p>{{data.goods_name}}</p>
      <span>{{data.spec_key_name}}</span>
      <div class="goodsListContentLi-content-footer">
        <span>￥{{data.goods_price}}</span><aN :minusDis="minusDis" :addDis="addDis" :num="parseInt(data.goods_num)" @aNClickListen="aNClickListen"></aN>
      </div>
    </li>
  </ul>
</div>
</template>
<script>
  import acountNumber from '@/components/shoppingCartService/acountNumber.vue';
  var $data = {
    'msg' : 'Welcome to Your shoppingCart',
    'imgUnChecked':require('../../common/images/main/checkbox2.png'),
    'imgchecked':require('../../common/images/main/checkbox-checkedx2.png'),
    'baseHead':''
  }
  var $this = {}
  export default {
    name: 'goodsListContentLi',
    data () {
      $this = this
      return $data
    },
    created:function(){
      this.baseHead=$baseHead;
    },
    props: {
      index:Number,
      data:Object,
      minusDis:Boolean,
      addDis:Boolean,
      moveFlag:Number
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
    'aN':acountNumber
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .goodsListContentLi{
    ul{
      display:flex;
      flex-direction:row;
      background:white;
      >li{
        display:flex;
        align-items: center;
        width:auto;
        margin:2.14rem auto;
        img{
          width:1.43rem;
          height:1.43rem;
        }
        &:first-child{
          margin:2.14rem 0;
          label{
            display: flex;
            font-size:0.714rem;
            align-items: center;
          }
        }
        &.goodsListContentLi-content{
          margin:2.14rem 0;
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
          }
          div.goodsListContentLi-content-footer{
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            width: 100%;
            height: 100%;
            >span{
              color:#c8161e;
              font-size:1.29rem;
              height:1.79rem;
            }
          }
        }
        >img{
          width:7.14rem;
          height:7.14rem;
          background-color:#f7f7f7;
        }
      }
    }
  }
</style>
