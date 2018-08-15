<template>
  <div class="shoppingCartServiceShopping">
    <mHead :title="'我的购物车'" @clickListen="goBack">
      <div v-if="scData.length!=0" slot="main-right" @click="editCart">{{editCartText}}</div>
    </mHead>
    <div style="height:3.57rem"></div>
    <section v-if="scData.length==0">
      <div class="goodsListContent">
        <img :src="imgCart">
        <p>购物车空空如也~</p>
        <!-- <button @click="goBack">马上去购物</button> -->
      </div>
      <footer>
        <div class="shopping-empty-footer"><button @click="goBack">马上去购物</button></div>
      </footer>
    </section>
    <section v-else>
      <content>
        <gLi name="goodsListContentLi" v-for="(d,index) in scData" :moveFlag="moveFlag" :index="index" :key="index" :data="d" :minusDis="minusGroup[index]" :addDis="addGroup[index]" @checkedListen='checkedListen' @aNClickListen="aNClickListen" @removeListen="removeListen" @moveListen="moveListen">
        </gLi>
      </content>
      <footer>
        <ul class="shopping-footer">
          <li>
            <input type="checkbox" style="display:none" id="goodListAll" @click="checkClick" :checked="checked"><label for="goodListAll"><img :src="checked ? imgchecked : imgUnChecked " >全选</label>
          </li>
          <li style="min-width:3.571rem"><p>不含运费</p></li>
          <li class="total"><p>共{{selected}}件金额:</p><span>￥{{total.toFixed(2)}}</span></li>
          <li><button @click="goOrder">去结算</button></li>
        </ul>
      </footer>
    </section>
    <!-- <input type="button" @click="HelloAxios()" value="按钮"> -->
  </div>
</template>
<script>
  import goodsListContentRemoveLi from '@/components/shoppingCartService/goodsListContentRemoveLi.vue';
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  var $data = {
    'flag':true,
    'selected':0,
    'checked': true,
    'moveFlag':-1,
    'editCartFlag':true,
    'editCartText':'编辑',
    'scData':[],
    'total':0,
    'addGroup':[],
    'minusGroup':[],
    'imgUnChecked':require('../../common/images/main/checkbox.png'),
    'imgchecked':require('../../common/images/main/checkbox-checked.png'),
    'imgCart':require('../../common/images/main/cart.png')
  }
  var $this = {}
  export default {
    name: 'shoppingCartServiceShopping',
    data () {
      $this = this
      return $data
    },
    props:{
      reloadCart:Boolean
    },
    created:function(){

    },
    mounted:function(){
      window.scrollTo(0,0);
      this.$emit('parentListen','reloadCart');
    },
    watch:{
      reloadCart(curVal,oldVal){
        this.initCart();
      }
    },
    methods:{
      initCart:function(){
        if($cart!=null&&$cart!=''){
          $this.scData=$cart.list;
          $this.total=$cart.totalPrice;
          var selected=0;
          var totalNum=0;
          var flag=true;
          if($this.scData==null||$this.scData==""){
            flag=false;
          }else{
            $this.minusGroup=[];
            $this.addGroup=[];
            for(var i=0;i<$this.scData.length;i++){
              if($this.scData[i].goods_num==1)$this.minusGroup.push(true);
              else $this.minusGroup.push(false);
              $this.addGroup.push(false);
              if($this.scData[i].selected==1){
                selected+=parseInt($this.scData[i].goods_num);
              }else{
                flag=false;
              }
              totalNum+=parseInt($this.scData[i].goods_num);
            }
          }
          $this.totalNum=totalNum;
          $this.selected=selected;
          $this.checked=flag;
        }
      },
      goOrder:function(){
        $selectAddress=0;
      $invType=1;//发票信息
      $invPayee='个人';//发票信息
      $coName='';//发票信息
      $coIdentNo='';//发票信息
      $depBank='';//发票信息
      $depBankNo='';//发票信息
      $regAddress='';//发票信息
      $regNumber='';//发票信息
      $this.$router.push({path:'/shoppingCart/Order'});
      // if($this.flag){
      //   $this.$emit('appListen','loading',true);
      //   $this.flag=false;
      //   axios({
      //     method:'post',
      //     url: $basePath+'?c=Cart&m=getCarts',
      //     data:{}
      //   })
      //   .then((response) => {
      //     //console.log(response.data.data);
      //     $this.$emit('appListen','loading',false);
      //     $this.flag=true;
      //     switch(parseInt(response.data.code)){
      //       case 1000500 :{
      //         $cart=response.data.data;
      //         $this.$emit('parentListen','goOrder');
      //         break;
      //       }
      //       case 1000510 :break;
      //       case 1000520 :break;
      //       case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
      //       default:mui.alert('服务器忙<br/>稍后重试');break;
      //     }
      //   })
      //   .catch(function (error) {
      //     $this.$emit('appListen','loading',false);
      //     //console.log(error);
      //   });
      // }
    },
    goBack:function(){
      $this.$emit('appListen','loading',false);
      $this.$router.push({path:'/'});
    },
    // goManage:function(){
    //   $this.$router.push({path:'/shoppingCart/Service/Manage'});
    // },
    editCart:function(){
      if($this.editCartFlag){
        $this.moveFlag=-2;
        $this.editCartText='完成'
      }else{
        $this.moveFlag=-1;
        $this.editCartText='编辑'
      }
      $this.editCartFlag=!$this.editCartFlag;
    },
    checkClick:function(e){
      if($this.scData.length!=0){
        if($this.flag){
          $this.$emit('appListen','loading',true);
          $this.flag=false;
          var recIds=[];
          var isSelect='';
          if(e.target.checked)isSelect=1;
          else isSelect=0;
          for(var i=0;i<$this.scData.length;i++){
            recIds.push($this.scData[i].rec_id);
          }
          axios({
            method:'post',
            url: $basePath+'?c=Cart&m=selectCart',
            data: {
              'recIds':recIds,
              'isSelect':isSelect
            }
          })
          .then((response) => {
              //console.log(response.data);
              $this.flag=true;
              $this.$emit('appListen','loading',false);
              switch(parseInt(response.data.code)){
                case 1000700 :$this.$emit('parentListen','reloadCart');break;
                case 1000710 ://console.log("请填写必填项");break;
                case 1000720 :mui.alert('服务器忙<br/>稍后重试');break;
                case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
                default:mui.alert('服务器忙<br/>刷新重试');break;
              }
            })
          .catch(function (error) {
              //console.log(error);
            });
        }
      }
    },
    checkedListen:function($i,$b){
      if($this.flag){
        $this.$emit('appListen','loading',true);
        $this.flag=false;
        var recIds=[];
        var isSelect='';
        if($b)isSelect=1;
        else isSelect=0;
        recIds.push($this.scData[$i].rec_id);
        axios({
          method:'post',
          url: $basePath+'?c=Cart&m=selectCart',
          data: {
            'recIds':recIds,
            'isSelect':isSelect
          }
        })
        .then((response) => {
            //console.log(response.data);
            $this.$emit('appListen','loading',false);
            $this.flag=true;
            switch(parseInt(response.data.code)){
              case 1000700 :$this.$emit('parentListen','reloadCart');break;
              case 1000710 ://console.log("请填写必填项");break;
              case 1000720 :mui.alert('服务器忙<br/>稍后重试');break;
              case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
              default:mui.alert('服务器忙<br/>刷新重试');break;
            }
          })
        .catch(function (error) {
            //console.log(error);
          });
      }
    },
    aNClickListen:function($i,$b){
      //true ++ false--
      if($this.flag){
        $this.flag=false;
        $this.$emit('appListen','loading',true);
        var goodsNum=$this.scData[$i].goods_num;
        var recId=$this.scData[$i].rec_id;
        if($b){
          goodsNum++;
        }else{
          goodsNum--;
        }
        if(goodsNum>0){
          axios({
            method:'post',
            url: $basePath+'?c=Cart&m=changeNum',
            data:{
              'goodsNum':goodsNum,
              'recId':recId
            }
          })
          .then((response) => {
              //console.log(response.data);
              $this.$emit('appListen','loading',false);
              $this.flag=true;
              switch(parseInt(response.data.code)){
                case 1000600 :$this.$emit('parentListen','reloadCart');break;
                case 1000610 ://console.log("请填写必填项");break;
                case 1000630 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
                case 1000640 :break;
                case 1000650 :mui.alert('服务器忙<br/>稍后重试');break;
                case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
                default:mui.alert('服务器忙<br/>刷新重试');break;
              }
            })
          .catch(function (error) {
              //console.log(error);
            });
        }else{
          $this.flag=true;
          $this.$emit('appListen','loading',false);
        }
      }
    },
    removeListen:function($i){
      var btn = ["确认","取消"];
      mui.confirm('可能会失去再次购买的机会','确认移除当前商品',btn,function(e){
        if(e.index==0){
          if($this.flag){
            $this.$emit('appListen','loading',true);
            $this.flag=false;
            if($this.moveFlag>=0)$this.moveFlag=-1;
            //执行mui封装好的窗口关闭逻辑；
            var recId=$this.scData[$i].rec_id;
            axios({
              method:'post',
              url: $basePath+'?c=Cart&m=deleteCart',
              data:{
                'recId':recId
              }
            })
            .then((response) => {
              //console.log(response.data.data);
              $this.$emit('appListen','loading',false);
              $this.flag=true;
              switch(parseInt(response.data.code)){
                case 1000400 :$this.$emit('parentListen','reloadCart');break;
                case 1000420 ://console.log('请填写必填项');break;
                case 1000430 :mui.alert('购物车无此商品,请刷新后重试','','刷新',);$this.$emit('parentListen','reloadCart');break;
                case 1000410 :mui.alert('服务器忙<br/>稍后重试');break;
                case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
                default:mui.alert('服务器忙<br/>刷新重试');break;
              }
            })
            .catch(function (error) { 
              $this.$emit('appListen','loading',false);
              //console.log(error);
            });
          }
        }else{
          $this.moveFlag=-1;
        }
      });
    },
    moveListen:function($b,$i){//$b 子组件传递，拉动时传递false ，拉开后传递true ,$i拉动子组件的index值
      //moveFlag滑动删除标志位 初始值-1,子组件内监听此值，为-1时闭合所有滑动
      if($this.moveFlag<0){//判断moveFlag是否是初始状态，即有无拉开状态的子组件 <0无
        if($this.moveFlag==-1){
          if($b)$this.moveFlag=$i;  //若拉开，直接赋值拉开子组件的index
        }else{//moveFlag=-2
          $this.moveFlag=-1;
          $this.editCartText='编辑'
          $this.editCartFlag=!$this.editCartFlag;
        }
      }else{
        if($b);  //有
        else{
          if($i!=$this.moveFlag){//由于滑动组件，会触发 拉动时传递false 判断此时滑动的是否是已拉开的子组件
            $this.moveFlag=-1;
          }
        }
      }
      
    }
  },
  components:{
    'gLi':goodsListContentRemoveLi,
    'mHead':mHead
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .shoppingCartServiceShopping{
    .goodsListContent{
      margin:4.28rem 0;
      border-radius: 4px;
      height:auto;
      text-align:center;
      background-color:white;
      img{
        margin:1.07rem;
      }
      p{
        font-size:20px;
        color:#333333;
        font-weight:normal;
      }
      button{
        width:180px;
        height:40px;
        border-radius:8px;
        border:0 solid white;
        background-color:#c8161e;
        color:white;
        margin-top:50px;
        cursor:pointer;
        outline:none;
      }
    }
    footer{
      z-index:9999;
      position:fixed;
      background-color:white;
      bottom: 0;
      
      
    }
    content{
      margin:0 0 0 1.25rem;
      margin-bottom: 6rem;
      display:block;
      background-color: #f7f7f7;
    }
    .shopping-empty-footer{
      height:3.57rem;
      position:fixed;
      display:flex;
      align-items: center;
      bottom:0;
      background:white;
      width:100%;
      button{
        width:100%;
        height:100%;
        font-size:1.1rem;
        line-height:1.285rem;
        color:#fff;
        background:#c8161e;
        border:none;
        letter-spacing:1px;
        border-radius:0
      }
    }
    .shopping-footer{

      height:3.57rem;
      position:fixed;
      line-height: 3.57rem;
      display:flex;
      align-items: center;
      bottom:0;
      left: 0;
      background:white;
      width:100%;
      margin: 0;

      img{
        position:relative;
        top:-0.0714px;
        margin-right:0.375rem;
        width:1.07rem;
      }
      >li{
        font-size:0.714rem;
        height:100%;
        display:flex;
        align-items: center;
        &:first-child{
          margin-left:1.25rem;
          margin-right:0.714rem;
          min-width: 3.23rem;
          label{
            display: flex;
            font-size:0.714rem;
            align-items: center;
          }
        }
        &:last-child{
          flex:1;
        }
        &.total{
          display:flex;
          flex-direction:column;
          align-items: baseline;
          justify-content: center;
          margin-right: 1.21rem;
          align-items: flex-end;
          min-width:5.14rem;
        }
        p{
          color:#9da2a6;
          font-size:0.714rem;
          margin-bottom:0;
        }
        span{
          font-size:0.929rem;
          color:#c8161e;
        }
      }
      button{
        width:100%;
        height:100%;
        font-size:1.1rem;
        line-height:1.285rem;
        color:#fff;
        background:#c8161e;
        border:none;
        letter-spacing:1px;
        border-radius:0
      }
    }
    
  }
</style>
