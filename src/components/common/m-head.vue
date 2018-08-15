<template>
  <header class="mui-bar mui-bar-nav mui-sl-bar" >
    <div class="shopping-header">
      <div class="main-left">
        <img :src="imgLeft" @click="clickListen" />
      </div>
      <h1>{{title}}</h1>
      <div class="main-right">
        <slot name="main-right"><a tel="021-4788126" ></a></slot>
      </div>
    </div>
  </header>
</template>
<script>
  var $this = {}
  export default {
    name: 'm-head',
    data () {
      $this = this
      return {
        'imgLeft':require('../../common/images/main/left.png')
      }
    },
    props:{
      title:String
    },
    created:function(){
      
    },
    mounted:function(){

    },
    watch:{
      
    },
    methods:{
      clickListen:function($selected){
        $this.$emit("clickListen");
      }
    },
    components:{

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  header{
    padding:0 1.25rem;
    height:3.57rem;
    z-index:9999;
    position:fixed;
    background-color:white;
  }
  .shopping-header{
    font-size:1.2rem;
    height: 100%;
    display:flex;
    justify-content:center;
    align-items:center;
    position:relative;
    .main-left{
      display: flex;
      align-items: center;
      position:absolute;
      left:0;
      height:100%;
    }
    h1{
      font-size:1.29rem;
      color:#333333;
      margin:0;
    }
    .main-right{
      display: flex;
      align-items: center;
      position:absolute;
      right:0;
      height:100%;
      .main{
        font-size:16px;
        color:#797979;
      }
    }
  }
</style>
