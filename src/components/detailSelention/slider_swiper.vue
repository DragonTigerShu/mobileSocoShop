<template>
 <div style="width:70%;margin:20px auto;height:400px">
  <!-- 配置slider组件 -->
  <slider :pages="pages" :baseUrl="baseUrl" :sliderinit="sliderinit">
    <!-- 设置loading,可自定义 -->
    
  </slider>
</div>
</template>
<script>

  import slider from '../../components/detailSelention/slider.vue'
import axios from 'axios';   //接口
import baseUrl from '../../common/js/common.js'
let $data = {
 baseUrl:baseUrl,
 pages:[
          // {
          // html: '<div class="slider1">slider1</div>',
          // style: {
          //   'background': '#1bbc9b'
          //   }
          // },
          // {
          //   html: '<div class="slider2">slider2</div>',
          //   style: {
          //     'background': '#4bbfc3'
          //   }
          // },
          // {
          //   html: '<div class="slider3">slider3</div>',
          //   style: {
          //     'background': '#7baabe'
          //   }
          // }
          ],
          sliderinit: {
           currentPage: 1,
           slidesToScroll:1,
           tracking: false,
           thresholdTime: 300,//滑动判定距离
           thresholdDistance: 100,//滑动判定时间
           direction:'vertical',//垂直滚动
           loop:true,//无限循环
           infinite:3,
           
         //  autoplay:2000,//自动播放
         timingFunction: 'ease'
       }
     }
     let $this = {}
     export default {
      data () {
       $this = this
       return $data
     },
     methods: {
           // Listener event
           slide (data) {
                //console.log(data)
              },
              onTap (data) {
                //console.log(data)
              },
              onInit (data) {
                //console.log(data)
              },
              turnTo (num) {
            // 传递事件 vue 2.0 传递事件修改了，好的写法应该直接写在空vue类中
            this.$children[0].$emit('slideTo', num);
           // //console.log(this);
         },
         slideNext () {
           this.$children[0].$emit('slideNext');
            //  //console.log(this.$children[0].$emit('slideNext'));
           // //console.log(this.$children[0].$emit('slideNext').$options.parent);
          //childComponents.$emit('slideNext');
          // this.next();
        },
        slidePre () {
         this.$children[0].$emit('slidePre');
             // childComponents.$emit('slidePre')
           },
           appendslider(){
            // this.someList.push({
            //     title: 'slidernew',
            //     style:{
            //         background:'#333',
            //         color:'#fff'
            //     }
            // });
          }
        },
        created:function(){
          
         axios.post('/api/index.php?c=GetData&m=getCon&pid=7').then(function (response) {
        /***@augments
         * base_id: "1"
         * pic_ori:
         * pid: 
         * title: 
         * url: 
         * vice_title: 
         */

         if(response.data) {
          let data = response.data
          for (let index =0; index < data.length; index++) {
            let element = data[index]  //数组添加到底部
            $this.pages.push(element)
            
          }
          
        }else{
           //console.log("222")
         }
         
       }).catch(function (error) { 
        //console.log(error);
      });
       
     },
     components:{
      'slider':slider
    }
  }
</script>

<style lang="scss">
  
</style>
