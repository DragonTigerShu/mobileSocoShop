<template>
  <div class="dialogEditPasswordTwo">
    <mHead :title="'修改密码'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <section>
        <p>验证通过,请设置新密码</p>
      </section>
      <section>
        <div class="group" :class="{'error':errorFlag}">
          <label class="label-pwd"></label>
          <input type="password" placeholder="请输入新密码" v-model="password" @focus="clearListen">
        </div>
      </section>
      <section>
        <div class="group" :class="{'error':errorFlag2}">
          <label class="label-pwd"></label>
          <input type="password" placeholder="请重复新密码" v-model="password2" @focus="clearListen">
        </div>
      </section>
      <section class="short">
       <div class="group" :class="{'error':captchaError}">
        <label class="label-identifying"></label>
        <input type="text" maxlength="4" placeholder="请输入验证码" v-model="captcha" @focus="clearCaptcha">
      </div>
      <img :src="captchaImg" @click="getCaptcha">
    </section>
    <div class='group-btn'><button @click="ok">完成</button></div>
  </content>
  <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
</div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue' 
  import mui from '../../../static/mui.js'
  import axios from 'axios'
  var $data = {
    errorFlag:false,
    errorFlag2:false,
    captchaError:false,
    captchaImg:'',
    captchaFlag:true,
    password:'',
    password2:'',
    captcha:''
  }
  var $this = {}
  export default {
    name: 'dialogEditPasswordTwo',
    data () {
      $this = this
      return $data
    },
    props:{
    },
    created:function(){
      window.scrollTo(0,0);
      if(this.$route.params.phone==''||this.$route.params.phone==null){
        $this.$router.push({path:'/editPasswordOne'});
        this.$destroy();
      }else{
        this.getCaptcha();
      }
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      ok:function(){
        if(!$this.checkEmpty())return false;
        axios({
          method:'post',
          url: $basePath+'?c=User&m=changeToNewPass',
          data:  {
            newPass:$this.password,
            confirmPass:$this.password2,
            captcha:$this.captcha
          }
        })
        .then((response) => {
          switch(parseInt(response.data.code)){
            case 500250 :$this.$router.push({name:'/success',params:{type:0,title:'修改成功',content:'修改密码成功',url:'/login',btnText:'去登录'}});this.$destroy();break;
          case 500251 ://console.log("请填写必填项");break;
          case 500252 :mui.alert('用户不存在<br/>请刷新后重试');break;
          case 500253 :$this.captchaError=true;mui.alert('操作码<br/>错误或已过期');break;
          case 500254 :$this.captchaError=true;mui.alert('服务器忙<br>稍后重试');break;
          case 500256 :
          mui.alert('新密码不一致');
          $this.errorFlag=true;
          $this.errorFlag2=true;
          break;
          case 500257 :mui.alert('手机验证超时<br/>请重新验证','提示','确认',function(){
            $this.$router.push({path:'/editPasswordOne'});
            this.$destroy();
          });break;
          case 500208 :mui.alert('手机验证超时<br/>请重新验证','提示','确认',function(){
            $this.$router.push({path:'/editPasswordOne'});
            this.$destroy();
          });break;
          default:break;
        }
        //console.log(response.data)
      })
        .catch(function (error) { 
        //console.log(error);
      });
      },
      goBack:function(){
        $this.$router.push({path:'/login'});
        this.$destroy();
      },
      clearListen:function(){
        $this.errorFlag=false;
        $this.errorFlag2=false;
      },
      checkEmpty(){
        if($this.password==null||$this.password==''){
          mui.toast('请填写新密码',{ duration:'short', type:'div' });
          $this.errorFlag=true;
          return false;
        }else if(!/^[A-Za-z0-9]{6,20}$/.test($this.password)){
          mui.toast('密码是6-20位字母数字组合',{ duration:'short', type:'div' });  
          $this.errorFlag=true;
          return false;
        }
        else if($this.password2==null||$this.password2==''){
          mui.toast('请填写确认密码',{ duration:'short', type:'div' });
          $this.errorFlag2=true;
          return false;
        }else if($this.password2!=$this.password){
          mui.toast('前后密码不一致',{ duration:'short', type:'div' });
          $this.errorFlag=true;
          $this.errorFlag2=true;
          return false;
        }else if($this.captcha==null||$this.captcha==''){
          mui.toast('请填写<br/>4位操作验证码',{ duration:'short', type:'div' });
          $this.captchaError=true;
          return false;
        }else if($this.captcha.length<4){
          mui.toast('请填写<br/>4位操作验证码',{ duration:'short', type:'div' });
          $this.captchaError=true;
          return false;
        }
        return true;
      },
      clearCaptcha:function(){
        $this.captchaError=false;
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
          $this.captcha='';
          $this.captchaFlag=false;
        }
      },
    },
    components:{
     mHead:mHead
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .dialogEditPasswordTwo{
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
       p{
        color:#c8161e;
      }
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
        border-radius:8px;
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
