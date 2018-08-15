<template>
  <div class="goods_selective">
    <div class="goods_detail">
      <ul>
        <li v-for="(item,index) in goods" :class="{active:index===infoIndex }"  @click="Add_events(index)" >
          <a href="javasctipt:;" >{{item}}</a>
        </li>
      </ul> 
    </div>

    <section class="detail" v-show="infoIndex==0">
      <div class="banner-slider">
        <carousel :indicators="true" :auto="0"  v-if="galleryData.length" :responsive="40"  :on-slid-end="slidEnd">
          <div class="carousel-i"  v-for="(item,key) in galleryData" :key="key" >
            <div class="carousel-i" v-if="item.is_video==0" autoplay :style="{background:`url(${baseHead +item.img_url}) center center no-repeat`,backgroundSize:`contain`}" ></div>
            
            <video  v-if="item.is_video==1" controls="controls" id="videoPlay" x5-video-player-type="h5" x5-video-player-fullscreen="true" x-webkit-airplay="allow" webkit-playsinline playsinline loop="loop"  poster="" width="100%" height="270" @click="videoPlay"> <!--判断是不是视频 1代表视频 0 代表图片-->
              <source :src="baseHead+item.video_url" type="video/mp4">
              </video>	 
            </div>
          </carousel>   
        </div> 
        <div class="sales-borad">
          <h3>{{goods_Data_name}}</h3>
          <p>{{goods_brief}}</p>
          <div class="money"><small>￥{{goods_price}}</small></div>
        </div>
        <div class="goods-sales-center" v-for="(item,index) in specData">
          <div class="sales-left">{{item.spec_name}}</div>
          <div class="sales-right">
            <radioChoose ref="radioChoose" :selections="item" :baseHead="baseHead" @selectgoodsPrice = "selectgoodsPrice"></radioChoose>
          </div>
        </div>
        <div class="goods-sales-center">
          <div class="sales-left">数量</div>
          <div class="sales-right">
            <!--数量组件-->
            <count :max="parseInt(store_count)" @selectChange="onParamChange"></count>
          </div>
        </div>
        <div class="address-center">
          <div class="address-left">
            配送
            <img :src="imgDeliery">
          </div>
          <div class="address-right">
            <select class="select-provice" v-model="region_id"  id="provice"  name="province" @change="provinceListen">  
              <option value="" v-show='false'>请选择地址</option>
              <option :value="item.id"  v-for="(item,index) in province">{{item.name}}</option>
            </select>
            <select class="select-city" id="cityId" name="city" v-model="city_id" @change="cityListen">  
              <option value=""  v-show='false'>请选择地址</option>
              <option :value="item.id"  v-for="(item,index) in getCity" >{{item.name}}</option>
            </select>  
          </div>
        </div>
        <div class="goods-transporta">
          <div class="goods-transporta-left">
            运费
          </div>
          <div class="goods-transporta-right">
            <!--数量组件-->
            <small>￥{{shipping_fee}}</small>
          </div>
        </div>
        <div class="sales-service" v-if="serviceData!=null">
         <div class="added-service ">增值服务</div>
         <div class="soco-speed">
          <selectService :addServiceData="serviceData" @addGoodsListen="addServiceListen"></selectService>
        </div>
      </div>
      <div class="sales-service" v-if="addGoodsData!=null">
       <div class="added-service">搭配购买</div>
       <div class="soco-speed">
         <selectAddGoods :addGoodsData="addGoodsData" @addGoodsListen="addGoodsListen"></selectAddGoods>
       </div>
     </div>
   </section>
   <section class="detcon" v-show="infoIndex==1" v-html="detcon" style="width:100%">
    
   </section>
   <div class="shopping-bottom">
    <div class="shpping-index">
      <a href="javascript:;" @click="goIndex">
        <img :src="imgHome">
        <p>首页</p>
      </a>
      <a href="javascript:;" @click="goCart">
        <img :src="imgShopping">
        <p>购物车</p>
      </a>
    </div>
    <button type="button" class="add-shpping" :disabled="isDisabled" :style="isDisabled  ? 'background:#5c6670;text-decoration:line-through ' : ''" @click="shoppingCartAdd">
      {{CartAdd}}
    </button>
  </div>
</div>
</template>
<script>
  import RadioChoose from '../../components/detailSelention/radioChoose.vue'
  import Color from '../../components/detailSelention/color.vue'
  import Count from '../../components/detailSelention/Count.vue'
  import Carousel from '../../common/js/slider'
  import mui from '../../../static/mui.js'
  import axios from 'axios'
  import selectService from '../../components/detailSelention/selectService.vue'
  import selectAddGoods from '../../components/detailSelention/selectAddGoods.vue'
  let $data = {
    imgHome:require('../../common/images/main/home.png'),
    imgShopping:require('../../common/images/main/shopping.png'),
    imgDeliery:require('../../common/images/goods/dingwei.png'),
    flag:'',
    flag2:'',
    flag3:'',
    _dom:'',
    flag4:'',
    flag5:'',
    goods:['商品','详情'],
    arrList : ['已售罄','加入购物车'],
    infoIndex:0,
    baseId:'',
    proNumber:1,
    baseHead:'',
    isDisabled:'',
    CartAdd:'',
  //
  select:'',
  provinceId:'',
  province:[],
  getCity:[],   // 市
  cityId:'',
  baseId:'',
  shipping_fee:'', //运费 
  region_id:'', // 获取省份
  city_id:'', // 获取市区
  shipping_fee:'',
  galleryData:[],
  arg:[],
  detcon:'',
  // 相册信息
  serviceData:[],  // 商品搭配信息
  addGoodsData:[],  // 商品搭配信息
  goodsBaseData:[],
  specData:[], // 规格参数
  goods_Data_name:'SUPER SOCO',
  goodsPrice:{},  // 参数价格表
  goods_brief:'so cool',
  goods_price:'***',  // 价格     那你直接修改这个就行了啊 现在的意思是下面两个搭配一起才能
  goods_key:'',
  key_name:'',
  isDisabled:'',
  showGoodsData:[],//总计时展示,选择的所有商品
  showServicesData:[],//总计时展示,选择的服务商品
  showAddGoodsData:[],//总计时展示,选择的搭配商品
  store_count:0
}
var $this = {

}
export default {
  name: 'goods_selective_purchasing', //商品选购
  data () {
    $this = this
    return $data
  },
  mounted: function () {
    
  },
  created(){
    window.scrollTo(0,0);
    this.baseHead = $baseHead // 绝对路径
    this.baseId =  this.$route.params.id;
    this.refreshData();
  },
  beforeRouteLeave(to, from, next){
    this.clearParams();
    next();
  },
  beforeRouteUpdate(to, from, next) {
    this.clearParams();
    next();
  },
  methods:{
    clearParams:function(){
      this.goods_Data_name='SUPER SOCO';
      this.goods_brief='so cool';
      this.shop_fee=0;
      this.galleryData=[];
      this.specData=[];
      this.goodsNum=1;
      this.store_count=0;
      this.goods_price='***';
      this.showGoodsData=[];
      this.showServicesData=[];
      this.showAddGoodsData=[];
      this.goods_key='';
      this.key_name="";
      this.infoIndex=0;
      this.CartAdd = this.arrList[0];
      this.isDisabled=true;
      this.$emit("appListen",'loading',false);
    },
    videoPlay:function(){
      this._dom = document.getElementById("videoPlay");
      if(this._dom.paused){
        this._dom.play();
   //   this.muteStatus = ''
   return true
 }else{
  this._dom.pause();
   //   this.muteStatus = 'muted'
   return false
 }
},
 addGoodsListen:function($arr){
  $this.showAddGoodsData=$arr;
  $this.showGoodsDataInit();
},
addServiceListen:function($arr){
  $this.showServicesData=$arr;
  $this.showGoodsDataInit();
},
showGoodsDataInit:function(){
      //添加总计展示商品
      var tempArray=[];
      var tempGoodsData={}
      var price=0;
      tempGoodsData['goods_id']=$this.baseId;
      tempGoodsData['goods_name']=$this.goods_Data_name;
      tempGoodsData['goods_price']=$this.goods_price;
      tempGoodsData['goods_key']=$this.goods_key;
      tempGoodsData['goods_key_name']=$this.key_name;
      tempArray[0]=tempGoodsData;
      for(var i=0;i<$this.showServicesData.length;i++){
        if($this.showServicesData[i]!=null){
          price+=parseFloat($this.showServicesData[i]['goods_price']);
          tempArray.push($this.showServicesData[i]);
        }
      }
      for(var i=0;i<$this.showAddGoodsData.length;i++){
        if($this.showAddGoodsData[i]!=null){
          price+=parseFloat($this.showAddGoodsData[i]['goods_price']);
          tempArray.push($this.showAddGoodsData[i]);
        }
      }
      $this.addPrice=price;
      $this.showGoodsData=[];
      $this.showGoodsData=tempArray;
      ////console.log($this.showGoodsData);
    },
    provinceListen:function(e){
      $this.provincesId = document.getElementById('provice').value;
      $this.city_id =''
      
      $this.getCity = [] //清除 市区
      $this.area = []  // 清除 地区
      $this.$emit('appListen','loading',true);
      axios({   //市区
        method:'post',
        url: $basePath+'?c=UserAddress&m=getCity',
        data:{
          provinceId:$this.provincesId 
        }
      })
      .then((response) => {
      //200131表示已登陆状态，200132表示未登录
      let data =  response.data
      $this.$emit('appListen','loading',false);
      if(data.code=='600100'){
        let arr = data.data
        $this.getCity = arr 
      }
    })
      .catch(function (error) { 
        $this.$emit('appListen','loading',true);
        //console.log(error);
      });  
    },
    cityListen:function(e){
      $this.cityId = document.getElementById('cityId').value  // 地区
      $this.area =[]
      $this.$emit('appListen','loading',true);
      axios({
        method:'post',
        url: $basePath+'?c=GoodsCus&m=getShippingFeeByCity',
        data:{
          goodsId:parseInt($this.$route.params.id),
          areaId:parseInt($this.cityId),
          goodsNum:$this.goodsNum
        },   
      }).then((response) => {
      //200131表示已登陆状态，200132表示未登录
      let data =  response.data
      $this.$emit('appListen','loading',false);
      if(data.code=='2100100'){
        let arr = data.data
        $this.shipping_fee = arr.shipping_fee
      }
    }).catch(function (error) { 
      $this.$emit('appListen','loading',false);
        //console.log(error);
      }); 
    
  },
  checkFlag(){
    if($this.flag&&$this.flag2&&$this.flag3&&$this.flag4&&$this.flag5)this.$emit("appListen",'loading',false);
  },
    selectgoodsPrice:function(cb,spec_id){  // 颜色和规格
      $this.arg.map((cur)=>{
        if(cur.spec_id==spec_id){
          cur.val_id=cb;
        }
      })
      let end_val_id = '';
      this.arg.map((val,index)=>{
        if(index==0){
          end_val_id=val.val_id;
        }else{
          end_val_id+='_'+val.val_id;
        }
      })
      this.goods_key = end_val_id;
      this.goods_price=this.goodsPrice[end_val_id].price;   // 商品价格
      this.key_name = this.goodsPrice[end_val_id].key_name;  // 商品名称
      $this.store_count = this.goodsPrice[end_val_id].store_count;
      if(this.goodsBaseData[0].is_on_sale==1){
        if($this.store_count==0){  // 库存为空的情况
          $this.CartAdd = this.arrList[0]
          this.isDisabled = true  
        }else{
          $this.CartAdd = this.arrList[1]
          this.isDisabled = false  
        }
      }else{
        $this.CartAdd = this.arrList[0]
        this.isDisabled = true  
      }
      $this.showGoodsDataInit();
    },
    refreshData(){
      $this.$emit('appListen','loading',true)  // 开启动画加载
      axios({
        method:'post',
        url: $basePath+'?c=GoodsCus&m=getGoodsDetails',
        data: {
              goodsId:$this.baseId  // 1整车 2周边 3配件
            }
          })
      .then((response) => {
        $this.flag=true;
        $this.checkFlag();
          //200131表示已登陆状态，200132表示未登录
          let data =  response.data 
          if(data.code=='2100100'){
            let arr = data.data;
            $this.store_count=0;
            $this.galleryData=[];
            let gallery = arr.galleryData;   //相册展示  主要是这个对象
            $this.serviceData = arr.serviceData   // 增值服务商品信息
            if(arr.goodsBaseData){
                $this.goodsBaseData = arr.goodsBaseData  // 基本信息  
              }
              $this.galleryData = arr.galleryData; 
          // gallery.map((cur)=>{   //去掉video 视频 
					// 	  if(cur.is_video==0){
          //      	$this.galleryData.push(cur);
          //     }
          
					// 	})
         
          $this.goods_Data_name = arr.goodsBaseData[0].goods_name;
          $this.goods_brief = arr.goodsBaseData[0].goods_brief;
          $this.goods_price = arr.goodsBaseData[0].goods_price;
          $this.addGoodsData = arr.addGoodsData;
          //  //console.log($this.goods_price,"=====================")
          if(arr.specPriceData==null||arr.specPriceData==''||arr.specPriceData==false){
            $this.store_count = arr.goodsBaseData[0].store_count;
          }else{
            $this.specData =  arr.specPriceData.specData;  // 规格参数表信息
            $this.arg=[];//每次请求都清空参数
            $this.specData.map((cur)=>{   // 数据追加
              let obj={   // 添加数据信息
                spec_id:cur.spec_id,
                val_id:cur.item[0].item_id
              };
              $this.arg.push(obj);
            })
            //这里给默认值的时候也要把默认价格给了（我刚刚没写忘了
            let end_val_id = '';
            $this.arg.map((val,index)=>{
              if(index==0){
                end_val_id=val.val_id;
              }else{
                end_val_id+='_'+val.val_id;
              }
              
            })
            //  //结束
            $this.goods_key = end_val_id;
            $this.goodsPrice  = arr.specPriceData.goodsPrice // 商品确定价格表
            $this.goods_price=$this.goodsPrice[end_val_id].price;   // 确定默认价格 好的 
            $this.key_name = $this.goodsPrice[end_val_id].key_name;  // 商品名称
            $this.store_count = $this.goodsPrice[end_val_id].store_count;
          }
          if(arr.goodsBaseData[0].is_on_sale==1){
            if($this.store_count>0){
              $this.CartAdd = $this.arrList[1]
              $this.isDisabled = false
            }else{
              $this.CartAdd = $this.arrList[0]
              $this.isDisabled = true
            }
          }else{
            $this.CartAdd = $this.arrList[0]
            $this.isDisabled = true  
          }
          $this.showGoodsDataInit();
        }
      })
      .catch(function (error) { 
        //console.log(error);
        $this.flag=true;
        $this.checkFlag();
      });
      // 富文本信息
      axios({
        method:'post', 
        url: $basePath+'?c=GoodsCus&m=getGoodsCon',
        data: {
          goodsId:$this.baseId  // 1整车 2周边 3配件
        }
      })
      .then((response) => {
        //200131表示已登陆状态，200132表示未登录
        $this.flag2=true;
        $this.checkFlag();
        $this.detcon = response.data.detcon  // 图片详情
        if($this.detcon!=null&&$this.detcon!='')$this.detcon = $this.detcon.replace(/..\/server/g, $this.baseHead);
      })
      .catch(function(error){
        //console.log(error);
        $this.flag2=true;
        $this.checkFlag();
      })
            // 获取城市地址
      axios({   //现实省会城市信息
        method:'post',
        url: $basePath+'?c=GoodsCus&m=getIpInfoByClient',
      })
      .then((response) => {
        //200131表示已登陆状态，200132表示未登录
        let data =  response.data

        if(data.code=='2100100'){
          let latitude = data.data
          $this.region_id = latitude.region_id.substring(0,latitude.region_id.length-4); // 获取省
          $this.city_id = latitude.city_id.substring(0,latitude.city_id.length-2);  // 获取市
          $this.region = latitude.region
          $this.city = latitude.city
          axios({   //现实省会城市信息
            method:'post',
            url: $basePath+'?c=UserAddress&m=getProvince',
          })
          .then((response) => {
            //200131表示已登陆状态，200132表示未登录
            let data =  response.data
            $this.flag3=true;
            $this.checkFlag();
            if(data.code=='600100'){
              let arr = data.data
              $this.province = arr 
            }
          })
          .catch(function (error) { 
            //console.log(error);
            $this.flag3=true;
            $this.checkFlag();
          });
          $this.provincesId = $this.region_id;
          $this.getCity = [] //清除 市区
          $this.area = []  // 清除 地区
          axios({   //市区
            method:'post',
            url: $basePath+'?c=UserAddress&m=getCity',
            data:{
              provinceId:$this.provincesId 
            }
          })
          .then((response) => {
            //200131表示已登陆状态，200132表示未登录
            let data =  response.data
            $this.flag4=true;
            $this.checkFlag();
            if(data.code=='600100'){
              let arr = data.data
              $this.getCity = arr 
            }
          })
          .catch(function (error) { 
            $this.flag4=true;
            $this.checkFlag();
            //console.log(error);
          }); 
          // 默认获取运费信息
          axios({
            method:'post',
            url: $basePath+'?c=GoodsCus&m=getShippingFeeByCity',
            data:{
              goodsId:parseInt($this.$route.params.id),
              areaId:parseInt($this.city_id),
              goodsNum:$this.proNumber
            },   
          })
          .then((response) => {
            $this.flag5=true;
            $this.checkFlag();
            //200131表示已登陆状态，200132表示未登录
            let data =  response.data
            if(data.code=='2100100'){
              let arr = data.data
              $this.shipping_fee = arr.shipping_fee
            }
          })
          .catch(function (error) { 
            $this.flag5=true;
            $this.checkFlag();
            //console.log(error);
          });     
        }
      })
      .catch(function (error) { 
        $this.flag3=true;
        $this.flag4=true;
        $this.flag5=true;
        $this.checkFlag();
        //console.log(error);
      });
    },
    
    goIndex:function(){
      $this.$router.push({ path: "/" });
      window.scrollTo(0, 0);
    },
    goCart:function(){
      $this.$router.push({ path: "/shoppingCart" });
      window.scrollTo(0, 0);
    },
    Add_events:function(index){
     $this.infoIndex = index
   },
   onParamChange:function(val){
    $this.proNumber = val;
    if($this.city_id){
     axios({
      method:'post',
      url: $basePath+'?c=GoodsCus&m=getShippingFeeByCity',
      data:{
        goodsId:parseInt($this.$route.params.id),
        areaId:parseInt($this.city_id),
        goodsNum:$this.proNumber
      },   
    }).then((response) => {
          //200131表示已登陆状态，200132表示未登录
          let data =  response.data
          if(data.code=='2100100'){
            let arr = data.data
            $this.shipping_fee = arr.shipping_fee
          }

        }).catch(function (error) { 
          //console.log(error);
        }); 
      }
    },
    onColorChange:function(arr,val){
      $this[arr] = val
    },
    slidEnd (index) {   //索引值
      // //console.log(index)
    },
    shoppingCartAdd:function(){
      if($user==null||$user==''){
        var btn = ["再逛逛","去登录"];
        mui.confirm('需要登录','还未登录,请先登录账号',btn,function(e){
          if(e.index==1){
            //执行mui封装好的窗口关闭逻辑；
            $this.$router.push({ path: "/login" });
            window.scrollTo(0, 0);
          }
        });
      }else{
        var goodsArr=[];
        for(var i=0;i<$this.showGoodsData.length;i++){
          if(i==0){
            var temp={
              'goodsId':$this.showGoodsData[i]['goods_id'],
              'specKey':$this.showGoodsData[i]['goods_key'],
              'goodsNum':$this.proNumber
            }
          }else{
            var temp={
              'goodsId':$this.showGoodsData[i]['goods_id'],
              'specKey':$this.showGoodsData[i]['goods_key'],
              'goodsNum':1
            }
          }
          goodsArr.push(temp);
        }
        $this.$emit('appListen','loading',true);
        axios({
          method:'post',
          url: $basePath+'?c=Cart&m=addCartList',
          data: {
            'goodsArr':goodsArr
          }
        })
        .then((response) => {
        //200131表示已登陆状态，200132表示未登录
        //console.log(response.data);
        $this.$emit('appListen','loading',false);
        switch(parseInt(response.data.code)){
          case 1000300 :
          {
            var btn = ["再逛逛","去结算"];
            mui.confirm('','加入购物车成功',btn,function(e){
              if(e.index==1){
                //执行mui封装好的窗口关闭逻辑；
                $this.$router.push({ path: "/shoppingCart" });
                window.scrollTo(0, 0);
              }
            });
            break;
          }
          break;
          case 1000330 ://console.log('请填写必填项');break;
          case 1000340 :mui.alert('相关商品已售罄<br/>刷新重试');break;
          case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
          default:mui.alert('服务器忙<br/>刷新重试');break;
        }
      })
        .catch(function (error) { 
          $this.$emit('appListen','loading',false);
          //console.log(error);
        });
      }
    },
  },
  components: {
    radioChoose: RadioChoose,
    color:Color,
    count:Count,
    Carousel:Carousel,
    selectService:selectService,
    selectAddGoods:selectAddGoods
  }
}
</script>
<style>
  .detcon img{
    width:100% ;
    display:block;
  }

</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .goods_selective{
    margin-bottom:4.5rem;
    .goods_detail{
      height:3.57rem;
      display: block;
      width: 100%;
      >ul{
        display: flex;
        width: 100%;
        height: 100%;
        position: relative;
        text-align: center;
        line-height:3.57rem;
        
        li{
         flex: 1;
         line-height: 50px;
         &.active a{
           
         }
         a{
          font-size: 18px;
          color: #333333;
        }
        &.active a{
          color: #9da2a6;

        }
      }
    }
  }
  .banner-slider{
    background: #f7f7f7;
    position: relative;
    margin-bottom:20px;
    overflow: hidden;
  }
  .detcon{
    padding:1rem;
    
  }
  .detail{
    .sales-borad{
      padding:1rem;
      h3{
        font-size: 18px;
        color: #333;
      }
      .money{
        padding-bottom: 1rem;
        small{
          display: inline-block;
          font-size: 1.285rem;
          color: #c8161e;
        }
      }
    }
    .goods-transporta{
      display: -webkit-box;
      display: box;
      padding:0 1rem 18px 1rem;
      .goods-transporta-left{
        font-size: 1.1rem;
        color: #5C6670;
        width: 20%;
        display: flex;
      }
      .goods-transporta-right{
        width: 80%;
        small{
          font-size: 1.1rem;
          color:#5C6670;
        }
      }
    }
    .address-center{
      display: -webkit-box;
      display: box;
      padding:0 1rem 18px 1rem;
      .address-left{
        font-size: 1.1rem;
        color: #5C6670;
        width: 20%;
        display: flex;
        align-items: center;
      }
      .address-right{
        width: 80%;
        display:flex;
        justify-content:center;
        align-items: center;
        img{
          width:20px;
          height:20px;
        }
        select{
          margin-bottom:0;
          background: unset;
          padding:5px;
          overflow:hidden;
          border: 1px solid #e0e0e0;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 24px;
          background: none;
          border-radius: 5px;
          margin-bottom: 0px;
          height: 35px;
        }
        .select-provice{
          flex:2;
        }
        .select-city{
          flex:3;
          margin-left:5px;
        }
        small{
          font-size: 1.1rem;
          color:#5C6670;
        }
      }
    }
    .goods-sales-center{
      display: -webkit-box;
      display: box;
      padding:0 1rem 18px 1rem;
      .sales-left{
        font-size: 1.1rem;
        color: #5C6670;
        width: 20%;
        display: flex;
        align-items: flex-start;
        padding-top: 0.5rem;
        img{
          width:20px;
          height:20px;
        }
      }
      .sales-right{
        width: 80%;
        display:flex;
        justify-content:flex-start;
        small{
          font-size: 1.1rem;
          color:#5C6670;
        }
      }
    }
    .goods-transporta{
      @extend .sales-left
      
    }
    .sales-service{
      margin-left: -1em;
      .added-service{
        width: 8.35rem;
        background: #f5f5f5;
        height: 2.14rem;
        line-height: 2.14rem;
        border-radius: 0 4px 4px 0;
        font-size: 1rem;
        color:#5C6670;
        display: flex;
        justify-content: center;
      }
      .soco-speed{
        >ul{
          display: flex;
          width: 100%;
          position: relative;
          height: 100%;
          align-items: center;
          li:nth-of-type(1){
           padding: .5rem 0;
           width: 20%;
           border: 1px solid #eee;
           border-radius: 4px;
           text-align: center;
           margin-right: 2rem;
           img{
            vertical-align: middle;
          }
        }
        li:nth-of-type(3){
          flex:2;
          text-align: right;
          position: relative;
        }
      }
    }
    .slaes-add{
      padding: 1rem 0 0 0;
      ul{
        padding: 0 1rem 3rem 1rem;

        border-bottom:1px solid #eee; 
      }
    }
  }
}
.shopping-bottom{
  display: flex;
  width: 100%;
  background: #fff;
  opacity: 1;
  z-index: 99;
  position: relative;
  overflow: hidden;
  align-items: center;
  text-align: center;
  position:fixed;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 4.5rem;
  .shpping-index{
    flex: 1;
    width: 100%;
    position: relative;
    line-height: 4rem;
    display: flex;
    justify-content: center;
    a{
      display: inline-block;
      width: 30%;
      line-height: rem;
      margin-top: .3em;
      position: relative;
      top: .3rem;
      flex: 1;
      img{
        vertical-align: bottom;
      }
      p{
        margin-bottom: 0;
        margin-top: .2rem;
      }
    }
  }
  .add-shpping{
    width: 50%;
    flex: 1;
    padding:0;
    background:#C8161E;
    color: #fff;
    min-height: 4.4rem;
    line-height: 4.4rem;
    font-size: 1.2rem;
    letter-spacing: 1px;
    box-sizing: border-box;
    margin-bottom: -0.3rem;
  }
}
}
.carousel-i{
  width:100%;
  height:100%;
  position: relative;
  z-index:99;
}

input[type=checkbox]:checked + span {
  display: inline-block;
  background: url(../../common/images/main/checkbox-checked.png) center center no-repeat;
  background-size: contain;
  height: 16px;
  width: 16px;
}
.sales-service {
  span{
    content: '';
    position: absolute;
    display: inline-block;
    width: 16px;
    height: 16px;
    top: 0px;
    margin-left: -16px;
    background: url(../../common/images/main/checkbox.png) center center no-repeat;
    background-size: contain;

  }
}
</style>
