<template>
  <div class="dialogEditPhoneTwo">
    <mHead :title="'修改手机号'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <div class="title">验证成功,请设置新号码</div>
      <section>
        <div class="group" :class="{'error':phoneError}">
         <label class="label-tel"></label>
         <input type="text" placeholder="请输入新的手机号码" maxlength="11" v-model="phone" @focus="clearPhone">
       </div>
     </section>
     <section class="short">
      <div class="group" :class="{'error':codeError}">
       <label class="label-identifying"></label>
       <input type="text" placeholder="请输入短信验证码" maxlength="6" v-model="code" @focus="clearCode">
     </div>
     <button :disabled="disabled" @click="sendcode">{{regBtn}}</button>
   </section>
<!--       <section class="short">
	      <div class="group">
		      <label class="label-identifying"></label>
		      <input type="text" placeholder="请输入验证码" maxlength="4" v-model="capt">
	      </div>
	      <button>EMSH</button>
      </section> -->
      <div class='group-btn' @click="editPhone"><button>确认</button></div>
    </content>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  var $data = {
    time:0,
    disabled:false,
    regBtn:'获取验证码',
    phone:'',
    code:'',
    phoneError:false,
    codeError:false,
    phoneErrorText:'',
    codeErrorText:''
  }
  var $this = {}
  export default {
    name: 'dialogEditPhoneTwo',
    data () {
      $this = this
      return $data
    },
    props:{
    },
    created:function(){
      window.scrollTo(0,0);
      if(this.$route.params.phone==''||this.$route.params.phone==null){
        $this.$router.push({path:'/info/editPhoneOne'});
        this.$destroy();
      }
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      
      goBack:function(){
        $this.$router.push({path:'/info'});
      },
      editPhone:function(){
        if(!$this.checkEmpty())return false;
        axios({
          method:'post',
          url: $basePath+'?c=User&m=changeToNewPhone',
          data:  {
            'phone':$this.phone,
            'code':$this.code,
          }
        })
        .then((response) => {
        //500270表示验证成功，可进行下一步,500271表示填写必填项,500272表示手机格式不对,500274表示验证码验证失败,500275表示输入的手机号不是原来的手机号，500276表示校验码不正确
        switch(parseInt(response.data.code)){
          case 500280 :$this.$router.push({name:'/success',params:{type:0,title:'修改成功',content:'修改手机号成功',url:'/login',btnText:'重新登录'}});this.$destroy();break;
          case 500281 ://console.log("请填写必填项");break;
          case 500282 :$this.phoneError=true;mui.alert('无效的手机号');break;
          case 500283 :$this.phoneError=true;mui.alert('用户不存在<br/>请刷新后重试');break;
          case 500284 :$this.phoneError=true;mui.alert('服务器忙<br/>请稍后重试');break;
          case 500285 :$this.codeError=true;mui.alert('验证码<br/>错误或已超时<br/>请重新获取');break;
          case 500286 :$this.phoneError=true;mui.alert('手机号已被使用<br/>无法修改');break;
          case 888:$user='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
          default:break;
        }
        //console.log(response.data)
      })
        .catch(function (error){
        //console.log(error);
      });
      },
      sendcode:function(){
        if(/^1[34578]\d{9}$/.test($this.phone)){
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
          mui.toast('无效的手机号<br/>修改后重试',{ duration:'short', type:'div' });
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
    checkEmpty(){
      if($this.phone==''||$this.phone==null){
        $this.phoneError=true;
        mui.toast('请填写新手机号',{ duration:'short', type:'div' });
        return false;
      }else if(!/^1[34578]\d{9}$/.test($this.phone)){
        $this.phoneError=true;
        mui.toast('无效的手机号',{ duration:'short', type:'div' });
        return false;
      }else if($this.code==''||$this.code==null){
        $this.codeError=true;
        mui.toast('请填写<br/>6位短信验证码',{ duration:'short', type:'div' });
        return false;
      }else if($this.code.length<6){
        $this.codeError=true;
        mui.toast('请填写<br/>6位短信验证码',{ duration:'short', type:'div' });
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
  .dialogEditPhoneTwo{
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
