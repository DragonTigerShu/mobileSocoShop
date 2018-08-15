<template>
  <div class="radioChoose-wrap">
    <ul>
      <li v-for="(item,index) in selections.item" :class="{active:index===nowIndex}" @click="chooseSelection(index,item)">{{item.item_name}}
        <i v-if="item.itemImg" :style="{background:`url(${baseHead +item.itemImg[0].img_url}) center center no-repeat`,backgroundSize:`cover`}"></i>  
      </li>
    </ul>
  </div>
</template>
<script>
  export default{
  props:{ //父类注入数据过来
    selections:Object,
    baseHead:String
  },
  data() {
    return {
          nowIndex:0, //数据类型
          goodsPrice:''  // 传过来的id 
        }
      },
      watch:{
        selections(c,d){
      //console.log(c);
    }
  },
  methods: {
    chooseSelection:function(index,cb){
      this.nowIndex = index
      var _this = this 
      if(cb&&cb.itemImg){  //
        _this.goodsPrice = cb.item_id
      }else{
        _this.goodsPrice = cb.item_id
      }
      this.$emit('selectgoodsPrice',this.goodsPrice,this.selections.spec_id)   // ID   goodsPrice是你选择的参数的值的Id    spec_id是你点击的修改的是哪个(参数的Id) 
    }
  }
}
</script>
<style lang = "scss">
  .radioChoose-wrap{
    ul{
      display: flex;
      flex-wrap: wrap;
      li{
        list-style:none;
        padding:0 5px;
        line-height:2.5rem;
        border:1px solid #e0e0e0;
        border-radius:4px;
        margin-right:10px;
        font-size:1rem;
        color: #5c6670;
        min-width:4rem;
        height:2.57rem;
        text-align: center;
        white-space: nowrap;
        cursor:pointer;
        margin-bottom:5px;
        &.active{
         border:1px solid #C8161E;
         color: #C8161E;
       }
       i{
        display: inline-block;
        width:16px;
        height: 16px;
        border-radius: 8px;
        margin-right: 5px;
        position: relative;
        top:2px;
      }
    }
  }
}
</style>