<template>
  <div class="addressAdd">
    <mHead :title="title" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <div class="title">填写收货人信息</div>
      <label>收货人*</label>
      <input :class="{'error':consigneeError}" type="text" placeholder="请填写姓名" maxlength="30" v-model="consignee" @focus="clearConsignee">
      <label>手机号*</label>
      <input :class="{'error':mobileError}" type="text" placeholder="请填写手机号" maxlength="11" v-model="mobile" @focus="clearMobile">
      <label>所在地区*</label>
      <div class="address-list">
        <select :class="{'selected-style':provincesId,'default-style':!provincesId,'error':proviceError}" id="provice"  name="province"  @change="provinceListen" @focus="clearProvince">
          <option value="0">省/自治区</option>
          <option v-for="(item, index) in provinces"  v-bind:value="item.id" :selected="parseInt(item.id)==parseInt(provincesId)?true:false">{{item.name}}</option>
        </select>
        <select :class="{'selected-style':cityId,'default-style':!cityId,'error':cityError}" id="cityId" name="city" @focus="clearCity" @change="cityListen">
          <option value="0">城市/地区</option>
          <option v-for="(item, index) in getCity"  v-bind:value="item.id" :selected="parseInt(item.id)==parseInt(cityId)?true:false" >{{item.name}}</option>
        </select>
      </div>
      <select :class="{'selected-style':areaId,'default-style':!areaId,'error':areaError}" id="areaId"  name="block" @change="areaListen" @focus="clearArea">
        <option value="0">区/县</option>
        <option v-for="(item, index) in area"  v-bind:value="item.id" :selected="parseInt(item.id)==parseInt(areaId)?true:false">{{item.name}}</option>
      </select>
      <label>详情地址*</label>
      <textarea :class="{'error':addressError}" type="text" placeholder="请填写收货人地址详情" v-model="address" @focus="clearAddress"></textarea>
      <label>邮政编码</label>
      <input :class="{'error':zipcodeError}" type="text" placeholder="请填写邮政编码" maxlength="6" v-model="zipcode" @focus="clearZipcode">
      <label>固定电话</label>
      <input :class="{'error':telError}" type="text" placeholder="请填写收货人固定电话" maxlength="11" v-model="tel" @focus="clearTel">
      <div class="default-info" @click="checkClick">
        <label for="address-default">设为默认<img :src="checked ? imgchecked : imgUnChecked " ></label>
      </div>
      <div class='group-btn'><button @click="ok">保存地址</button></div>
    </content>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  import mHead from '../../components/common/m-head.vue'
  var $data = {
    imgchecked:require('../../common/images/main/checkbox-checkedx2.png'),
    imgUnChecked:require('../../common/images/main/checkbox2.png'),
    imgSelect:require('../../common/images/main/down.png'),
    addressId:-1,
    title:'新增地址',
    checked: true,
  provinces:[],  // 省
  getCity:[],   // 市
  area:[],  // 区
  provincesId:'',
  cityId:'',
  areaId:'',
  consignee:'',
  mobile:'',
  address:'',
  zipcode:'',
  tel:'',
  addressId:'',
  isDefault:0,
  consigneeError:false,
  mobileError:false,
  proviceError:false,
  cityError:false,
  areaError:false,
  addressError:false,
  zipcodeError:false,
  telError:false,
}
var $this = {}
export default {
  name: 'addressAdd',
  data () {
    $this = this
    return $data
  },
  props:{
    url:{type:String,default:'/'}
  },
  created:function(){
    this.addressId=this.$route.params.id;
    if(this.addressId==''||this.addressId==null){
      this.title='新增地址';
      $this.$emit('appListen','loading',true);
      $this.clearParams();
      axios({   //现实省会城市信息
        method:'post',
        url: $basePath+'?c=UserAddress&m=getProvince',
      })
      .then((response) => {
        $this.$emit('appListen','loading',false);
        //200131表示已登陆状态，200132表示未登录
        let data =  response.data
        if(data.code=='600100'){
          let arr = data.data
          this.provinces = arr
        }
      })
      .catch(function (error) { 
        $this.$emit('appListen','loading',false);
          //console.log(error);
        });
    }else{
      this.title='编辑地址';
      $this.$emit('appListen','loading',true);
      axios({   //现实省会城市信息
        method:'post',
        url: $basePath+'?c=UserAddress&m=getAddress',
        data:{
          addressId:$this.addressId
        }
      })
      .then((response) => {
        $this.$emit('appListen','loading',false);
        switch(parseInt(response.data.code)){
          case 600220 :{
            var $res = response.data.data;
            $this.getCity=$res.citys;   // 市
            $this.area=$res.areas;  // 区
            $this.provinces=$res.provinces;
            $this.provincesId=$res.addressData.province;
            $this.cityId=$res.addressData.city;
            $this.areaId=$res.addressData.district;
            $this.consignee=$res.addressData.consignee;
            $this.mobile=$res.addressData.mobile;
            $this.address=$res.addressData.address;
            $this.zipcode=$res.addressData.zipcode;
            $this.tel=$res.addressData.tel;
            if(parseInt($res.addressData.is_default)==1)$this.checked=true;
            else $this.checked=false;
            break;
          }
          case 600221 ://console.log("请填写必填项");
          case 888 :$user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
          default:$this.$router.push({path:this.url});
        }
      })
      .catch(function (error) { 
        $this.$emit('appListen','loading',false);
        //console.log(error);
      }); 
    }
  },
  mounted:function(){
  },
  watch:{
    
  },
  methods:{
    goBack:function(){
      $this.$router.push({path:this.url});
    },
    ok:function(){
      if($this.consignee==null||$this.consignee==''){
        $this.consigneeError=true;
        mui.toast('请填写<br/>收货人姓名',{ duration:'short', type:'div' });
        return false;
      }
      // if($illegalCheck.test($this.consignee)){
      //   $this.consigneeError=true;
      //   mui.toast('含有非法字符<br/>请剔除',{ duration:'short', type:'div' });
      //   return false;
      // }
      if($this.mobile==null||$this.mobile==''){
        $this.mobileError=true;
        mui.toast('请填写<br/>收货人电话',{ duration:'short', type:'div' });
        return false;
      }
      if(!$phoneCheck.test($this.mobile)){
        $this.mobileError=true;
        mui.toast('无效的手机号',{ duration:'short', type:'div' });
        return false;
      }
      if($this.provincesId==null||$this.provincesId==''){
        $this.proviceError=true;
        mui.toast('请填写<br/>省/自治区',{ duration:'short', type:'div' });
        return false;
      }
      if($this.cityId==null||$this.cityId==''){
        $this.cityError=true;
        mui.toast('请填写<br/>城市/地区',{ duration:'short', type:'div' });
        return false;
      }
      if($this.areaId==null||$this.areaId==''){
        $this.areaError=true;
        mui.toast('请填写<br/>区/县',{ duration:'short', type:'div' });
        return false;
      }
      if($this.address==null||$this.address==''){
        $this.addressError=true;
        mui.toast('请填写<br/>详细地址',{ duration:'short', type:'div' });
        return false;
      }
      // if($illegalCheck.test($this.address)){
      //   $this.addressError=true;
      //   mui.toast('含有非法字符<br/>请剔除',{ duration:'short', type:'div' });
      //   return false;
      // }
      if($this.zipcode==null||$this.zipcode==''){

      }else{
        var reg= /^[0-9]{6}$/;
        if(!reg.test($this.zipcode)){
          $this.zipcodeError=true;
          mui.toast('邮编不正确',{ duration:'short', type:'div' });
          return false;
        }
      }
      if($this.tel==null||$this.tel==''){

      }else{
        reg= /^[0-9]{11}$/;
        if(!reg.test($this.tel)){
          $this.telError=true;
          mui.toast('无效的固定电话',{ duration:'short', type:'div' });
          return false;
        }
      }
      if($this.checked)$this.isDefault=1;
      else $this.isDefault=0;
      if($this.addressId<1){
        $this.$emit('appListen','loading',true);
        axios({   //市区
          method:'post',
          url: $basePath+'?c=UserAddress&m=addAddress',
          data:{
            consignee:$this.consignee,
            mobile:$this.mobile,
            provinceId:$this.provincesId,
            cityId:$this.cityId,
            areaId:$this.areaId,
            address:$this.address,
            zipcode:$this.zipcode,
            tel:$this.tel,
            isDefault:$this.isDefault,
          }
        })
        .then((response) => {
          $this.$emit('appListen','loading',false);
          //200131表示已登陆状态，200132表示未登录
          let data =  response.data
          switch(parseInt(response.data.code)){
            case 600200 :{
              $this.$router.push({name:'/success',params:{type:0,title:'新增成功',content:'新增地址成功',url:$this.url,btnText:'确认'}});
              $this.clearParams();
              break;
            }
            case 600201 ://console.log('请填写必填项');break;
            case 600202 : 
            $this.mobileError=true;
            mui.alert('无效的手机号');
            break;
            case 600203 : 
            $this.proviceError=true;
            mui.alert('区域不合法');
            case 600204 : $user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            case 600205 : mui.alert('新增失败<br/>请稍后重试');
            case 888:$user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            default:mui.alert('服务器忙<br/>请稍后重试');break;
          }
        })
        .catch(function (error) { 
          $this.$emit('appListen','loading',false);
          //console.log(error);
        }); 
      }else{
        $this.$emit('appListen','loading',true);
        axios({   //市区
          method:'post',
          url: $basePath+'?c=UserAddress&m=editAddressByUser',
          data:{
            consignee:$this.consignee,
            mobile:$this.mobile,
            provinceId:$this.provincesId,
            cityId:$this.cityId,
            areaId:$this.areaId,
            address:$this.address,
            zipcode:$this.zipcode,
            tel:$this.tel,
            isDefault:$this.isDefault,
            addressId:$this.addressId
          }
        })
        .then((response) => {
          $this.$emit('appListen','loading',false);
          //200131表示已登陆状态，200132表示未登录
          let data =  response.data
          
          switch(parseInt(response.data.code)){
            case 600210 :{
              $this.$router.push({name:'/success',params:{type:0,title:'修改成功',content:'修改地址成功',url:$this.url,btnText:'确认'}});
              $this.clearParams();
              break;
            }
            case 600211 ://console.log('请填写必填项');break;
            case 600212 : mui.alert('无效的手机号');$this.mobileError=true;break;
            case 600213 : $this.proviceError=true;
            mui.alert('区域不合法');break;
            case 600214 : $user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            case 600215 : mui.alert('修改失败<br/>请稍后重试');
            case 888 :$user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            default:mui.alert('服务器忙<br/>请稍后重试');break;
          }
        })
        .catch(function (error) { 
          $this.$emit('appListen','loading',false);
          //console.log(error);
        }); 
      }
    },
    clearParams:function(){
      $this.getCity=[],   // 市
      $this.area=[],  // 区
      $this.provincesId='',
      $this.cityId='',
      $this.areaId='',
      $this.consignee='',
      $this.mobile='',
      $this.address='',
      $this.zipcode='',
      $this.tel='',
      $this.addressId='',
      $this.checked=true,
      $this.consigneeError=false;
      $this.mobileError=false;
      $this.proviceError=false;
      $this.cityError=false;
      $this.areaError=false;
      $this.addressError=false;
      $this.zipcodeError=false;
      $this.telError=false;
    },
    checkClick:function(e){
      $this.checked=!$this.checked;
      //console.log("click");
    },
    provinceListen:function(e){
      $this.provincesId = document.getElementById('provice').value
      $this.getCity = [] //清除 市区
      $this.area = []  // 清除 地区
     // $this.sheng=e.target.value;
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
        
        if(data.code=='600100'){
          let arr = data.data
          $this.getCity = arr 
          
        }
      })
      .catch(function (error) { 
        //console.log(error);
      });  
    },
    cityListen:function(e){
      $this.cityId = document.getElementById('cityId').value  // 地区
      $this.area =[]
      axios({
        method:'post',
        url: $basePath+'?c=UserAddress&m=getArea',
        data:{cityId:$this.cityId},
      })
      .then((response) => {
        //200131表示已登陆状态，200132表示未登录
        let data =  response.data
        if(data.code=='600100'){
          let arr = data.data
        //  debugger
        $this.area = arr
        
      }
    })
      .catch(function (error) { 
        //console.log(error);
      }); 
    },
    areaListen:function(e){
      $this.areaId = document.getElementById('areaId').value  // 地区
    },
    clearConsignee:function(){
      $this.consigneeError=false;
    },
    clearMobile:function(){
      $this.mobileError=false;
    },
    clearProvince:function(){
      $this.proviceError=false;
    },
    clearCity:function(){
      $this.cityError=false;
    },
    clearArea:function(){
      $this.areaError=false;
    },
    clearAddress:function(){
      $this.addressError=false;
    },
    clearZipcode:function(){
      $this.zipcodeError=false;
    },
    clearTel:function(){
      $this.telError=false;
    },
    selectedListen:function($adddressId){
      $this.selectAddress=$adddressId;
    }
  },
  components:{
    'mHead':mHead
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .addressAdd{
    footer{
      height:3.57rem;
      z-index:9999;
      position:fixed;
      background-color:white;
    }
    content{
      input,select,textarea{
        &.error{
          border: 1px solid #c8161e;
        }
      }
      margin-bottom: 2.86rem;
      display:block;
      background-color:white;
      padding:0 1.25rem;
      select{
        option{
          &:first-child{
            display:none;
            color:#9da2a6;
          }
          color:#333333;
        }
        border-radius:8px;
        width:100%;
        padding:0 1.7825rem;
        height:3.57rem;
        font-size:0.928rem;
        &.default-style{
          color:#9DA2A6;
        }
        &.selected-style{
          color:#333333;
        }
      }
      .address-list{
        display:flex;
        justify-content:space-between;
        select{
          &:nth-child(1),&:nth-child(2){
            flex:1
          }
          &:nth-child(1){
            margin-right:1rem;
          }
          &:nth-child(2){
            margin-left:1rem;
          }
        }
      }
      label{
        font-size:1.07rem;
        color:#5c6670;
        margin-bottom:0.714rem;
        display: block;
      }
      .default-info{
        >label{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }
      }
      textarea{
        padding:0.96rem 1.7825rem;
        border-radius:8px;
        border:1px solid #e0e0e0;
        height:3.57rem;
        width:100%;
        margin-bottom:1.07rem;
        font-size:0.928rem;
      }
      input{
        padding:0 1.7825rem;
        border-radius:8px;
        border:1px solid #e0e0e0;
        height:3.57rem;
        width:100%;
        margin-bottom:1.07rem;
        font-size:0.928rem;
        &:nth-child(1){
          margin-top:0;
        }
      }
      ul{
        padding:0 1.07rem;
        color:#cc1c1d;
        li{
          font-size:0.929rem;
          margin-bottom:0.357rem;
          &:last-child{
            margin-bottom:0;
          }
        }
      }
      .title{
        display:block;
        text-align:left;
        font-size:1.29rem;
        padding:1.79rem 0rem;
        background-color:white;
      }
      .group-btn{
        width:100%;
        display:flex;
        justify-content:center;
        button{
          width:100%;
          height:3.14rem;
          font-size:1.29rem;
          padding:0 .5rem;
          margin:0 .5rem;
          color:#fff;
          background:#c8161e;
          border:none;
          border-radius:8px;
          letter-spacing:1px;
        }
      }
    }
  }
</style>
