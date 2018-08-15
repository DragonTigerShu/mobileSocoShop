<template>
  <div>
    <Headers></Headers>
    <div class="register ">
      <div class="register-title">
       <h3 class="header-title">注册账号</h3>
     </div>
     <div class="register-tel-input">
      <section>
        <div class="register-info" :class="{'error':phoneError}" v-model="phone">
         <label class="label-tel"></label>
         <input type="text" placeholder="请输入手机号" class="input" v-model="phone" @focus="clearPhone">
       </div>
     </section>
     <section>
      <div class="register-identifying" :class="{'error':codeError}" v-model="code">
       <label class="label-identifying"></label>
       <input type="text" placeholder="请输入验证码" class="input" maxlength="6" v-model="code" @focus="clearCode">
     </div>
     <button type="button" class="code" :disabled="disabled" @click="sendcode">{{regBtn}}</button>
   </section>
   <section>
    <div class="register-pwd" :class="{'error':passwordError}" v-model="password">
      <label class="label-pwd"></label>
      <input type="password" placeholder="请输入登录密码" class="input" v-model="password" @focus="clearPassword">
    </div>
  </section>
  <section>
    <div class="register-pwd" :class="{'error':confirmPasswordError}" v-model="confirmPassword">
      <label class="label-pwd"></label>
      <input type="password" placeholder="请再次输入登录密码" class="input" v-model="confirmPassword" @focus="clearConfirmPassword">
    </div>
  </section>
</div>
<div class="register-button">
  <button type="button" class="button" @click="register">立即注册</button>
</div>
<div class="register-now">
  <p>还没有账号，立即</p><div @click="goLogin">登录</div>
</div>
</div>
</div>
</template>

<script>
import Header from '../../components/header/header.vue'; //头部信息
import axios from 'axios'
import mui from '../../../static/mui.js'
let $this = {}
let $data = {
  phone:'',
  code:'',
  password:'',
  confirmPassword:'',
  phoneError:false,
  codeError:false,
  passwordError:false,
  confirmPasswordError:false,
  regBtn:'获取验证码',
  disabled:false,
  time:0
}
export default{
 data (){
   $this = this
   return $data
 },
 methods: {
             //注册成功
             register:function(){
              if(!$this.checkEmpty())return false;
              axios({
                method:'post',
                url: $basePath+'?c=User&m=regUser',
                data: {
                  'phone':$this.phone,
                  'password':$this.password,
                  'confirmPassword':$this.confirmPassword,
                  'code':$this.code
                }
              })
              .then((response) => {
                //操作码 500200或500203表示注册成功，500201填写必填项，500202校验码超时或不正确，500205填写正确手机号，500204手机号已注册，500206两次密码不同
                //console.log(response.data)
                switch(parseInt(response.data.code)){
                  case 500200 :$this.$router.push({name:'/success',params:{type:0,title:'注册成功',content:'注册成功',url:'/login',btnText:'去登录'}});break;
                  case 500201 ://console.log('填写必填字段');break;
                  case 500202 :
                  mui.alert('验证码<br/>错误或已过期<br/>请重试');
                  $this.codeError=true;
                  break;
                  case 500203 :
                  $this.$router.push({name:'/success',params:{type:0,title:'注册成功',content:'注册成功',url:'/login',btnText:'去登录'}});
                  break;
                  case 500204 :
                  mui.alert('手机号已被注册');
                  $this.phoneError=true;
                  break;
                  case 500205 :
                  mui.alert('无效的手机号');
                  $this.phoneError=true;break;
                  case 500206 :
                  mui.alert('前后密码不一致');
                  $this.passwordError=true;
                  $this.confirmPasswordError=true;
                  break;
                  case 500207:
                  mui.alert('请使用<br/>接收短信的手机号<br/>注册');
                  $this.phoneError=true;
                  break;
                  default:break;
                }
              })
              .catch(function (error) { 
                  //console.log(error);
                });
            },
            goLogin:function(){
              $this.$router.push({path:'/login'})
              window.scrollTo(0,0);
            },
            sendcode:function(){
              if(/^1[34578]\d{9}$/.test($this.phone)){
                $this.code=""
                $this.time=60
                $this.disabled=true
                $this.setInter()
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
           //验证信息
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
          },
          clearCode:function(){
            $this.codeError=false;
          },
          clearConfirmPassword:function(){
            $this.confirmPasswordError=false;
            $this.passwordError=false;
          },
          clearPassword:function(){
            $this.confirmPasswordError=false;
            $this.passwordError=false;
          },
          checkEmpty(){
            if($this.phone==null||$this.phone==''){
              $this.phoneError=true;
              mui.toast('请填写手机号',{ duration:'short', type:'div' });
              return false;
            }else if(!/^1[34578]\d{9}$/.test($this.phone)){
              $this.phoneError=true;
              mui.toast('无效的手机号',{ duration:'short', type:'div' });
              return false;
            }else if($this.code==null||$this.code==''){
              $this.codeError=true;
              mui.toast('请填写6位验证码',{ duration:'short', type:'div' });
              return false;
            }else if($this.code.length<6){
              $this.codeError=true;
              mui.toast('请输入6位验证码',{ duration:'short', type:'div' });
              return false;
            }else if($this.password==null||$this.password==''){
              $this.passwordError=true;
              mui.toast('请填写密码',{ duration:'short', type:'div' });
              return false;
            }else if(!/^[A-Za-z0-9]{6,20}$/.test($this.password)){
              $this.passwordError=true;
              mui.toast('密码是6-20位字母数字组合',{ duration:'short', type:'div' }); 
              return false;
            }else if($this.confirmPassword==null||$this.confirmPassword==''){
              $this.confirmPasswordError=true;
              mui.toast('请填写确认密码',{ duration:'short', type:'div' });
              return false;
            }else if($this.password!=$this.confirmPassword){
              $this.passwordError=true;
              $this.confirmPasswordError=true;
              mui.toast('前后密码不一致',{ duration:'short', type:'div' });
              return false;
            }
            return true;
          }
        },
        components: {
         //注册
         'Headers':Header
       }
     }
   </script>

   <style lang="scss">
    .register{
      padding:1.5rem;
      .register-title{
        text-align: center;
        padding: 3.85rem 0 2.5rem 0;
        h3{
          font-size: 1.4rem;
          color:#333;
        }
      }
      .register-tel-input{
        section{
          &:first-child{
            margin-top:0rem;
          }
          margin-top:1.07rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .register-info , .register-pwd, .register-identifying{
            &.error{
              border: 1px solid #c8161e!important;
            }
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
          .register-identifying{
            width:13.93rem;
          }
          button{
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
        .errorpwd{
         margin-bottom:2rem;
         a{
           font-size: 1rem;
           color:#5c6670;
         }
         .forget{
          display: inline-block;
          float: right;
          color:#5c6670;
        }
      }
    }
    .register-button{
      width: 100%;
      padding: 0 1rem;
      position: relative;
      margin-top:2.5rem;
      button{
       width: 100%;
       height: 2.85rem;
       font-size: 1.1rem;
       padding: .5rem 0;
       line-height: 1.285rem;
       color: #fff;
       background: #c8161e;
       border: none;
       border-radius: 8px;
       letter-spacing: 1px;
     }
   }
   .register-now{
    text-align: center;
    margin-top: 2.5rem;
    p{
      display: inline-block;
    }
    >div{
      color: #c8161e;
      display: inline;
      margin-left: .4rem;
    }
  }
  
}
</style>
