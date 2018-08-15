<template>
  <div class="goodsListContentLi">
    <removeModal :moveFlag="moveFlag" @removeListen="removeListen" @moveListen="moveListen">
      <ul slot="removeModal">
        <li>
          <input type="checkbox" style="display:none" name="gLi" :id="'goodListLi'+index" @click="checkClick" :checked="data.selected==1?true:false"><label :for="'goodListLi'+index"><img :src="data.selected==1 ? imgchecked : imgUnChecked "></label>
        </li>
      </li>
      <li class="goodsListContentLi-img"><router-link :to="{name: 'detail',params:{id:data.goods_id}}"><img :src="baseHead+data.goods_thumb"></router-link></li>
      <li class="goodsListContentLi-content">
        <p>{{data.goods_name}} {{data.spec_key_name}}</p>
        <div class="goodsListContentLi-content-footer">
          <span>￥{{data.goods_price}}</span>
          <aN :minusDis="minusDis" :addDis="addDis" :num="parseInt(data.goods_num)" @aNClickListen="aNClickListen"></aN>
        </div>
      </li>
    </ul>
  </removeModal>
</div>
</template>
<script>
  import acountNumber from '@/components/shoppingCartService/acountNumber.vue';
  import removeModal from '@/components/shoppingCartService/removeModal.vue';
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
      checked:Boolean,
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
    'aN':acountNumber,
    'removeModal':removeModal
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .goodsListContentLi{

    @media(max-width: 360px) {
      ul{
        display:flex;
        flex-direction:row;
        background:white;
        justify-content:space-between;
        >li{
          margin:2.14rem 0rem;
          display:flex;
          align-items: center;
          width:auto;
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
          &.goodsListContentLi-img{
            img{
              width:7.14rem;
              height:7.14rem;
              background-color:#f7f7f7;
            }
          }
          &.goodsListContentLi-content{
            display:flex;
            flex:none;
            flex-direction:column;
            align-items: baseline;
            justify-content: space-between;
            background:white;
            margin:2.14rem 1.25rem 2.14rem 0 ;
            width:120px;
            >p{
              font-size: 12px;
              height: 1.79rem;
              color:#333333;
              margin-bottom:0;
              height:auto;
            }
            >span{
              font-size:0.929rem;
              color:#9da2a6;
            }
            div.goodsListContentLi-content-footer{
              display: flex;
              flex:1;
              justify-content: space-between;
              align-items: flex-start;
              flex-direction:column;
              margin-top:10px;
              width: 100%;
              >span{
                color:#c8161e;
                font-size:1.29rem;
                height:1.79rem;
              }
            }
          }
        }
      }
    }
    @media(min-width: 360px) {
      ul{
        display:flex;
        flex-direction:row;
        background:white;
        justify-content:space-between;
        >li{
          margin:2.14rem 0.714rem;
          display:flex;
          align-items: center;
          width:auto;
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
          &.goodsListContentLi-img{
            img{
              width:7.14rem;
              height:7.14rem;
              background-color:#f7f7f7;
            }
          }
          &.goodsListContentLi-content{
            display:flex;
            flex-direction:column;
            align-items: baseline;
            justify-content: space-between;
            flex:1;
            background:white;
            margin:2.14rem 1.25rem 2.14rem 0 ;
            >p{
              font-size:1.07rem;
              color:#333333;
              margin-bottom:0;
              height: auto;
            }
            >span{
              font-size:0.929rem;
              color:#9da2a6;
            }
            div.goodsListContentLi-content-footer{
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              flex-direction: row;
              margin-top: 0rem;
              width: 100%;
              flex:1;
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
  }
</style>
