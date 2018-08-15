<template>
    <div class="registration_success">
        <div class="soco-srccess">
            <img src="../../common/images/login/success.png" />
            <h3>恭喜您注册成功!</h3>
            <button name="button" class="button" @click="back">返回登录页面</button>
        </div>
    </div>
</template>
<script>
   let $this = {}
   let $data = {}
   export default{
       data (){
           $this = this
           return $data
       },
       methods: {
           back:function(){
             $this.$router.push({path:'/'});
             window.scrollTo(0,0);
         }
     }
 }
</script>

<style lang="scss">
 .registration_success{
    margin: 1em auto;
    display: block;
    padding: 0 2.5rem;
    .soco-srccess{
       text-align: center;
       h3{
           margin-top: -0.8em;
           margin-bottom: 4.285rem;
       }
       button{
        width: 100%;
        height: 2.85rem;
        font-size: 1.1rem;
        line-height: 1.285rem;
        color: #fff;
        background: #c8161e;
        border: none;
        border-radius: 8px;
        letter-spacing: 1px;
    }
}
}
</style>
