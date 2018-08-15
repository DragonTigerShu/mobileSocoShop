<template>
  <div class="dialogEditPasswordOne">
    <mHead :title="'忘记密码'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <div class="title">请验证当前手机号</div>
      <section>
        <div class="group" :class="{'error':phoneError}">
          <label class="label-tel"></label>
          <input type="text" placeholder="请输入账户绑定的手机号码" maxlength="11" v-model="phone" @focus="clearPhone">
        </div>
      </section>
      <section class="short">
        <div class="group" :class="{'error':codeError}">
          <label class="label-identifying"></label>
          <input type="text" placeholder="请输入短信验证码" maxlength="6" v-model="code" @focus="clearCode">
        </div>
        <button :disabled="disabled" @click="sendcode">{{regBtn}}</button>
      </section>
      <section class="short">
        <div class="group" :class="{'error':captchaError}">
          <label class="label-identifying"></label>
          <input type="text" placeholder="请输入操作验证码" maxlength="4" v-model="captcha" @focus="clearCaptcha">
        </div>
        <img :src="captchaImg" @click="getCaptcha">
      </section>
      <div class='group-btn'><button @click="goNext">下一步</button></div>
    </content>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import mui from '../../../static/mui.js'
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  var $data = {
    disabled:false,
    regBtn:'获取验证码',
    time:0,
    phone:'',
    code:'',
    captcha:'',
    phoneError:false,
    codeError:false,
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
      getCaptcha:function(){
        if($this.captchaFlag){
          axios({
            method:'post',
            url: $basePath+'?c=User&m=getCaptcha',
            data: {}
          })
          .then((response) => {
            this.captchaImg=$codePicPath+response.data.data;
            $this.captcha='';
            $this.captchaFlag=true;
          //console.log(response.data);
        })
          .catch(function (error) { 
            //console.log(error);
          });
          $this,captcha="";
          $this.captchaFlag=false;
        }
      },
      sendcode:function(){
        if(/^1[34578]\d{9}$/.test($this.phone)){
          $this.time=60;
          $this.disabled=true;
          $this.setInter();
          $this.code='';
          axios({
            method:'post',
            url: $basePath+'?c=User&m=send_msg',
            data: {
              'phone':$this.phone,
              'type':2
            }
          })
          .then((response) => {
          //操作码 500320或500323表示发送成功，500321发送失败，500322填写正确手机号，500323填写必填项，500324填写正确类型
          //console.log(response.data)
        })
          .catch(function (error) { 
          //console.log(error);
        });
        }else{
          $this.phoneError=true;
          mui.toast('无效的手机号',{ duration:'short', type:'div' });
        }
      },
      setInter:function(){
        $this.timer = setInterval(() => {
          if($this.time>0){
            $this.time--
            $this.regBtn = $this.time+'s后重新获取'
            $this.disabled = true
          }else{
            $this.time=0
            $this.regBtn = '重新获取验证码'
            $this.disabled =  false
            clearInterval($this.timer)
          }
        },1000)
      },
      clearPhone:function(){
        $this.phoneError=false;
        $this.phoneErrorText='';
      },
      clearCode:function(){
        $this.codeError=false;
        $this.codeErrorText='';
      },
      clearCaptcha:function(){
        $this.captchaError=false;
        $this.captchaErrorText='';
      },
      goBack:function(){
        $this.$router.push({path:'/login'});
        this.$destroy();
      },
      goNext:function(){
        if(!$this.checkEmpty())return false;
        axios({
          method:'post',
          url: $basePath+'?c=User&m=checkPhone',
          data:  {
            'phone':$this.phone,
            'code':$this.code,
            'captcha':$this.captcha
          }
        })
        .then((response) => {
        //500240表示验证成功,500241表示填写必填项,500242表示手机格式不对,500243表示手机号不存在,500244表示校验码不正确，500245表示校验码已超时，请重新获取校验码，500246表示验证码验证失败
        switch(parseInt(response.data.code)){
          case 500240 :$this.$router.push({name:'/editPasswordTwo',params:{phone:$this.phone}});this.$destroy();break;
          case 500241 ://console.log("请填写必填项");break;
          case 500242 :$this.phoneError=true;mui.alert('手机号不正确');break;
          case 500243 :$this.phoneError=true;mui.alert('该手机号未注册');break;
          case 500244 :$this.codeError=true;mui.alert('短信验证码错误');break;
          case 500245 :$this.codeError=true;mui.alert('验证码超时<br/>请重新获取');break;
          case 500246 :$this.captchaError=true;mui.alert('操作验证码错误');break;
          case 500207 :$this.phoneError=true;mui.alert('非接收短信手机<br/>验证失败');break;
          case 500208 :$this.codeError=true;mui.alert('验证码超时<br/>请重新获取');break;
          default:break;
        }
        //console.log(response.data)
      })
        .catch(function (error) { 
        //console.log(error);
      });
      },
      checkEmpty:function(){
        if($this.phone==''||$this.phone==null){
          $this.phoneError=true;
          mui.toast('请填写手机号',{ duration:'short', type:'div' });
          return false;
        }else if(!/^1[34578]\d{9}$/.test($this.phone)){
          $this.phoneError=true;
          mui.toast('无效的手机号',{ duration:'short', type:'div' });
        }else if($this.code==''||$this.code==null){
          $this.codeError=true;
          mui.toast('请填写<br/>6位短信验证码',{ duration:'short', type:'div' });
          return false;
        }else if($this.code.length<6){
          $this.codeError=true;
          mui.toast('请填写<br/>6位短信验证码',{ duration:'short', type:'div' });
          return false;
        }else if($this.captcha==''||$this.captcha==null){
          $this.captchaError=true;
          mui.toast('请填写<br/>4位操作验证码',{ duration:'short', type:'div' });
          return false;
        }else if($this.captcha.length<4){
          $this.captchaError=true;
          mui.toast('请填写<br/>4位操作验证码',{ duration:'short', type:'div' });
          return false;
        }
        return true;
      }
    },
    components:{
      mHead:mHead
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .dialogEditPasswordOne{
    content{
      margin-bottom: 2.86rem;
      display:block;
      background-color:white;
      padding:0 1.25rem;
      section{
        margin-top:1.07rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &:nth-child(2){
          margin-top:0rem;
        }
        &.short{
          .group{
            width:13.93rem;
          }
        }
        .group{
          &.error{
            border:1px solid #c8161e!important;
          }
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
          &.disabled{
            background-color:#f5f5f5;
            border:1px solid #f5f5f5;
            label{
            }
            input{
              background-color:#f5f5f5;
              color:#9da2a6;
            }
          }
        }
        img,button{
          width:9rem;
          height:100%;
          height:3.57rem;
          color:white;
          background-color:#5c6670;
          font-size:0.939rem;
          border-radius:6px;
          letter-spacing:1px;
        }
      }
      .title{
        display:block;
        text-align:center;
        font-size:1.43rem;
        padding:2.32rem 0rem;
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
