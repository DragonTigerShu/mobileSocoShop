<!-- <template>
  <div class="shoppingCartServiceManage">
    <mHead :title="'管理购物车'" @clickListen="goBack">
      <div slot="main-right" @click="goBack">管理</div>
    </mHead>
    <div style="height:3.57rem"></div>
    <content>
      <gLi name="goodsListContentLi" v-for="(d,index) in scData" :index="index" :key="index" :data="d" :checked='checkGroup[index]' :minusDis="minusGroup[index]" :addDis="addGroup[index]" @checkedListen='checkedListen' @aNClickListen="aNClickListen">
      </gLi>
    </content>
    <footer>
      <ul class="shopping-footer">
      <li>
        <input type="checkbox" style="display:none" id="goodListAll" @click="checkClick" :checked="checked"><label for="goodListAll"><img :src="checked ? imgchecked : imgUnChecked " >全选</label>
      </li>
      <li><button @click="removeListen">删除</button></li>
      </ul>
    </footer>
  </div>
</template>
<script>
import goodsListContentLi from '@/components/shoppingCartService/goodsListContentLi.vue';
import mHead from '../../components/common/m-head.vue'
var $scData = {
  'checked': false,
  'checkGroup':[],
  'addGroup':[],
  'minusGroup':[],
  'imgLeft':require('../../common/images/main/left.png'),
  'imgBack':require('../../common/images/main/shopping.png'),
  'imgUnChecked':require('../../common/images/main/checkbox.png'),
  'imgchecked':require('../../common/images/main/checkbox-checked.png')
}
var $this = {}
export default {
  name: 'shoppingCartServiceManage',
  data () {
      $this = this
      return $scData
  },
  props:{
    scData:Array
  },
  created:function(){
    window.scrollTo(0,0);
    if(this.scData.length==0){
        this.checked=false;
    }else{
      this.checked=false;
      this.checkGroup=[];
      this.minusGroup=[];
      this.addGroup=[]
      for(var i=0;i<this.scData.length;i++){
        this.checkGroup.push(false);
        if(this.scData[i].amount==1)this.minusGroup.push(true);
        else this.minusGroup.push(false);
        this.addGroup.push(false);}
    }
  },
  mounted:function(){
    
  },
  watch:{
    scData(curVal,oldVal){
      if($this.scData.length==0){
        $this.checked=false;
      }else{
        $this.checkGroup=[];
        $this.minusGroup=[];
        $this.addGroup=[]
        for(var i=0;i<$this.scData.length;i++){
          $this.checkGroup.push(false);
          if($this.scData[i].amount==1)this.minusGroup.push(true);
          else $this.minusGroup.push(false);
          $this.addGroup.push(false);}
      }
    },
    checkGroup(curVal,oldVal){
      var temp  = 0;
      for(var i=0;i<curVal.length;i++){
        if(curVal[i]){
          temp++;
        }
      }
      $this.selected=temp;
    },
  },
  methods:{
    removeListen:function(){
      var temp=[];
      for(var i=0;i<$this.checkGroup.length;i++){
        if($this.checkGroup[i])temp.push(i);
      }
      $this.$emit('removeListen',temp);
    },
    goBack:function(){
      $this.$router.push({path:'/shoppingCart/Service'});
    },
    checkClick:function(e){
      if($this.scData.length!=0){
        $this.checked= e.target.checked;
        var temp=[];
        for(var i=0;i<$this.checkGroup.length;i++){
            temp.push(e.target.checked);
        }
        $this.checkGroup=[];
        $this.checkGroup=temp;
      }
    },
    checkedListen:function($i,$b){
      var temp=[];
      for(var i=0;i<$this.checkGroup.length;i++){
        temp.push($this.checkGroup[i]);
      }
      temp[$i]=$b;
      if($this.checked){
        for(var i=0;i<temp.length;i++){
          if(!temp[i]){
            $this.checked=false;
            break;
          }
        }
      }else{
        var flag=true;
        for(var i=0;i<temp.length;i++){
          if(!temp[i]){flag=false;break;}
        }
        if(flag){
          $this.checked = true;
        }
      }
      $this.checkGroup=[];
      $this.checkGroup=temp;
    },
    aNClickListen:function($i,$b){
        var $a= $this.scData[$i].amount;
        if($b){
          if($a==1){
            var tempM =[];
            for(var i=0;i<$this.minusGroup.length;i++){
            tempM.push($this.minusGroup[i]);
            }
            tempM[$i]=false;
            $this.minusGroup=[];
            $this.minusGroup=tempM;
          };
        }
        else {
          if($a==2){
            var tempM =[];
            for(var i=0;i<$this.minusGroup.length;i++){
            tempM.push($this.minusGroup[i]);
            }
            tempM[$i]=true;
            $this.minusGroup=[];
            $this.minusGroup=tempM;
          }
        };
        $this.$emit('aNClickListen',$i,$b);
    },
  },
  components:{
    'gLi':goodsListContentLi,
    'mHead':mHead
  }
}
</script>

<style scoped lang="scss">
.shoppingCartServiceManage{
  footer{
    z-index:9999;
    position:fixed;
    background-color:white;
  }
  content{
    margin:0 1.25rem;
    margin-bottom: 3.57rem;
    display:block;
    background-color: #f7f7f7;
  }
  .shopping-footer{
    height:3.57rem;
    position:fixed;
    display:flex;
    align-items: center;
    bottom:0;
    background:white;
    width:100%;
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
      flex:1;
        &:first-child{
          justify-content: center;
          label{
              display: flex;
              font-size:0.714rem;
              align-items: center;
          }
        }
        &:last-child{
         
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
 -->