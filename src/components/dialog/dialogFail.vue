<template>
  <div class="dialogFail">
    <mHead @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <img :src="pic[0]">
      <div class="title">手机号码修改成功!</div>
      <div class='group-btn'><button>下一步</button></div>
    </content>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  var $data = {
    pic:[require("../../common/images/main/complete.png")]
  }
  var $this = {}
  export default {
    name: 'dialogFail',
    data () {
      $this = this
      return $data
    },
    props:{
    },
    created:function(){
      window.scrollTo(0,0);
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      goBack:function(){

      }
    },
    components:{
     'mHead':mHead
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .dialogFail{
    content{
      margin:2.86rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color:white;
      padding:0 1.25rem;
      .title{
        display:block;
        text-align:center;
        font-size:1.43rem;
        padding:0 0 2.86rem 0rem;
        background-color:white;
      }
      .group-btn{
        width:100%;
        display:flex;
        justify-content:center;
        margin-top:2.86rem;
        button{
          width:100%;
          height:3.214rem;
          font-size:1.29rem;
          padding:.5rem 0;
          line-height:1.285rem;
          color:#fff;
          background:#c8161e;
          border:none;
          border-radius:6px;
          letter-spacing:0.3rem;
        }
      }
    }
  }
</style>
