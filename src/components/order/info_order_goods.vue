<template>
  <div class="info_order_goods">
    <Headers></Headers>
    <div class="order_goods">
      <div class="info_order">
       <label for="fileToUpload">
         <!-- <img class="headImg" :src="headImg"> -->
         <i :style="{background:'url('+headImg+') center center no-repeat'}" class="headImg"></i>
       </label>
       <label>
         <h3>Hi ~</h3>
         <span style="margin-left:3px;font-size:18px" @click="editUserNameListen">{{userName}}<img :src="editsImg"></span>
         <!-- <span style="margin-left:3px" @click="editPhoneListen">{{phone}}</span> -->
       </label>
       <li class="headImg_edit">
        <div class="info_img" >
          <form>
            <input id="fileToUpload" type="file" tabIndex = "-1" accept="headImg" name="file" @change="fileSelected" />
          </form>
        </div>
      </li>
    </div>
    <div class="info_conter">
      <ul>
        <li @click="my_order">
          <h3>{{orderNum}}</h3>
          <p>我的订单</p>
        </li>
        <li @click="after_sale">
          <h3>{{afterSaleNum}}</h3>
          <p>售后订单</p>
        </li>
      </ul>
    </div>
    <div class="info_revise">
      <div class="revise_addres" @click="editAddressListen">
       <img :src="reviseImg">
       <span>我的地址</span>
     </div>
     <div class="revise_pwsword" @click="editPasswordListen">
       <img :src="reviseImg">
       <span>修改密码</span>
     </div>
     <div class="revise_tel" @click="editPhoneListen">
      <img :src="reviseImg">
      <span>修改手机号</span>
    </div>
    <div class="button">
      <button type="button" @click="loginOut">
        退出登录
      </button>
    </div>
  </div>

  
</div>  
</div>
</template>
<script>
   import Header from "../../components/header/header.vue"; //头部信息  
   import axios from 'axios'
   import mui from '../../../static/mui.js'
   
   let $this = {}
   let $data = {
    userName:'读取中',
    headImg:require("../../common/images/main/pictured.png"),
    reviseImg:require("../../common/images/order/revise.png"),
    editsImg:require("../../common/images/order/edits.png"),
    imgs:[],
    newHeadPic:'',
    imgData:{
     accept: 'image/gif, image/jpeg, image/png, image/jpg'  
   },
   orderNum:0,
   afterSaleNum:0,
   orderFlag:false,
   afterSaleFlag:false,
   phone:'*'
 }

 export default {
   data () {
    $this = this 
    return $data  
  },
  props:{
    reload:{type:Boolean,default:false}
  },
  created () {
    if($user.user_name!=''&&$user.user_name!=null){
      this.userName=$user.user_name;
      this.phone=$user.mobile_phone;
    }
    if($user.headImg!=''&&$user.headImg!=null)this.headImg=$user.headImg;
    this.$emit("appListen","loading",true);
    this.initOrder();
    this.initAfterSaleOrder();
  },
  watch:{
    reload(c,v){
      if($user.user_name!=''&&$user.user_name!=null)this.userName=$user.user_name;
      if($user.headImg!=''&&$user.headImg!=null)this.headImg=$user.headImg;
    }
  },
  methods: {
    checkLoading:function(){
      if($this.orderFlag&&$this.afterSaleFlag){
        $this.$emit("appListen","loading",false);
      }
    },
    initOrder:function(){
      axios({
        method:'post',
        url: $basePath+'?c=Order&m=userOrderList',
        data:{
          'page':1,
          'limit':100
        }
      })
      .then((response) => {
            //console.log(response.data.data);
            $this.orderFlag=true;
            $this.checkLoading();
            switch(parseInt(response.data.code)){
              case 1100100 :{
                $this.orderNum=response.data.data.list.length;
                break;
              }
              case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
              default:mui.alert('服务器忙<br/>刷新重试');break;
            }
          })
      .catch(function (error) {
        $this.orderFlag=true;
        $this.checkLoading();
            //console.log(error);
          });
    },
    initAfterSaleOrder:function(){
      axios({
        method:'post',
        url: $basePath+'?c=ReturnGoods&m=userReturnGoodsList',
        data:{
          'page':1,
          'limit':100
        }
      })
      .then((response) => {
        $this.afterSaleFlag=true;
        $this.checkLoading();
        switch(parseInt(response.data.code)){
          case 1600100 :{
            $this.afterSaleNum=response.data.data.length;
          }
          case 888 :$this.$emit("appListen","loginAgain");break;
          default :$this.$emit("appListen","inform","服务器忙,请稍后重试");break;
        }
      })
      .catch(function (error) {
        $this.afterSaleFlag=true;
        $this.checkLoading();
            //console.log(error);
          });
    },
    fileSelected: function() {
	    	//图片上传
        var fileInput = document.getElementById("fileToUpload");
        var imgurl = document.querySelector(".iconImg");
        var formData = new FormData(document.querySelector("form"));
        function compress(file, quality, callback) {
          var file = fileInput.files[0];
          if (!window.FileReader || !window.Blob) {
            return errorHandler("您的浏览器不支持图片压缩")();
          }
          var reader = new FileReader();
          var mimeType = file.type || "image/jpeg";
          reader.onload = createImage;
          reader.onerror = errorHandler("图片读取失败！");
          reader.readAsDataURL(file);
          function createImage() {
            var dataURL = this.result;
            var image = new Image();
            image.onload = compressImage;
            image.onerror = errorHandler("图片加载失败");
            image.src = dataURL;
          $this.newHeadPic = image.src; //图片赋值
          // imgurl.style.width = 160 + "px";
          // imgurl.style.height = 160 + "px";
        }
        function compressImage() {
          var canvas = document.createElement("canvas");
          var ctx;
          var dataURI;
          var result;
          ctx = canvas.getContext("2d");
          var originWidth = this.width;
          var originHeight = this.height;
          // canvas对图片进行缩放
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          //比例压缩
          var rate = 0.4;
          var qua = 0.5;
          if (quality.qua && obj.quality <= 1 && obj.quality > 0) {
            qua = quality.qua;
          }
          var base64 = canvas.toDataURL("image/jpeg", qua);
          var targetWidth = originWidth * rate,
          targetHeight = originHeight * rate;
          ctx.clearRect(0, 0, targetWidth, targetHeight);
          ctx.drawImage(this, 0, 0, targetWidth, targetHeight);
          dataURI = canvas.toDataURL(mimeType, quality);
          result = dataURIToBlob(dataURI);
          callback(null, result);
        }
        function dataURIToBlob(dataURI) {
          var type = dataURI.match(/data:([^;]+)/)[1];
          var base64 = dataURI.replace(/^[^,]+,/, "");
          var byteString = atob(base64);
          var ia = new Uint8Array(byteString.length);
          for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          return new Blob([ia], { type: type });
        }
        function errorHandler(message) {
          return function() {
            var error = new Error("Compression Error:", message);
            callback(error, null);
          };
        }
      }
      var file = fileInput.files[0];
      compress(file, 0.5, function(err, data) {
        if (err) {
          //console.log(err);
          return;
        }
        formData.append("filename", data);
        axios({
          method: "post",
          url: $basePath+"?c=User&m=changeNH", //用户修改图像信息
          data: {
            headImg: $this.newHeadPic //图片上传参数
          }
        })
        .then(response => {
            //200131表示已登陆状态，200132表示未登录
           //  //console.log(response.data);
            //成功回调函数
            if(response.data.code){
             
              $this.headImg=$this.newHeadPic;
              
              mui.alert(response.data.msg);
            }
          })
        .catch(function(error) {
            //console.log(error);
          });
      });
    },
    my_order:function () {
      $this.$router.push({path:'/info/order'});
      window.scrollTo(0,0);
    },
    after_sale:function () {
      $this.$router.push({path:'/after_sale_order'});
      window.scrollTo(0,0);
    },
    editAddressListen:function(){
      $this.$router.push({path:'/info/address'});
    },
    editPasswordListen:function(){
      $this.$router.push({path:'/info/editPassword'});
    },
    editUserNameListen:function(){
      $this.$router.push({path:'/info/editUserName'});
    },
    editPhoneListen:function(){
      $this.$router.push({path:'/info/editPhoneOne'});
    },
    loginOut:function(){
      var btn = ["取消","退出"];
      mui.confirm('确认退出当前账户','操作确认',btn,function(e){
        if(e.index==0){
          
        }else{
          axios.post($basePath+'?c=User&m=login_out').then(function(response){
            if(response.data) {
              let data = response.data;
              switch (parseInt(data.code)) {
                case 888 :
                $user='';
                $this.$router.push({path:'/'});window.scrollTo(0,0);break;
                break;
                case 500600 :
                $user='';
                $this.$router.push({path:'/'});window.scrollTo(0,0);break;
                default:break;
              }
            }
          })
          .catch(function (error){ 
                  //console.log(error);
                });
        }
      });
    }
  },
  components: {
    Headers:Header
  }
  
}
</script>
<style lang="scss">
  $background:#fff;
  .info_order_goods{
    background:#f5f5f5;
    .order_goods{
      padding-top: 40px;
      .info_order{
       background: $background;
       padding: 3.2rem 1.5rem;
       display: flex;
       align-items: center;
       label{
        
        i.headImg{
         background-size: cover !important;
         display: inline-block;
         height: 120px;
         width: 120px;
       }
       
       

     }
     h3{
       font-size: 30px;
     }
     label:nth-of-type(2) {
       margin-left: 20px;
       img{
        margin-left: .5rem;
      }
    }
  }
  .info_conter{
    background: $background;
    padding: 1rem;
    width: 100%;
    margin: 1rem 0;
    ul {
      display: flex;
      width: 100%;
      align-items: center;
      li{
        flex: 1;
        text-align: center;
        h3{
          font-size: 32px;
          margin-bottom: 20px;
        }
        p{
          color: #333;
          font-size: 16px;
        }
      }
      
    }
  }
  .info_revise{
    background: $background;
    padding: 1rem;
    img {
      vertical-align: middle;
    }
    span{
      margin-left: 1rem;
    }
    .revise_addres{
      margin-bottom: 1.5rem;    
    }
    .revise_pwsword{
      margin-bottom: 1.5rem;
    }
    .revise_tel{
      margin-bottom: 1.5rem;
    }
  } 
  .button{
   padding: 1.2rem;
   button{
     width: 100%;
     line-height: 32px;
     background: #b90000;
     color: #fff;
     font-size: 16px;
     letter-spacing: 1px;
     border: oldlace;
   }
 }
 .info_img{
  form{
    display: none
  }
  .fileToUpload{
    padding-top: 10px
  }
}
}
}
</style>
