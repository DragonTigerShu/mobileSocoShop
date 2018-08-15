<template>
  <div>
    <Headers></Headers>
    <div class="login">
      <div class="login-title">
       <h3 class="header-title">用户登录</h3>
     </div>
     <div class="login-tel-input">
      <section>
        <div class="login-info" :class="{'error':phoneError}">
         <label class="label-tel"></label>
         <input type="text" placeholder="请输入手机号" class="input" maxlength="11" v-model="phone" @focus="clearPhone">
       </div>
     </section>
     <section>
      <div class="login-pwd" :class="{'error':passwordError}">
        <label class="label-pwd"></label>
        <input type="password" placeholder="请输入密码" class="input" v-model="password" @focus="clearPassword">
      </div>
    </section>
    <div class="errorpwd"><div class="forget" @click="forgetListen">忘记密码?</div>
    
  </div>
</div>
<div class="login-button">
  <button type="button" class="button" @click="loginListen">立即登录</button>
</div>
<div class="login-register-now">
  <p>还没有账号，立即</p><div @click="register">注册</div>
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
  password:'',
  phoneError:false,
  passwordError:false,
}
export default{
 data (){
  $this = this
  return  $data
},
created:function(){
        //初始化
      },
      methods:{
        //方法
        register:function(){
            //console.log(1)
            $this.$router.push({path:'/register'});
            window.scrollTo(0,0);
          },
          forgetListen:function(){
            $this.$router.push({path:'/editPasswordOne'});
          },
          clearPhone:function(){
            $this.phoneError=false;
          },
          clearPassword:function(){
            $this.passwordError=false;
          },
          loginListen:function(){
            if(!$this.checkEmpty())return false;
            axios({
              method:'post',
              url: $basePath+'?c=User&m=login_in',
              data: {
                'phone':$this.phone,
                'password':$this.password
              }
            })
            .then((response) => {
                //操作码 500210表示登陆成功，500211表示必填字段必填，500212表示手机号不正确，500213用户不存在，500214表示密码错误，500215表示已登陆勿重复提交
                switch(parseInt(response.data.code)){
                  case 500210 : 
                  $this.password='';
                  $user=response.data.data;
                  $user.phone=$user.mobile_phone.substr(0,3)+"****"+$user.mobile_phone.substr(7,11);
                  if($user.head_pic!=null&&$user.head_pic!='')$user.headImg=$headPicPath+$user.head_pic;
                  $this.$router.push({name:'/success',params:{type:0,title:'登录成功',content:'登录成功',url:'/',btnText:'去购物'}});
                  break;
                  case 500211 : 
                      //console.log("必填字段必填");
                      break;
                      case 500212 : 
                      mui.alert('手机号不正确');
                      $this.phoneError=true;
                      break;
                      case 500213 : 
                      mui.alert('该手机未注册');
                      $this.phoneError=true;
                      break;
                      case 500214 : 
                      mui.alert('密码错误');
                      $this.passwordError=true;
                      break;
                      case 500215 :
                      $this.password='';
                      $this.$router.push({name:'/success',params:{type:0,title:'登录成功',content:'登录成功',url:'/',btnText:'去购物'}});
                      break;
                      default:break;
                    }
                  })
            .catch(function (error) { 
                  //console.log(error);
                });
          },
          checkEmpty:function(){
            if($this.phone==null||$this.phone==''){
              $this.phoneError=true;
              mui.toast('请填写手机号',{ duration:'short', type:'div' });
              return false;
            }else if(!/^1[34578]\d{9}$/.test($this.phone)){
              $this.phoneError=true;
              mui.toast('无效的手机号',{ duration:'short', type:'div' });
              return false;
            }else if($this.password==null||$this.password==''){
              $this.passwordError=true;
              mui.toast('请填写密码',{ duration:'short', type:'div' });
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
    .login{
      padding:1.5rem;
      .login-title{
        text-align: center;
        padding: 3.85rem 0 2.5rem 0;
        h3{
          font-size: 1.4rem;
          color:#333;
        }
      }
      .login-tel-input{
        section{
          margin-top:1.07rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          &:first-child{
            margin-top:0rem;
          }
          .login-info , .login-pwd{
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
        }
        .errorpwd{
          margin-bottom:2rem;
          a{
            font-size: 1rem;
            color:#5c6670;
          }
          .forget{
            margin:1.07rem 0;
            display: inline-block;
            float: right;
            color:#5c6670;
          }
        }
      }
      .login-button{
        width: 100%;
        padding: 0 1rem;
        position: relative;
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
     .login-register-now{
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
