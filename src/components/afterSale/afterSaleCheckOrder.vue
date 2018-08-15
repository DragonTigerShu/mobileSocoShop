<template>
  <div class="afterSaleCheckOrder">
    
  </div>
</template>
<script>
  var $data = {
    type:0
  }
  var $this = {}
  export default {
    name: 'afterSale',
    data () {
      $this = this
      return $data
    },
    created:function(){
      this.id=this.$route.params.id;
      if(this.id==null||this.id==''){
        this.$router.push({path:'/'});
      }else{
        this.$emit('checkOrderListen',this.id);
      }
    },
    mounted:function(){
      
    },
    watch:{
      
    },
    methods:{
      
    },
    components:{
      
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .afterSaleCheckOrder{
    
  }
</style>
