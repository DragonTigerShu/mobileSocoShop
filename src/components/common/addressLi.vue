<template>
  <div class="addressLi" :class="parseInt(selected)==parseInt(data.address_id)?'active':''" @click="clickListen">

    <span v-if="parseInt(data.is_default)==0" class="status status-default" @click="statusClickListen">设为默认</span>
    <span v-if="parseInt(data.is_default)==1" class="status status-active" @click="statusClickListen">默认</span>
    <p>{{data.consignee}}</p>
    <p>{{data.mobile}}</p>
    <p>{{data.pname}} {{data.zname}} {{data.xname}} {{data.address}}</p>
    <div><p @click="editClickListen">修改</p><p @click="deleteClickListen">删除</p></div>
  </div>
</template>
<script>
  var $this = {}
  export default {
    name: 'HelloWorld',
    data () {
      $this = this
      return {
        
      }
    },
    created:function(){
      
    },
    props:{
      data:Object,
      selected:{type:Number,default:0},
      index:Number
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
      clickListen:function(){
        this.$emit('clickListen',this.data.address_id);
      },
      editClickListen:function(e){
        this.$emit('editClickListen',this.data.address_id);
        e.stopPropagation();
      },
      deleteClickListen:function(e){
        this.$emit('deleteClickListen',this.data.address_id);
        e.stopPropagation();
      },
      statusClickListen:function(e){
        this.$emit('statusClickListen',this.index);
        e.stopPropagation();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .addressLi{
    height:12.5rem;
    border:1px solid #e0e0e0;
    border-radius:0.143rem;
    width:100%;
    position:relative;
    padding:2.5rem 5.5rem 1.07rem 1.429rem;
    div{
      position:absolute;
      bottom:0;
      right:0;
      display:flex;
      p{
        font-size:0.857rem;
        color:#a8acb0;
        margin-right:1.25rem;
      }
    }
    p{
      color:#5c6670;
      font-size:1.07rem;
      margin-bottom:1.07rem;
      overflow:hidden; 
      text-overflow:ellipsis;
      display:-webkit-box; 
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2; 
      &:nth-child(3){
        margin-bottom:0.357rem;
      }
    }
    span{
      font-size:0.857rem;
      color:#a8acb0;
      &.status-active{
        background-color:#f5f5f5;
        font-size:0.714rem;
        width:4.29rem;
        height:1.43rem;
        background-color:#ca1012;
        color:white;
        display:flex;
        justify-content:center;
        align-items:center;
        border-radius:0.143rem;
        position:absolute;
        right:1.25rem;
        top:0.625rem;
      }
      &.status-default{
        font-size:0.714rem;
        width:4.29rem;
        height:1.43rem;
        color:#9da2a6;
        display:flex;
        background-color:white;
        justify-content:center;
        align-items:center;
        border-radius:0.143rem;
        border:1px solid #e0e0e0;
        position:absolute;
        right:1.25rem;
        top:0.625rem;
      }
    }
    &.active{
      background-color:#f5f5f5;
    }
  }
</style>
