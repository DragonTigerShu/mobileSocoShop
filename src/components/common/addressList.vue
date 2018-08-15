<template>
  <div class="addressList">
    <content>
      <div class="title">已保存{{addressData.length}}条收货地址</div>
      <aLi v-for="(d, index) in addressData" :selected="selected" :key="index" :index="index" :data="d" @statusClickListen="statusClickListen" @editClickListen="editClickListen" @deleteClickListen="deleteClickListen" @clickListen="clickListen"></aLi>
    </content>
    <footer>
      <button @click="goAddressAdd">添加地址</button>
    </footer>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import addressLi from '@/components/common/addressLi.vue'
  import mui from '../../../static/mui.js'
  import axios from 'axios'
  var $data = {
    'addressData':[]
  }
  var $this = {}
  export default {
    name: 'addressList',
    data(){
      $this = this
      return $data
    },
    props:{
      selected:{type:Number,default:0},
      addUrl:String,
      editUrl:String
    },
    created:function(){
      window.scrollTo(0,0);
      this.getListByUser();
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      clickListen:function($id){
        this.$emit('clickListen',$id);
      },
      getListByUser:function(){
        $this.$emit('appListen','loading',true);
      axios({   //获取地址
        method:'post',
        url: $basePath+'?c=UserAddress&m=getListByUser',
      })
      .then((response) => {
        $this.$emit('appListen','loading',false);
        if(parseInt(response.data.code)==600230){
          if(response.data==null||response.data=='')return false;
          var data=[];
          var length= Object.keys(response.data.data).length;
          for(var i=0;i<length-1;i++){
            if(parseInt(response.data.data[i].is_default)==1)$this.selectAddress=response.data.data[i].address_id;
            data.push(response.data.data[i]);
          }
          $this.addressData=data;
        }else if(parseInt(response.data.code)==888){
          $user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});
        }
      })
      .catch(function (error){
        $this.$emit('appListen','loading',false);
        //console.log(error);
      });
    },
    goAddressAdd:function(){
      $this.$router.push({path:this.addUrl});
    },
    statusClickListen:function($index){
      var btn = ["取消","确认"];
      mui.confirm('设置当前地址为默认地址？','操作确认',btn,function(e){
        if(e.index==0){
          
        }else{
          $this.$emit('appListen','loading',true);
          axios({   //市区
            method:'post',
            url: $basePath+'?c=UserAddress&m=editAddressByUser',
            data:{
              consignee:$this.addressData[$index].consignee,
              mobile:$this.addressData[$index].mobile,
              provinceId:$this.addressData[$index].province,
              cityId:$this.addressData[$index].city,
              areaId:$this.addressData[$index].district,
              address:$this.addressData[$index].address,
              zipcode:$this.addressData[$index].zipcode,
              tel:$this.addressData[$index].tel,
              isDefault:1,
              addressId:$this.addressData[$index].address_id
            }
          })
          .then((response) => {
            $this.$emit('appListen','loading',false);
          //200131表示已登陆状态，200132表示未登录
          let data =  response.data
          switch(parseInt(response.data.code)){
            case 600210 :{
              $this.getListByUser();break;
              break;
            }
            case 600211 ://console.log('请填写必填项');break;
            case 600212 : mui.alert('无效的手机号');$this.mobileError=true;break;
            case 600213 : $this.proviceError=true;
            mui.alert('区域不合法');break;
            case 600214 : $user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            case 600215 : mui.alert('修改失败<br/>请稍后重试');
            case 888 :$user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            default:break;
          }
        })
          .catch(function (error) { 
            $this.$emit('appListen','loading',false);
            //console.log(error);
          }); 
        }
      });
    },
    editClickListen:function($addressId){
      $this.$router.push({path:this.editUrl+'/'+$addressId});
    },
    deleteClickListen:function($addressId){
      var btn = ["取消","删除"];
      mui.confirm('确认删除选择地址？','操作确认',btn,function(e){
        if(e.index==0){
          
        }else{
          $this.$emit('appListen','loading',true);
          axios({   //现实省会城市信息
            method:'post',
            url: $basePath+'?c=UserAddress&m=delAddressByUser',
            data:{
              addressId:$addressId
            }
          })
          .then((response) => {
            $this.$emit('appListen','loading',false);
          //200131表示已登陆状态，200132表示未登录
          let data =  response.data
          switch (parseInt(data.code)) {
            case 600300:$this.getListByUser();break;
            case 600301://console.log("请填写必填项");break;
            case 600302:{
              mui.alert('该地址不存在<br/>或已被删除<br/>请刷新页面')
              break;
            }
            case 600303:{
              mui.alert('删除地址失败<br/>请刷新后重试')
              break;
            }
            case 888 :
            $user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});
            break;
            case 500600 :
            $user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});
            break;
            default:break;
          }
        })
          .catch(function (error) { 
            $this.$emit('appListen','loading',false);
            //console.log(error);
          });
        }
      });
    }
  },
  components:{
    'aLi':addressLi
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .addressList{
    footer{
      z-index:9999;
      position:fixed;
      background-color:white;
    }
    content{
      margin-bottom: 4.64rem;
      margin-left:1.25rem;
      margin-right:1.25rem;
      display:block;
      background-color:white;
      ul{
        color:#cc1c1d;
        li{
          font-size:0.929rem;
          margin-bottom:0.357rem;
          &:last-child{
            margin-bottom:0;
          }
        }
      }
      .addressLi{
        margin-bottom:1.07rem;
      }
      .title{
        display:block;
        text-align:left;
        font-size:1.29rem;
        margin-bottom:1.07rem;
        background-color:white;
        &:nth-child(1){
          padding-top:1.07rem;
        }
      }
    }
    footer{
      width:100%;
      display:flex;
      justify-content:center;
      align-items:center;
      bottom:0;
      button{
        background-color:#c8161e;
        color:#ffffff;
        font-size:1.29rem;
        height:3.57rem;
        width:100%;
      }
    }
    
  }
</style>
