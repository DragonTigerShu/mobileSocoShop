<template>
	<div class="count">
		<div class="counter-btn btn-top" @click="decrease"><img :src="topImg"></div>
		<div class="counter-show">
			<input type="text" disabled="disabled" value="1" v-model="number" :class="{moving:'animate'}" />
		</div>
		<div class="counter-btn btn-bottom" @click="increase"><img :src="bottomImg"></div>
	</div>
</template>
<script>
	var $this = {}
	var $data = {
		topImg:require('../../common/images/goods/top.png'),
		bottomImg:require('../../common/images/goods/bottom.png'),
		number:1,
		animate:false
	}
//点击NUmber数据信息
export default{
	created:function(){
		this.number=this.min;
	},
	props:{
		max :{
			type:Number,
			default:100  
		},
		min :{
			type:Number,
			default:1
		}
	},
	data(){
		$this=this
		return $data
	},	
	methods:{
		decrease () {
			if(this.number >= this.max) {
	         // alert('数字范围为1--101')
	         return false
	     }
	     this.number ++
	 },
	 increase () {

	 	if (this.number <= this.min) {
	        // alert('数字范围为1--10')
	        return false
	    }
	    this.number--
	}
},
mounted(){
	if(this.number>0){
		this.active = true
	}
},
watch:{
	number:function(){
		this.$emit('selectChange',this.number)
	}
}
}
</script>
<style>

	.counter-show {
	}
	.animate{
		
	}
	.count{
		position: relative;
		width: 85px;
		height: 100%;
	}
	.count .counter-show input{
		width:85px;
		height:36px;
		border:none;
		border:1px solid #e0e0e0;
		text-align:left;
		padding-left: 1em;
		line-height:36px;
		background: none;
		border-radius: 5px;	
		margin-bottom: 0px;
	}
	.count .counter-btn {
		width: 20px;
		height: 20px;
		text-align: center;
		line-height: 20px;
		font-size: 16px;
		cursor: pointer;
		border-width: 1px;
		position: absolute;
		display: block;
		right: 0;
		border-color: rgb(204, 204, 204);
		
	}
	.count .btn-top{
		right: 0;
		top:0;
		margin-right: .5rem
	}
	.count .btn-bottom{
		bottom: 0;
		right: 0;
		margin-right: .5rem
	}

	
</style>