<template> 
    <div class="header">
      <!-- 主界面菜单同时移动 -->
      <!-- 侧滑导航根容器 -->
            <!-- <div class="mui-off-canvas-wrap mui-draggable">
            <!  主页面容器 -->
            <header id="title_menu" class="mui-bar mui-bar-nav mui-sl-bar" >
                <div class="soco-header">
                    <div id="offCanvasSideScroll" class="main-left" >
                        <a href="#offCanvasSide"><img :src="imgLeft" /></a>
                    </div>
                    <div class="main-right">
                       <img :src="imgShopping" @click="back"/>
                       <img :src="imgLogin"  @click="login"/>
                   </div>
               </div>
           </header> 
       </div>
   </template>

   <script>

    let $this ={}
    let $data = {
        imgLeft:require('../../common/images/main/sidebar.png'),
        imgShopping:require('../../common/images/main/shopping.png'),
        imgLogin:require('../../common/images/main/login-icon.png')
    }
    export default{
        data(){
         $this = this
         return $data        
     },
     
     methods:{
       login:function(){
        if($user.user_name==''||$user.user_name==null){
            $this.$router.push({path:'/login'});
            window.scrollTo(0,0);
        }else{
            $this.$router.push({path:'/info'});
            window.scrollTo(0,0);
        }
    },
    back:function(){
        if($user.user_name==''||$user.user_name==null){
            $this.$router.push({path:'/login'});
            window.scrollTo(0,0);
        }else{
            $this.$router.push({path:'/shoppingCart'});
            window.scrollTo(0,0);
        }
    }

},
created:function(){
   
}
}

    //侧滑效果
</script>
<style scoped lang="scss">
    .mui-off-canvas-wrap .mui-bar{
        border-bottom: 1px solid #eee;
    }

    header{
        background: #fff;
    }
    .mui-off-canvas-wrap{
     overflow: inherit;
 }
 .mui-off-canvas-wrap.mui-active{
    position: absolute;
    left: 0;
}

.soco-header{
  padding: 1em 1.25rem;
  display: flex;
  .main-left{
     flex: 1;
     img{
        width:22px;
    }
}
.main-right{
 img{
    margin: 0 0.5em;
}

}
}
</style>
