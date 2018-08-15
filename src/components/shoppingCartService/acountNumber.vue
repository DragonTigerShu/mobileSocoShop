<template>
  <ul class="aN">
    <li><button class="minus" :class="minusDis?'disabled':''" @click="minus"><img :src="imgMinus"></button></li>
    <li class="number">{{num}}</li>
    <li><button class="add" :class="addDis?'disabled':''" @click="add"><img :src="imgAdd"></button></li>
  </ul>
</template>
<script>
  var $data = {
    'imgAdd':require('../../common/images/main/add.png'),
    'imgMinus':require('../../common/images/main/minus.png'),
  }
  var $this={}
  export default {
    name: 'acountNumber',
    props: {
      num:{type:Number,default:1},
      minusDis:Boolean,
      addDis:Boolean
    },
    data () {
      var $this = this;
      return $data;
    },
    created:function(){
      
    },
    watch:{
      　　
    },
    methods:{
      minus:function(){
        if(!this.minusDis)this.$emit('aNClickListen',false);
      },
      add:function(){
        if(!this.addDis)this.$emit('aNClickListen',true);
      }
    },
    computed: {

    },
    components:{
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .aN{
    width:auto;
    height:1.79rem;
    font-size:0;
    border-radius: 4px;
    display: flex;
    flex-direction:row;
    align-items:center;
    justify-content:center;
  }
  .aN>li{
    .minus{
      border-radius: 4px 0 0 4px;
    }
    .add{
      border-radius: 0 4px 4px 0;
    }
  }
  .aN>li button{
    width:1.79rem;
    height:1.79rem;
    color: #E0E0E0;
    font-size: 20px;
    padding:0;
    border: 0 solid white;
    background-color: white;
    outline: none;
  }
  .aN>li button:hover{
    background-color: #e0e0e0;
    color: white;
    cursor:pointer;
  }
  .aN>li.number{
    width:2.25rem;
    color:#9da2a6;
    font-size:0.7142rem;
    line-height:1.79rem;
    text-align:center;
    height:100%;
    cursor: default;
  }
  .aN>li button.disabled{
    cursor:no-drop;
  }
</style>
