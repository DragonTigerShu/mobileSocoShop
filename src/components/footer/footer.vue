<template> 
	<div class="soco-footer">
		<div class="soco-about">
			<a href="http://bbs.supersoco.com/forum.php?mod=viewthread&tid=873&extra=page%3D1"><p>服务支持</p></a>
			<a href="http://www.supersoco.com/m-portal/ch/about-us.php"><p>关于速珂</p></a>
			<div class="custom-service">
				<label>
					<span>客服热线:400-021-2008</span>
					<span>周一至周日 8:30-17:30</span>
				</label>	
			</div>		 
		</div>
	</div>
</template>
<script>
	var $this={}
	var $data={
		imgNext:require('../../common/images/footer/next.png')
	}
	export default{
		data(){
			return $data
		}
	}
</script>
<style scoped lang="scss">
	.soco-footer{
		padding: 1.5em 1em;
		background: #fff;
		
		width: 100%;
		left: 0;
		right: 0;

		z-index: 10;
		.soco-about{
			p{ 
				font-size: 1.2em;
				border-bottom: 1px solid #eee;
				padding-bottom: .5em;
				color: #333;
				a{
					font-size: 1em;
					color: #333;
				}
			}
			.follow-me{
				display: flex;
				width: 100%;
				position: relative;
				border-bottom: 1px solid #eee;
				margin-bottom: 1em;

				p{
					flex: 1;
					border:none;
					margin-bottom: 0.2em;
				}
				img{
					position: absolute;
					right: 0;
					top: em;
					top: 0;
					margin-top: -0.8em;
					margin-right: -.8em;
				}
				
			}
		}
		
	}
</style>
