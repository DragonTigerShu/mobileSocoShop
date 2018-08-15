<template>
  <div id="offCanvasWrapper" class="mui-off-canvas-wrap mui-draggable">
    <!-- 主页面容器 -->
    <div class="mui-inner-wrap">
      <!-- 菜单容器 -->
      <aside class="mui-off-canvas-left"  id="offCanvasSide">
        <!-- 菜单具体展示内容 -->
        <div class="fixed-navs">
          <div class="m-logo">
            <router-link :to="{path:'/'}" class="">
              <img :src="logoImg">
            </router-link>
          </div>
          <div id="offCanvasContentScroll" class="mui-scroll-wrapper">
            <div class="mui-scroll"  @click="offCanvasHide">
              <ul class="names">
                <li @click="evends"><a href="javascript:void(0)">商城首页</a></li>
                <li><a href="http://www.supersoco.com/m-portal/ch/details-tc-sum.php">SOCO TC</a></li>
                <li><a href="http://www.supersoco.com/m-portal/ch/details-pro-sum.php">SOCO TS</a></li>
                <li><a href="http://bbs.supersoco.com/forum.php?mod=forumdisplay&amp;fid=42&amp;mobile=2">官方论坛</a></li>
                <li><a href="http://wx.supersoco.com/index.php?c=MapCtrl">O2O服务商</a></li>
                <li><a href="http://wx.supersoco.com/index.php?c=SukeBao&amp;m=baobao">速珂宝</a></li>
                <li><a href="http://www.supersoco.com/down.php">APP下载</a></li>
              </ul>
            </div>
          </div> 
        </div>
      </aside>
      <div id="app">
        <router-view :key="key" :reload="reload" @appListen="appListen"/>
      </div>
      <div class="mui-off-canvas-backdrop"></div>
    </div>
    <section class='mui-loading' v-show="loadingFlag">
      <button type="button" class="mui-btn mui-disabled" data-loading-text="读取中" disabled="true">
        <span class="mui-spinner mui-spinner-white"><img style="width:40px" :src="loadingImg"></span>&nbsp;<span>读取中</span>
      </button>
    </section>
  </div>
</template>
<script>
  import axios from '@/common/js/axios.js'
  import mui from '../static/mui.js'  
  let $this = {};
  let $data = {
    loadingFlag:false,
    reload:false,
    logoImg:require('./assets/m-logo.png'),
    loadingImg:require('./common/images/main/loading.png')
  };
  export default {
    data() {
      $this = this;
      return $data;
    },
    methods: {
      login: function() {
        $this.$router.push({ path: "/login" });
        window.scrollTo(0, 0);
      },
      offCanvasHide:function(){
      //  var offCanvasWrapper = mui('#offCanvasWrapper');
      //  offCanvasWrapper.offCanvas('close');
     },
     evends:function(){
      // window.location.reload();
   
       window.scrollTo(0, 0);
        $this.$router.push({ path: "/" });
       var offCanvasWrapper = mui('#offCanvasWrapper');
       offCanvasWrapper.offCanvas('close');
     
    },
    appListen:function($c,$d){
      switch($c){
        case 'loading':{
          $this.loadingFlag=$d;
          break;
        }
      }
    }
  },
  created: function() {
    this.$nextTick( () => {  
      mui('#offCanvasSideScroll').scroll();
      mui('#offCanvasContentScroll').scroll();
      mui.plusReady(function() {
        mui.init();
      });
    });
    axios({
      method:'post',
      url: $basePath+'?c=User&m=checkLogin',
      data: {}
    })
    .then((response) => {
      //200131表示已登陆状态，200132表示未登录
      //console.log(response.data);
      switch(parseInt(response.data.code)){
        case 500131 :{
          $user=response.data.data[0];
          $user.phone=$user.mobile_phone.substr(0,3)+"****"+$user.mobile_phone.substr(7,11);
          if($user.head_pic!=null&&$user.head_pic!='')$user.headImg=$headPicPath+$user.head_pic;
          this.reload=!this.reload;
          break;
        }
        case 500132 :window.scrollTo(0,0);break;
        case 888 :window.scrollTo(0,0);break;
        default:break;
      }
    })
    .catch(function (error) { 
      //console.log(error);
    });
  },
  computed: {
    key() {
        return this.$route.fullPath;
    }
  },
};
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .mui-content {
    background: none;
  }
  .mui-off-canvas-left{
    background: #f5f5f5;
  }
  .mui-inner-wrap>.mui-off-canvas-left{
    z-index: 1!important;
  }
  input:-webkit-autofill,
  textarea:-webkit-autofill,
  select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset;
  }
  .fixed-navs{width:100%;background:#f5f4ef;}
  .fixed-navs .names a{color: #727270};
  .fixed-navs .names{padding-top:1em;}
  .fixed-navs ul{margin-top: 12em;z-index: 1;background: #f5f5f5;}
  .fixed-navs .names li{width:100%;height:3em;text-align:left;line-height:3em;}
  .fixed-navs .names li a{width: 100%;height: 100%;display: inline-block;padding: 0 2em;}
  .fixed-navs { color: #ffffff;background-color: #f5f4ef;}
  .of{overflow:hidden;}
  .wrap.moveleft{margin-left:-15em;overflow:hidden;}

  .fixed-navs .m-logo{position: absolute;z-index: 99;width:100%;height:9em;background:white;display: flex;justify-content: center;align-items: center}

</style>
