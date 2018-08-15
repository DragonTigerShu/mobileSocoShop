<template>
  <div class="dialogEditUserName">
    <mHead :title="'修改用户名'" @clickListen="goBack"></mHead>
    <div style="height:3.57rem"></div>
    <content>
      <section>
       <div class="group" :class="{'error':errorFlag}">
        <label class="label-tel"></label>
        <input type="text" placeholder="请输入新的用户名" v-model="userName" focus="clearUserName" maxlength="30" @focus="clearUserName">
      </div>
    </section>
    <div class='group-btn'><button @click="editUserName">确认</button></div>
  </content>
  <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
</div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  import mui from '../../../static/mui.js'
  import axios from 'axios'
  var $data = {
    userName:'',
    errorFlag:false
  }
  var $this = {}
  export default {
    name: 'dialogEditUserName',
    data () {
      $this = this
      return $data
    },
    props:{
    },
    created:function(){
      window.scrollTo(0,0);
      this.userName=$user.user_name;
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      goBack:function(){
        $this.$router.push({path:'/info'});
      },
      clearUserName:function(){
        $this.errorFlag=false;
      },
      editUserName:function(){
        if(!$this.checkEmpty())return false;
        axios({
          method:'post',
          url: $basePath+'?c=User&m=changeNH',
          data:  {
            'username':$this.userName
          }
        })
        .then((response) => {
        //500750表示修改头像成功,500751表示用户不存在,500752表示修改用户名成功,500753表示服务器忙，稍后重试,500754表示用户名太长啦！，500755表示服务器忙，稍后重试，500756表示图片编码不正确，500757表示并没有传递任何参数
        switch(parseInt(response.data.code)){
          case 500752 :
          $user.user_name=$this.userName;
          $this.$router.push({name:'/success',params:{type:0,title:'修改成功',content:'修改用户名成功',url:'/info',btnText:'确认'}});
          break;
          case 500753 :mui.alert('服务器忙<br/>稍后重试');break;
          case 500754 :mui.alert('用户名太长<br/>请修改');$this.errorFlag=true;break;
          case 500755 :mui.alert('服务器忙<br/>稍后重试');break;
          case 500757 :mui.alert('请填写用户名');$this.errorFlag=true;break;
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
        if($this.userName==null||$this.userName==''){
          $this.errorFlag=true;
          mui.toast('请填写用户名',{ duration:'short', type:'div' });
          return false;
        }
        if($this.userName.length>30){
          $this.errorFlag=true;
          mui.toast('用户名过长',{ duration:'short', type:'div' });
          return false;
        }
      /*if($illegalCheck.test($this.userName)){
        $this.errorFlag=true;
        mui.toast('用户名<br/>有非法字符<br/>请剔除',{ duration:'short', type:'div' });
        return false;
      }*/
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
  .dialogEditUserName{
    background-color:white;
    height:100%;
    content{
      .error{
        border:1px solid #c8161e!important;
      }
      display:block;
      background-color:white;
      padding:0 1.25rem;
      section{
       margin:5.71rem 0 12.14rem 0;
       display: flex;
       justify-content: space-between;
       align-items: center;
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
        line-height:0;
        margin:0;
        border:0;
        padding-left:3.57rem;
      }
    }
    .title{
      display:block;
      text-align:center;
      font-size:1.43rem;
      padding:2.86rem 0rem;
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
