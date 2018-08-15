<template>
  <div class="dialogSuccess">
    <mHead @clickListen="goBack" :title="title"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <img :src="pic[type]">
      <div class="content">{{content}}</div>
      <div class='group-btn'><button @click="goBack">{{btnText}}</button></div>
    </content>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  var $data = {
    url:'/',
    type:0,
    title:'操作成功',
    content:'操作成功',
    btnText:'确认',
    pic:[require("../../common/images/main/complete.png"),require("../../common/images/main/inform.png")]
  }
  var $this = {}
  export default {
    name: 'dialogSuccess',
    data () {
      $this = this
      return $data
    },
    props:{
      
    },
    created:function(){
      window.scrollTo(0,0);
      if(this.$route.params.title!=null&&this.$route.params.title!='')this.title=this.$route.params.title;
      if(this.$route.params.content!=null&&this.$route.params.content!='')this.content=this.$route.params.content;
      if(this.$route.params.url!=null&&this.$route.params.url!='')this.url=this.$route.params.url;
      if(this.$route.params.btnText!=''&&this.$route.params.btnText!=null)this.btnText=this.$route.params.btnText;
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      goBack:function(){
        $this.$router.push({path:this.url});
        $this.$destroy();
      }
    },
    components:{
     'mHead':mHead
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .dialogSuccess{
    content{
      margin:2.86rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color:white;
      padding:0 1.25rem;
      .content{
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
