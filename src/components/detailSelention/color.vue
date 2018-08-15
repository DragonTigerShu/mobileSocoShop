<template>
	<div class="Choose-wrap">
		<ul class="radiowarp">
			<li v-for="(item,index) in colores" :class="{active:index===nowIndex}" v-if="index>=2" @click="chooseSelection(index)">
				<i :style="{'background':item.color}"></i>{{item.name}}
			</li>
		</ul>
	</div>
</template>
<script>
	export default{
		props:{ //父类注入数据过来
			colores:Array
		},
		data(){
			return {
               nowIndex:2    //类型数据信息
           }
       },
       methods:{
       	chooseSelection:function(index){
       		this.nowIndex = index
       		this.$emit('colorChange',this.colores[index])
       	}
       }
   }
</script>
<style lang="scss">
	.Choose-wrap{
		width: 100%;
		ul.radiowarp{
			width: 100%;
			li{
				list-style: none;
				display: inline-block;
				padding: 0px 0.4rem;
				line-height: 2.5rem;
				border: 1px solid #e0e0e0;
				border-radius: 5px;
				font-size: 12px;
				color: #5c6670;
				height: 36px;
				text-align: center;
				cursor: pointer;
				margin-bottom: 10px;
				min-width: 4.8rem;
				margin-right: .6rem;
				&.active{
					border:2px solid #C8161E;
					color: #C8161E;
				}
				i{
					display: inline-block;
					width:10px;
					height: 10px;
					background: red;
					border-radius: 5px;
					margin-right: 5px;
					position: relative;
					top:0px;
				}
			}
		}
	} 
</style>