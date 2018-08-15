<template>
  <div class="afterSaleServiceOneApply">
    <mHead :title="'申请仅退款'" @clickListen="goBack">
      <div slot="main-right" class="main" @click="goServiceEdit">重选售后</div>
    </mHead>
    <div style="height:3.57rem"></div>
    <content class="goods" v-if="data['order_goods_info']">
<!--       <section>
        <p>订单日期 2018/01/09 11:35</p>
        <span>订单编号: 1385923469234630643</span>
      </section> -->
      <div class="goodsListContentAfterSaleLi">
        <ul>
          <li><img :src="baseHead+data['order_goods_info'].goods_thumb"></li>
          <li class="goodsListContentLi-content">
            <p>{{data['order_goods_info'].goods_name}} {{data['order_goods_info'].spec_key_name}}</p>
            <span></span>
            <div class="goodsListContentLi-content-footer">
              <span>￥{{data['order_goods_info'].goods_price}}</span><span>X{{data['order_goods_info'].goods_number}}</span>
            </div>
          </li>
        </ul>
      </div>
    </content>
    <content class="status">
      <section class="inline-style">
        <h1>货物状态</h1>
        <select :class="isReceive==''?'default':''" v-model="isReceive">
          <option value="">请选择</option>
          <option value="0">未收货</option>
          <option value="1">已收货</option>
        </select>
        <img :src="imgRight">
      </section>
    </content>
    <content class="goodsNum">
      <section class="inline-style">
        <h1>退货数量</h1>
        <aN :minusDis="minusDis" :addDis="addDis" :num="parseInt(goodsNumber)" @aNClickListen="aNClickListen"></aN>
      </section>
    </content>
    <content class="reason">
      <section class="inline-style">
        <h1>退款原因</h1>
        <select :class="reason==''?'default':''" v-model="reason">
          <option value="">请选择退款原因</option>
          <option value="质量问题">质量问题</option>
          <option value="颜色发错">颜色发错</option>
          <option value="型号发错">型号发错</option>
          <option value="零件损坏">零件损坏</option>
          <option value="其他">其他</option>
        </select>
        <img :src="imgRight">
      </section>
    </content>
    <content class='money'>
      <section class="inline-style"><h1>退款金额:</h1><label><input type="text" v-model="money">￥</label></section>
      <section class="remark-style" v-if="data['order_goods_info']"><span>最大退款金额:{{data['order_goods_info']['goods_price']*data['order_goods_info']['goods_number']}}元</span></section>
      <section style="margin-top:2.14rem"><h1>退款说明</h1><textarea v-model='describe' placeholder="请在此描述问题"></textarea></section>
    </content>
    <content>
      <section class="inline-style">
       <h1>上传凭证</h1>
     </section>
     <section class="picList" @click="removeListen($event)">
      <div v-for="(d,index) in picList" :key="index">
        <i class="removeIcon"><img :data-index="index" :src="imgMinus"></i>
        <img :data-index="index" :src='baseHead+d.src'>
      </div>
      <div v-if="picList.length<5">
        <label for="upload" class="addPic"><img :src="imgCamera"><span>上传凭证</span></label>
        <input type="file" name="file" id="upload" @change="picupload($event)" />
      </div>
    </section>
  </content>
<!--     <content>
      <section>
        <h1 style="margin-bottom:1.79rem">收货地址</h1>
        <ul class="address" @click="goAddress">
          <li><img :src="imgLocate"></li>
          <li class="address-content" v-if="selectAddressData['consignee']">
            <div>
              <p>{{selectAddressData['consignee']}}</p>
              <p>{{selectAddressData['mobile']}}</p>
            </div>
            <p>{{selectAddressData['pname']}} {{selectAddressData['xname']}} {{selectAddressData['zname']}}</p>
          </li>
          <li v-else><p>请选择收货地址</p></li>
          <li><img :src="imgRight" style="width:1.04rem;"></li>
        </ul>
      </section>
    </content> -->
    <footer>
      <button @click="clickListen">提交</button>
    </footer>
  </div>
</template>
<script>
  import mHead from '../../components/common/m-head.vue'
  import axios from 'axios'
  import mui from '../../../static/mui.js'
  import acountNumber from '@/components/shoppingCartService/acountNumber.vue';
  var $data = {
    data:{},
    imgRight:require('../../common/images/main/right.png'),
    imgCamera:require('../../common/images/main/camera.png'),
    imgMinus:require('../../common/images/main/minus.png'),
    'imgLocate':require('../../common/images/main/locatemap.png'),
    'id':0,
    'status':'',
    'isReceive': '',
    'selectAddressData':{},
    'picList':[],
    'baseHead':'',
    'reason':'',
    'describe':'',
    'recId':0,
    'money':0.00,
    'goodsNumber':1,
    'minusDis':true,
    'addDis':true
  }
  var $this = {}
  export default {
    name: 'afterSaleServiceOneApply',
    data () {
      $this = this
      return $data
    },
    created(){
      this.id=this.$route.params.id;
      this.baseHead=$baseHead;
      this.initOrder();
      window.scrollTo(0,0);
    },
    props:{
      reload:Boolean
    },
    beforeRouteLeave(to, from, next) {
      this.$emit("appListen",'loading',false);
      next();
    },
    beforeRouteUpdate(to, from, next) {
      next(false);
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      initOrder:function(){
        $this.$emit("appListen","loading",true);
        axios({
          method:'post',
          url: $basePath+'?c=ReturnGoods&m=userReturnGoodsDetail',
          data:{
            'returnGoodsId':$this.id,
          }
        })
        .then((response) => {
          $this.$emit("appListen","loading",false);
          switch(parseInt(response.data.code)){
            case 1600100 :{
              $this.data={}
              $this.data=response.data.data;
              $this.isReceive=$this.data['return_goods_info']['is_receive'];
              $this.reason=$this.data['return_goods_info']['reason'];
              $this.describe=$this.data['return_goods_info']['describe'];
              $this.recId=$this.data['return_goods_info']['rec_id'];
              $this.goodsNumber=$this.data['return_goods_info']['goods_num'];
              $this.money=$this.data['return_goods_info']['refund_money']
              if($this.goodsNumber==1)$this.minusDis=true;
              else $this.minusDis=false;
              if($this.goodsNumber+1>$this.data['order_goods_info']['goods_number'])$this.addDis=true;
              else $this.addDis=false;
              if($this.data['return_goods_info']['imgs']!=''){
                var picListArray=[]
                picListArray=$this.data['return_goods_info']['imgs'].split(',');
                for(var i=0;i<picListArray.length;i++){
                  var temp={}
                  temp['src']=picListArray[i];
                  picListArray[i]=temp;
                }
                $this.picList=[];
                $this.picList=picListArray;
              }
              break;
            }
            case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            default :$this.$router.push({path:'/after_sale_order'});window.scrollTo(0,0);mui.alert('服务器忙<br/>请稍后重试');break;
          }
        })
        .catch(function (error) {
          $this.$emit("appListen","loading",false);
          mui.alert('服务器忙<br/>请稍后重试');
        //console.log(error);
      });
      },
      clickListen:function(){
        if($this.isReceive==null||$this.isReceive==''){
          mui.toast('请选择货物状态',{ duration:'short', type:'div' });
          return false;
        }
        if($this.reason==null||$this.reason==''){
          mui.toast('请选择退款理由',{ duration:'short', type:'div' });
          return false;
        }
        if($this.money==null||$this.money==''){
          mui.toast('请填写退款金额',{ duration:'short', type:'div' });
          return false;
        }
        if(isNaN($this.money)||$this.money<0){
          mui.toast('退款金额不规范',{ duration:'short', type:'div' });
          return false;
        }
        if($this.money>$this.data['order_goods_info']['goods_price']*$this.data['order_goods_info']['goods_number']){
          mui.toast('退款金额不能大于商品金额',{ duration:'short', type:'div' });
          return false;
        }
        if($this.picList.length>0){
          var imgs=$this.picList[0]['src'];
          for(var i=1;i<$this.picList.length;i++){
            imgs+=','+$this.picList[i]['src'];
          }
        }
        $this.$emit("appListen","loading",true);
        axios({
          method:'post',
          url: $basePath+'?c=ReturnGoods&m=editReturnGoods',
          data:{
            'returnGoodsId':$this.id,
            'recId':$this.recId,
          'type':2,//仅退款
          'reason':$this.reason,
          'describe':$this.describe,
          'refundMoney':$this.money,
          'isReceive':$this.isReceive,
          'imgs':imgs,
          'goodsNum':$this.goodsNumber
        }
      })
        .then((response) => {
        //console.log(response.data.data);
        $this.$emit("appListen","loading",false);
        switch(parseInt(response.data.code)){
          case 1600100 :{
            mui.toast('提交售后申请成功',{ duration:'short', type:'div' });
            $this.$router.push({name:'/afterSaleOrder/check',params:{'id':$this.id}});
            window.scrollTo(0,0);
            break;
          }
          case 1600103 :{
            mui.alert('无法重申售后');
            break;
          }
          case 1600106 :{
            mui.alert('当前售后订单不可编辑');
            $this.$router.push({name:'/afterSaleOrder/apply',params:{'id':id}});
            break;
          }
          case 1600108:{
            mui.alert('当前订单已超过7天售后期<br/>无法提交申请');
            break;
          }
          case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
          default :$this.$router.push({path:'/'});window.scrollTo(0,0);mui.alert('服务器忙<br/>请稍后重试');break;
        }
      })
        .catch(function (error) {
          $this.$emit("appListen","loading",false);
        //console.log(error);
      });
      },
      aNClickListen:function($b){
        if($b)$this.goodsNumber++;
        else $this.goodsNumber--;
        if($this.goodsNumber==1)$this.minusDis=true;
        else $this.minusDis=false;
        if($this.goodsNumber+1>$this.data['order_goods']['goods_number'])$this.addDis=true;
        else $this.addDis=false;
      },
      goServiceEdit:function(){
        $this.$router.push({name:'/afterSaleOrder/afterSaleService',params:{'id':$this.id}});
        window.scrollTo(0,0);
      },
      goBack:function(){
        $this.$router.push({name:'/afterSaleOrder/apply',params:{'id':$this.id}});
        window.scrollTo(0,0);
      },
      goAddress:function(){
        $this.$router.push({path:'/shoppingCart/Address'});
      },
      removeListen:function(e){
        if(e.target.dataset.index!='' && e.target.nodeName.toLowerCase()=='img'){
          const index = parseInt(e.target.dataset.index);
          var btn = ["确认","取消"];
          mui.confirm('','确认移除当前图片',btn,function(e){
            if(e.index==0){
              var tempList=[];
              for(var i=0;i<$this.picList.length;i++){
                if(i!=index)tempList.push($this.picList[i]);
              }
              $this.picList=tempList;
            }
          });
        }
      },
      /*立即触发上传图片*/
      picupload:function(e){
        var file = e.target.files[0];
        var imgArr = [];
        //遍历得到的图片文件
      //获取文件上传的后缀名
      var type = file.type;
      if(type!=''||type!=null){
        if(type.match(/image.(jpg|jpeg|png)/)){
          // 类型符合，可以上传
          if (file.size >= 2*1024*1024) {
            mui.alert('文件过大,图片最大2M');
            return false;
          } else {
            // 在这里需要判断当前所有文件中
            $this.UploadFileFn(file);
            e.target.value='';
          }
        }else{
          mui.alert('图片类型错误(仅png,jpg,jpeg)');
          return false;
        }
      }else{
        mui.alert('图片类型错误(仅png,jpg,jpeg)');
        return false;
      }
    },
    //相册图片文件上传
    UploadFileFn:function(file) {
      var formData= new FormData();
      //formData.append("files",files[0]);
      //FormData.set 和 append() 的区别在于，如果指定的键已经存在， FormData.set 会使用新值覆盖已有的值，而 append() 会把新值添加到已有值集合的后面。
      //注意：如果你的服务器端是PHP那么为了与php命名习惯一致在名称中需要添加[]，如formData.append('files[]',files[i]);
      formData.append('file',file);
      $this.$emit("appListen","loading",true);
      axios({
        method:'post',
        // withCredentials: true,
        headers:{'Content-Type':'multipart/form-data'},
        url: $basePath+'?c=ReturnGoods&m=uploadReturnGoodsImg',
        data:formData
      })
      .then((response) => {
          //console.log(response.data.data);
          $this.$emit("appListen","loading",false);
          switch(parseInt(response.data.code)){
            case 1600100 :{
              $this.picList.push(response.data.data);
              break;
            }
            case 888 :$user='';$cart='';mui.alert('登录账户已过期','登录超时','重新登录',function(){$this.$router.push({ path: "/login" });});break;
            default :$this.$router.push({path:'/'});window.scrollTo(0,0);mui.alert('服务器忙<br/>请稍后重试');break;
          }
        })
      .catch(function (error) {
        $this.$emit("appListen","loading",false);
          //console.log(error);
        });
    }
  },
  components:{
    'mHead':mHead,
    'aN':acountNumber
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .afterSaleServiceOneApply{
    background-color: #f7f7f7;
    select{
      border:0;
      color:#333333;
      font-size:1.21rem;
      margin:0 0 0 2.14rem;
      padding-top:0;
      padding-bottom:0;
      background:none;
      text-align:right;
      direction: rtl;
      appearance:none;
      -moz-appearance:none;
      -webkit-appearance:none;
      &.default{
        color:#9da2a6;
      }
      option{
        &:first-child{
          display:none;
        }
      }
    }
    content{
      display:block;
      background-color:white;
      margin-bottom:1.07rem;
      padding-top:1.79rem;
      &.goods{
        padding-top:0rem;
      }
      &.status{
        margin-bottom:0;
        padding-bottom:1.07rem;
      }
      &.goodsNum{
        padding-top:0rem;
        margin-bottom:0;
        padding-bottom:1.07rem;
      }
      &.reason{
        padding-top:0;
        padding-bottom:0;
        padding-bottom:2rem;
      }
      &.money{
        section{
          input{
            border:0;
            height:3.57rem;
            margin-bottom:0;
            color:#c8161e;
            font-size:1.21rem;
            direction: rtl;
            text-decoration: underline;
          }
          label{
            margin-left:2.14rem;
            font-size:1.21rem;
            color:#c8161e;
            display:flex;
            justify-content:center;
            align-items:center;
          }
          &.remark-style{
            margin-bottom: 1.07rem;
          }
        }
      }
      .goodsListContentAfterSaleLi{
        ul{
          display:flex;
          flex-direction:row;
          width:100%;
          background:white;
          padding: 0 1.25rem;
          >li{
            margin:2.14rem 0 2.14rem 0;
            display:flex;
            align-items: center;
            width:auto;
            &:first-child{
              label{
                display: flex;
                font-size:0.714rem;
                align-items: center;
              }
            }
            &.goodsListContentLi-content{
              display:flex;
              flex-direction:column;
              align-items: baseline;
              justify-content: flex-start;
              background:white;
              flex: 1;
              >p{
                font-size:1.07rem;
                color:#333333;
                margin-bottom:0;
                height:auto;
              }
              >span{
                font-size:0.929rem;
                color:#9da2a6;
                margin-top:1.07rem;
              }
              div.goodsListContentLi-content-footer{
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
                width: 100%;
                flex:1;
                >span{
                  &:first-child{
                    color:#c8161e;
                  }
                  color:#9da2a6;
                  font-size:1.29rem;
                  height:1.79rem;
                  margin-right:2.14rem;
                }
              }
            }
            >img{
              width:7.14rem;
              height:7.14rem;
              background-color:#f7f7f7;
              margin-right:2.14rem;
            }
          }
        }
      }
      section{
        margin:0 1.25rem;
        &.inline-style{
          display:flex;
          justify-content:space-between;
          align-items:center;
          padding-top:0;
          span{
            display:flex;
            align-items:center;
            font-size:1.29rem;
          }
          &:nth-child(2){
            margin-top:2.14rem;
          }
          img{
            width: 1.04rem;
          }
        }
        &.picList{
          display:flex;
          flex-wrap:wrap;
          padding-bottom:1.07rem;
          input{
            display:none;
          }
          div{
            position:relative;
            display:flex;
            align-items:center;
            justify-content: center;
            width: 50%;
            height:11.79rem;
            >img{
              padding:1rem;
              width:100%;
            }
            i{ 
              position:absolute;
              right:5px;
              top:5px;
            }
          }
          .addPic{
            width:100%;
            height:100%;
            display:flex;
            justify-content:center;
            align-items:center;
            border:2px dashed #e0e0e0; 
            border-radius:4px;
            flex-direction: column;
            span{
              margin-top:0.714rem;
            }
          }
        }
        textarea{
          margin-top:0.714rem;
          height:10.714rem;
        }
      }
      h1{
        font-size:1.29rem;
        color:#333333;
        white-space:nowrap;
      }
      p{
        font-size:1.07rem;
        color:#333333;
        margin-bottom:0;
      }
      span{
        font-size:0.929rem;
        color:#9da2a6;
      }
      .address{
        display:flex;
        background-color:white;
        justify-content: space-between;
        align-items:center;
        padding:2.14rem 1.25rem;
        height:8.93rem;
        margin-bottom: 1.07rem;
        .address-content{
          padding: 0 1.07rem;
          img{
            padding:0 2.14rem;
          }
          display:flex;
          flex-direction:column;
          div{
            display:flex;
            flex-direction:row;
            margin-bottom:1.07rem;
          }
          p{
            padding:0 1.07rem;
            margin-bottom:0;
          }
        }
      }
    }
    footer{
      background-color:white;
      padding:2.86rem 1.25rem;
      button{
        box-sizing:border-box;
        width:100%;
        height:3.21rem;
        font-size:1.29rem;
        line-height:1.285rem;
        color:#fff;
        background:#c8161e;
        border:none;
        border-radius:4px;
        letter-spacing:1px;
      }
    }
  }
</style>
