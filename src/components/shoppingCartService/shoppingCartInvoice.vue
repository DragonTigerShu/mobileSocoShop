<template>
  <div class="shoppingCartInvoice">
    <mHead :title="'发票'" @clickListen="goBack"></mHead>
    <content>
      <div class="title">发票类型</div>
      <div class="group-btn">
        <button :class="invType==1?'invType':''" @click="clickListen(1)">个人</button>
        <button :class="invType==2?'invType':''" @click="clickListen(2)">公司</button>
        <button :class="invType==3?'invType':''" @click="clickListen(3)">增值税专用发票</button>
      </div>
      <div class="title">发票抬头</div>
      <section v-show="invType==1?true:false">
        <input v-model="invPayee" placeholder="请填写发票抬头(不填默认:个人)" maxlength="50">
      </section>
      <section v-show="invType==2?true:false">
        <input v-model="coName2" placeholder="请填写单位名称" maxlength="50">
        <input v-model="coIdentNo2" placeholder="请填写纳税人识别号" maxlength="50">
      </section>
      <section v-show="invType==3?true:false">
        <input v-model="coName1" placeholder="请填写单位名称" maxlength="50">
        <input v-model="coIdentNo1" placeholder="请填写纳税人识别号" maxlength="50">
        <input v-model="depBank" placeholder="请填写开户银行" maxlength="50">
        <input v-model="depBankNo" placeholder="请填写开户银行账户" maxlength="50">
        <input v-model="regAddress" placeholder="请填写注册地址" maxlength="50">
        <input v-model="regNumber" placeholder="请填写注册电话" maxlength="50">
      </section>
      <div class="title">发票须知</div>
      <ul>
        <li>1.发票内容为购买商品明细</li>
        <li>2.我们将发票与商品分开邮寄,请注意查收</li>
        <li>3.发票实际金额为实际支付金额,不包含优惠金额</li>
      </ul>
    </content>
    <footer>
      <button @click="confirm">
        确认
      </button>
    </footer>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  import mui from '../../../static/mui.js'
  var $data = {
    'invType':1,
    'invPayee':'',
    'coName1':'',
    'coIdentNo1':'',
    'coName2':'',
    'coIdentNo2':'',
    'depBank':'',
    'depBankNo':'',
    'regAddress':'',
    'regNumber':''
  }
  var $this = {}
  export default {
    name: 'shoppingCartInvoice',
    data () {
      $this = this
      return $data
    },
    props:{
    },
    created:function(){
      window.scrollTo(0,0);
      this.invType=$invType;
      this.invPayee=$invPayee;
      if(this.invType==2){
        this.coName2=$coName;
        this.coIdentNo2=$coIdentNo;
      }else{
        this.coName1=$coName;
        this.coIdentNo1=$coIdentNo;
      }
      this.depBank=$depBank;
      this.depBankNo=$depBankNo;
      this.regAddress=$regAddress;
      this.regNumber=$regNumber;
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      clickListen:function($invType){
      //console.log($invType);
      $this.invType=$invType;
    },
    goBack:function(){
      $this.$router.push({path:'/shoppingCart/Order'});
    },
    confirm:function(){
      $invType=$this.invType;
      switch($this.invType){
        case 1:{
          if($this.invPayee==''||$this.invPayee==null){
            $this.invPayee='个人';
            return false;
          }
          $invPayee=$this.invPayee;
          $depBank='';
          $depBankNo='';
          $regAddress='';
          $regNumber='';
          $coName='';
          $coIdentNo='';
          break;
        }
        case 2:{
          if($this.coName2==''||$this.coName2==null){
            mui.toast('请填写<br/>请填写公司名称',{ duration:'short', type:'div' });
            return false;
          }
          if($this.coIdentNo2==''||$this.coIdentNo2==null){
            mui.toast('请填写<br/>纳税人识别号',{ duration:'short', type:'div' });
            return false;
          }
          $invPayee='';
          $depBank='';
          $depBankNo='';
          $regAddress='';
          $regNumber='';
          $coName=$this.coName2;
          $coIdentNo=$this.coIdentNo2;
          break;
        }
        case 3:{
          if($this.coName1==''||$this.coName1==null){
            mui.toast('请填写<br/>请填写公司名称',{ duration:'short', type:'div' });
            return false;
          }
          if($this.coIdentNo1==''||$this.coIdentNo1==null){
            mui.toast('请填写<br/>纳税人识别号',{ duration:'short', type:'div' });
            return false;
          }
          if($this.depBank==''||$this.depBank==null){
            mui.toast('请填写<br/>开户银行',{ duration:'short', type:'div' });
            return false;
          }
          if($this.depBankNo==''||$this.depBankNo==null){
            mui.toast('请填写<br/>开户银行账户',{ duration:'short', type:'div' });
            return false;
          }
          if($this.regAddress==''||$this.regAddress==null){
            mui.toast('请填写<br/>注册地址',{ duration:'short', type:'div' });
            return false;
          }
          if($this.regNumber==''||$this.regNumber==null){
            mui.toast('请填写<br/>注册电话',{ duration:'short', type:'div' });
            return false;
          }
          $invPayee='';
          $coName=$this.coName1;
          $coIdentNo=$this.coIdentNo1;
          $depBank=$this.depBank;
          $depBankNo=$this.depBankNo;
          $regAddress=$this.regAddress;
          $regNumber=$this.regNumber;
          break;
        }
      }
      $this.$router.push({path:'/shoppingCart/Order'});
    }
  },
  components:{
    'mHead':mHead
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .shoppingCartInvoice{
    footer{
      padding:0 1.04rem;
      height:3.57rem;
      background-color:white;
    }
    content{
      margin-top:3.57rem;
      margin-bottom: 2.86rem;
      display:block;
      background-color:white;
      section{
        padding:0 1.25rem;
        background:white;
        margin-bottom:2.5rem;
      }
      input{
        border-radius:0.143rem;
        border:1px solid #e0e0e0;
        height:3.57rem;
        padding:0 1.07rem;
        width:100%;
        margin-top:1.07rem;
        &:nth-child(1){
          margin-top:0;
        }
      }
      ul{
        padding:0 1.07rem;
        li{
          color:#cc1c1d;
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
        padding:0 1.25rem 1.07rem 1.25rem;
        background-color:white;
        &:nth-child(1){
          padding-top:1.07rem;
        }
      }
      .group-btn{
        padding-top:1.43rem;
        padding-left:1.25rem;
        padding-right:1.25rem;
        padding-bottom:1.79rem;
        border-top:1px solid #e0e0e0;
        button{
          border-radius:0.143rem;
          border:1px solid #e0e0e0;
          color:#9da2a6;
          padding:1.04rem 1.79rem;
          font-size:0.93rem;
          flex: 1;
          margin-left:1.07rem;
          &:first-child{
            margin-left:0;
          }
          &.invType{
           border:1px solid #c8161e;
           color:#c8161e;
         }
       }
       background-color:white;
       display:flex;
       flex-direction:row;
       justify-content:space-between;
     }
   }
   footer{
    width:100%;
    display:flex;
    justify-content:center;
    align-items:center;
    margin-bottom:1.07rem;
    button{
      width:100%;
      height:2.85rem;
      font-size:1.1rem;
      padding:.5rem 0;
      line-height:1.285rem;
      color:#fff;
      background:#c8161e;
      border:none;
      border-radius:8px;
      letter-spacing:1px;
    }
  }
  
}
</style>
