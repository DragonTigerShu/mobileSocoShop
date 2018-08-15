<template>
  <div class="soco">
    <Headers></Headers>
    <div  class="mui-content"  style="height:3.2em"></div>
    <div id="offCanvasContent" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
      <div class="mui-scroll">
        <a :href="'#anchor'+item.value" class="mui-control-item mui-item1 " 
        v-for="(item,index) in arrList" 
        :key="index" 
        :class="{'mui-active':index===infoIndex}"  
        @tap="showPopup(index)" 
        target="_blank">{{item.name}}</a>
      </div>
    </div>
    <!--banner -->
    <div id="anchor0" class="mui-banner" style="margin-top: 2.9rem;">
      <div class="banner-slider"  v-if="Silder.length">
        <carousel :indicators="true" :auto="3000" :responsive="40">
          <div class="carousel-i" 
          :style="{background:`url(${baseUrl +item.pic_ori}) center center no-repeat`,backgroundSize:`contain`}"  
          v-for="(item,key) in Silder" :key="key"
          v-on:click="SildeList(item.url)" 
          ></div>
        </carousel>
      </div> 
    </div>
    <transition name = "shiftx">
    	<div id="anchor1" class="soco-products" > 
        <template v-for="(item,index) in car_ists">
          <template v-if="item['is_on_sale']==1">
            <router-link :to="{name: 'detail',params:{id:item.goods_id}}">
              <div class="products-tc" @click="goDetail">
                <div class="soco-products-tc"><img :src="baseHead+item.goods_img"></div>  
                <div class="soco-products-tilte">
                  <h2>{{item.goods_name}}</h2>
                  <p>{{item.goods_brief}}<strong>￥{{item.goods_ori_price}}</strong></p>
                </div>  
              </div>
            </router-link>
          </template>
        </template>
        <div  id="anchor2" class="coso-products-news">
          <template v-id="boardList&&boardList.length!=0">
            <h2>新品上架</h2>
            <span>New Arrivals</span>
            <div class="soco-products-discar">
              <template v-for="(item,index) in boardList">
                <div v-if="item['is_on_sale']==1" class="discar-back">
                  <router-link :to="{name: 'detail',params:{id:item.goods_id}}">
                    <div class="soco-user  discar-left">
                      <div>
                        <img :src="baseHead+item.goods_img" />
                      </div>
                      <h3>{{item.goods_name}}</h3>
                      <strong>￥{{item.goods_price}}</strong>
                    </div>
                  </router-link>
                </div>
              </template>
            </div>
          </template>
        </div>
        <div  id="anchor3" class="coso-products-news">
          <template v-id="fittingList&&fittingList.length!=0">
            <h2>产品配件</h2>
            <span>Product Accessory</span>
            <div class="soco-products-discar">
              <template v-for="(item,index) in fittingList">
                <div v-if="item['is_on_sale']==1" class="discar-back">
                  <router-link :to="{name: 'detail',params:{id:item.goods_id}}">
                    <div class="soco-user  discar-left">
                      <img :src="baseHead+item.goods_img" />
                      <h3>{{item.goods_name}}</h3>
                      <strong>￥{{item.goods_price}}</strong>
                    </div>
                  </router-link>
                </div>
              </template>
            </div>
          </template>
        </div> 
        <div  id="anchor4" class="coso-products-news">
          <template v-id="cultureList&&cultureList.length!=0">
            <h2>周边文化产品</h2>
            <span>Peripheral cultural products</span>
            <div class="soco-products-discar">
              <template v-for="(item,index) in cultureList">
                <div v-if="item['is_on_sale']==1" class="discar-back">
                  <router-link :to="{name: 'detail',params:{id:item.goods_id}}">
                    <div class="soco-user  discar-left">
                      <img :src="baseHead+item.goods_img" />
                      <h3>{{item.goods_name}}</h3>
                      <strong>￥{{item.goods_price}}</strong>
                    </div>
                  </router-link>
                </div>
              </template>
            </div>
          </template>
        </div> 
      </div>
    </transition> 
    <Footer></Footer>
  </div>
</template>
<script>
import Header from "@/components/header/header.vue"; //头部信息
import Footer from "@/components/footer/footer.vue"; //头部信息
import Carousel from '../common/js/slider'   // 首页轮播图
import mui from '../../static/mui.js'
import baseUrl from '@/common/js/common.js'
import axios from 'axios'


mui.plusReady(function() {
  mui.init();
});
let $data = {
  arrList: [
  {
    name:'首页',
    value:'0'  
  },
  {
    name:'整车',
    value:'1'  
  },
  {
    name:'新品',
    value:'2'  
  },
  {
    name:'配件',
    value:'3'  
  },
  {
    name:'周边',
    value:'4'  
  }
  ],
  infoIndex: 0,
  show:true,
  baseUrl:baseUrl,
  baseHead:'',
  Silder:[],
  car_ists:[],
  boardList:[],
  fittingList:[],
  cultureList:[]
};
let $this = {};
export default {
  name: "soco_index",
  data() {
    $this = this;
    return $data;
  },
  components: {
    Headers: Header,
    Footer: Footer,
    Carousel:Carousel
  },
  created: function() {
    scrollTop();
    
    this.$nextTick( () => {  
    //初始化mui区域滚动
    mui('#offCanvasContent').scroll();
    
  });  

    $this.baseHead = $baseHead   //局对路径
    axios({
      method:'post',
      url: $basePath+'?c=GoodsCus&m=getGoodsByType',
      data: {
        showTypeId:'1'  // 1整车 2周边 3配件
      }
    })
    .then((response) => {
      //200131表示已登陆状态，200132表示未登录
      //console.log(response.data.data)
      let data =  response.data
      if(data.code=='2100100'){
        let arr = data.data
        $this.car_ists = arr  
      }
    })
    .catch(function (error) { 
      //console.log(error);
    });
    axios({
      method:'post',
      url: $basePath+'?c=GoodsCus&m=getGoodsByIsNew',
      data: {
        isNew:'1'  // 1
      }
    })
    .then((response) => {
     //200131表示已登陆状态，200132表示未登录
      //  //console.log(JSON.stringify(response.data,null,4))
      let data =  response.data
      if(data.code=='2100100'){
        let arr = data.data
        $this.boardList= arr  
      }
    })
    .catch(function (error) { 
      //console.log(error);
    });
    // 配件
    axios({
      method:'post',
      url: $basePath+'?c=GoodsCus&m=getGoodsByType',
      data: {
        showTypeId:'2'  // 1整车 2配件 3周边
      }
    })
    .then((response) => {
      //200131表示已登陆状态，200132表示未登录
      let data =  response.data
      if(data.code=='2100100'){
        let arr = data.data
        $this.fittingList= arr  
      }
    })
    .catch(function (error) { 
      //console.log(error);
    });
    // 周边
    axios({
      method:'post',
      url: $basePath+'?c=GoodsCus&m=getGoodsByType',
      data: {
        showTypeId:'3'  // 1整车 2配件 3周边
      }
    })
    .then((response) => {
      //200131表示已登陆状态，200132表示未登录
      let data =  response.data
      if(data.code=='2100100'){
        let arr = data.data
        $this.cultureList = arr  
      }
    })
    .catch(function (error) { 
      //console.log(error);
    });
  },
  mounted: function() {
	   //    $this.baseId =  this.$route.params.id  //列表 id
    this.$nextTick(function(){//在2.0版本中，加mounted的$nextTick方法，才能使用vm
      this.refreshSilder() // 详情接口
    });
  },
  methods: {
    showPopup: function(selector) {
      this.show = !this.show;
      document.getElementById("anchor" + selector).scrollIntoView();
      var k = document.documentElement.scrollTop || document.body.scrollTop;
      window.scrollTo(0,k-100);
    },
    goDetail:function(){
      $this.$router.push({path:'/'});
    },
    refreshSilder:function(){   // 首页广告位信息
      axios({
        method:'post',
        url: 'http://wx.supersoco.com:8070/index.php?c=GetData&m=getCon&pid=8',
      })
      .then((response) => {
        //200131表示已登陆状态，200132表示未登录
        let data =  response.data
        this.Silder = response.data
      })
      .catch(function (error) { 
        //console.log(error);
      });
    },
    SildeList:function(el){
      if(el){
        window.open('http://'+el);
      }
    }
  }
};
var scrollTop = function() {
  mui('.mui-scroll-wrapper').scroll();
};
</script>
<style scoped lang="scss">
  .banner-slider{
   background: #f7f7f7;
   position: relative;
   padding-bottom:25px;
   overflow:hidden;
 }
 .carousel-i{
  width:100%;
  height:100%;
  position: relative;
  
}
.carousel{

}
.soco {
  background: #f7f7f7;
}
.mui-scroll-wrapper,
.mui-slider {
  z-index: 0;
}
.mui-off-canvas-wrap {
  max-width: 720px;
  margin: 0 auto;
}
.mui-segmented-control-inverted {
  position: fixed;
  left: 0;
  z-index: 99;
  top: 3.15rem;
  box-sizing: border-box;
  width: 100%;
}

.mui-segmented-control.mui-segmented-control-inverted
.mui-control-item.mui-active {
  height: 38px;
}
.mui-slider-indicator.mui-segmented-control {
  background: #fff;
}
.mui-slider
.mui-segmented-control.mui-segmented-control-inverted
~ .mui-slider-group
.mui-slider-item {
  border: 0;
}
.mui-col-xs-5 {
  width: 16.6667%;
}
.mui-bar-nav {
  box-shadow: 0 0px 1px #ccc;
}
.mui-bar {
  background: #fff;
}
.mui-slider
.mui-segmented-control.mui-segmented-control-inverted
~ .mui-slider-group
.mui-slider-item {
  padding: 0 1em;
}

.soco-products {
  padding: 0rem 1rem;
  .soco-products-tc {
    width: 100%;
    min-height: 250px;
    background: #fff;
    margin-top: 2rem;
    margin-bottom: 1rem;
    display:flex;
    justify-content:center;
    align-item:center;
    img{
      height: 18rem;
    }
  }
  .soco-products-tilte {
    h2 {
      font-size: 1.6em;
      color: #5c6670;
    }
    p {
      color: #5c6670;
      font-size: 1.1em;
      strong {
        font-size: 1.2em;
        color: #c8161e;
        float: right;
      }
    }
  }
  .coso-products-news {
    margin-top: 2em;
    margin-bottom: 1em;
    h2 {
      font-size: 1.6em;
      color: #333;
    }
    span {
      color: #9da2a6;
      font-size: 1em;
      margin-bottom: 1.2em;
      display: inline-block;
    }
    .soco-products-discar {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      margin: 0em auto 1em auto;
      .discar-back {
        width: 50%;
        min-width: 10rem;
        font-size: 1.2em;
        .soco-user {
          padding: 1em;
          background: #fff;
          border-radius: 4px;
          margin-bottom:1rem;
          img {
            display: inline-block;
            height: 10em;
            background: white;
            width: 100%;
          }
          h3 {
            font-size: 1.1em;
            color: #5c6670;
            flex:1;
            display: flex;
            align-items: center;
          }
          strong {
            color: #c8161e;
            font-size: 1.2em;
            display: block;
            text-align: right;
          }
          &.discar-left {
            margin-right: 0.5em;
            display: flex;
            height:18rem;
            flex-direction: column;
            align-items: center;
          }
          &.discar-right {
            margin-left: 0.5em;
          }
        }
      }
    }
  }
}

.shiftx-enter-active, .shiftx-leave-active {
  transition: all 1s ease-in-out;
}
.shiftx-enter, .shiftx-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform :  translateY(100px);
}
</style>
