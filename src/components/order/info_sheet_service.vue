<template>
  <div class="sheet_service">
    <h3>服务单信息</h3>
    <div class="sheet_genre">
      <p>
        <small>申请日期：</small>
        <small>{{transformTime(data['return_goods_info']['addtime'])}}</small>
      </p>
      <p>
        <small>售后编号：</small>
        <small>{{data['return_goods_info']['return_order_sn']}}</small>
      </p>
      <p>
        <small>售后类型：</small>
        <small>{{typeArray[data['return_goods_info']['type']]}}</small>
      </p>
      <p>
        <small>货物装态：</small>
        <small>{{receiveType[data['return_goods_info']['is_receive']]}}</small>
      </p>
      <p>
        <small>退款金额：</small>
        <small>{{data['return_goods_info']['refund_money']}}元</small>
      </p>
      <p>
        <small>退款原因：</small>
        <small>{{data['return_goods_info']['reason']}}</small>
      </p>
      <p>
        <small>{{typeRemarkArray[data['return_goods_info']['type']]}}：</small>
        <small>{{data['return_goods_info']['describe']}}</small>
      </p>
      <section class="picList">
        <div v-for="(d,index) in picList" :key="index">
          <img :src='baseHead+d.src'>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
  var $this={
    baseHead:'',
  }
  var $data={
    typeArray:['退款退货','换货','仅退款'],
    typeRemarkArray:['退货说明','换货说明','退款说明'],
    receiveType:['未收货','已收货'],
    picList:[]
  }
  export default {
    data (){
      $this = this
      return $data
    },
    created(){
      this.baseHead=$baseHead;
      if(this.data['return_goods_info']['imgs']!=''){
        var picListArray=[]
        picListArray=this.data['return_goods_info']['imgs'].split(',');
        for(var i=0;i<picListArray.length;i++){
          var temp={}
          temp['src']=picListArray[i];
          picListArray[i]=temp;
        }
        this.picList=[];
        this.picList=picListArray;
      }
    },
    props:{
      data:Object
    },
    methods: {
      transformTime:function(timestamp) {
      var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y+M+D+h+m+s;
    },
  },
  components:{
    
  }
}
</script>
<style lang = "scss">
  .sheet_genre{
    padding: 1rem;
    p{
      small{
        font-size: 14px;
        color: #9da2a6;
      }
    }
    section{
      &.picList{
        display:flex;
        flex-wrap:wrap;
        padding-bottom:1.07rem;
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
            height: 100%;
          }
        }
      }
    }
  }
  
</style>