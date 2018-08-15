<template>
  <div class="info_address_edit">
    <addressAdd :url="'/info/address'" @appListen="appListen"></addressAdd>
  </div>
</template>
<script>
  import addressAdd from '@/components/common/addressAdd.vue'
  var $this = {}
  export default {
    name: 'info_address_edit',
    data () {
      $this = this
      return {}
    },
    props:{

    },
    created:function(){
      window.scrollTo(0,0);
    },
    mounted:function(){
    },
    watch:{
      
    },
    methods:{
      appListen:function($c,$d){
        $this.$emit('appListen',$c,$d);
      }
    },
    components:{
      addressAdd:addressAdd,
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .info_address_edit{
    
  }
</style>
