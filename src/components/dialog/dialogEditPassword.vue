<template>
  <div class="dialogEditPassword">
    <mHead :title="'修改密码'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <section>
        <div class="group" :class="{'error':oriPassError}">
         <label class="label-pwd"></label>
         <input type="password" placeholder="请输入原密码" v-model="oriPass" @focus="clearOriPass">
       </div>
     </section>
     <section>
      <div class="group" :class="{'error':newPassError}">
        <label class="label-pwd"></label>
        <input type="password" placeholder="请输入新密码" v-model="newPass" @focus="newPassError">
      </div>
    </section>
    <section>
      <div class="group" :class="{'error':confirmPassError}">
        <label class="label-pwd"></label>
        <input type="password" placeholder="请重复新密码" v-model="confirmPass" @focus="confirmPassError">
      </div>
    </section>
    <section class="short">
     <div class="group" :class="{'error':captchaError}">
      <label class="label-identifying"></label>
      <input type="text" maxlength="4" placeholder="请输入验证码" v-model="captcha" @focus="clearCaptcha">
    </div>
    <img :src="captchaImg" @click="getCaptcha">
  </section>
  <div class='group-btn'><button @click="editPassword">确认</button></div>
</content>
<!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
</div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  import mui from '../../../static/mui.js'
  import axios from 'axios'
  var $data = {
    code:'',
    oriPass:'',
    newPass:'',
    confirmPass:'',
    captcha:'',
    oriPassError:false,
    newPassError:false,
    confirmPassError:false,
    captchaError:false,
    captchaImg:'',
    captchaFlag:true
  }
  var $this = {}
  export default {
    name: 'dialogEditPhoneOne',
    data () {
      $this = this
      return $data
    },
    props:{
    },
    created:function(){
      window.scrollTo(0,0);
      this.getCaptcha();
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      goBack:function(){
        $this.$router.push({path:'/info'});
      },
      getCaptcha:function(){
        if($this.captchaFlag){
          axios({
            method:'post',
            url: $basePath+'?c=User&m=getCaptcha',
            data: {}
          })
          .then((response) => {
          //操作码 500320或500323表示发送成功，500321发送失败，500322填写正确手机号，500323填写必填项，500324填写正确类型
          this.captchaImg=$codePicPath+response.data.data;
          $this.captchaFlag=true;
          //console.log(response.data)
        })
          .catch(function (error) { 
            //console.log(error);
          });
          $this.captchaFlag=false;
        }
      },
      editPassword:function(){
        if(!$this.checkEmpty())return false;
        axios({
          method:'post',
          url: $basePath+'?c=User&m=changePass',
          data:  {
            'oriPass':$this.oriPass,
            'newPass':$this.newPass,
            'confirmPass':$this.confirmPass,
            'captcha':$this.captcha
          }
        })
        .then((response) => {
        //500260表示密码修改成功，请重新登陆,500261表示填写必填项,500262表示用户不存在,500263表示验证码验证失败,500264表示服务器忙，稍后重试，500265表示原密码错误，500266表示两次密码不相同！
        switch(parseInt(response.data.code)){
          case 500260 :$user='';$this.$router.push({name:'/success',params:{type:0,title:'修改成功',content:'修改密码成功',url:'/login',btnText:'重新登录'}});this.$destroy();break;
          case 500261 ://console.log("请填写必填项");break;
          case 500262 :mui.alert('用户不存在<br/>请刷新后重试');break;
          case 500263 :$this.captchaError=true;mui.alert('验证码<br/>错误或超时<br/>请重试');break;
          case 500264 :$this.captchaError=true;mui.alert('服务器忙<br/>稍后重试');break;
          case 500265 :$this.oriPassError=true;mui.alert('核对原密码错误');break;
          case 500265 :$this.newPassError=$this.confirmPassError=true;mui.alert('新密码不一致');break;
          case 888:$user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
          default:break;
        }
        //console.log(response.data)
      })
        .catch(function (error) { 
        //console.log(error);
      });
      },
      checkEmpty:function(){
        if($this.oriPass==''||$this.oriPass==null){
          $this.oriPassError=true;
          mui.toast('请填写原密码',{ duration:'short', type:'div' });
          return false;
        }else if($this.newPass==''||$this.newPass==null){
          $this.newPassError=true;
          mui.toast('请填写新密码',{ duration:'short', type:'div' });
          return false;
        }else if(!/^[A-Za-z0-9]{6,20}$/.test($this.newPass)){
          mui.toast('密码是6-20位字母数字组合',{ duration:'short', type:'div' });  
          $this.newPassError=true;
          return false;
        }else if($this.confirmPass==''||$this.confirmPass==null){
          $this.confirmPassError=true;
          mui.toast('请确认新密码',{ duration:'short', type:'div' });
          return false;
        }else if($this.newPass!=$this.confirmPass){
          $this.newPassError=true;
          $this.confirmPassError=true;
          mui.toast('新密码不一致',{ duration:'short', type:'div' });
          return false;
        }else if($this.captcha==''||$this.captcha==null){
          $this.captchaError=true;
          mui.toast('请填写<br/>4位操作码',{ duration:'short', type:'div' });
          return false;
        }else if($this.captcha.length<4){
          $this.captchaError=true;
          mui.toast('请填写<br/>4位操作码',{ duration:'short', type:'div' });
          return false;
        }
        return true;
      },
      clearOriPass:function(){
        $this.oriPassError=false;
      },
      clearNewPass:function(){
        $this.newPassError=false;
        $this.confirmPassError=false;
      },
      clearConfirmPass:function(){
        $this.newPassError=false;
        $this.confirmPassError=false;
      },
      clearCaptcha:function(){
        $this.captchaError=false;
      },
    },
    components:{
     mHead:mHead
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .dialogEditPassword{
    content{
      .error{
        border:1px solid #c8161e!important;
      }
      margin-bottom: 2.86rem;
      display:block;
      background-color:white;
      padding:0 1.25rem;
      section{
       margin-top:1.07rem;
       display: flex;
       justify-content: space-between;
       align-items: center;
       &:first-child{
        margin-top:2.14rem;
      }
      &.short{
        .group{
          width:13.93rem;
        }
      }
      .group{
        box-sizing:border-box;
        border:1px solid #e0e0e0;
        display: flex;
        border-radius:0.286rem;
        width:100%;
        position:relative;
        label{
          position:absolute;
        }
        input{
          font-size:0.929rem;
          border-radius:8px;
          height:3.57rem;
          width:100%;
          line-height:1.57rem;
          margin:0;
          border:0;
          padding-left:3.57rem;
        }
      }
      img,button{
        width:9rem;
        height:100%;
        height:3.57rem;
        color:white;
        background-color:#5c6670;
        font-size:0.939rem;
        letter-spacing:1px;
      }
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
