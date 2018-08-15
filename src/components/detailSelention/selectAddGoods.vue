<template>
	<div class="selectAddGoods">
		<section v-if="data!=null">
			<ul class="purchsae-list" @click="ulClickListen($event)">
				<li v-for="(item,itemIndex) in data " :data-index="itemIndex" :name="item.goods_id" :value="item.goods_id">
					<div><img :data-id="item.goods_id" class="goodsImg" :src="baseHead+item.goods_img"></div>
					<content class="goodsInf" :data-index="itemIndex">
						<h1 :data-index="itemIndex" :title="item.goods_name">{{item.goods_name}}</h1>
						<!-- <span>{{item.goods_brief}}</span> -->
						<section v-if="item.specPriceData[0]['specData']!=null"> 
							<ul v-for="(specData,index) in item.specPriceData[0]['specData']" class="specData" @click="selectSpec(itemIndex,index,$event)" :data-index="itemIndex">
								<li v-for="(specItem,spencIndex) in specData['item']" :class="specItem['item_id']==spec_name[itemIndex][index]?'active':''">
									<p :data-value="specItem['item_id']" :data-index="spencIndex" >{{specItem['item_name']}}</p>
								</li>
							</ul>
						</section>
					</content>
					<div class="count-style">
						<p>X1</p>
						<span :data-index="itemIndex">￥{{goodsPriceItem[itemIndex]}}</span>
					</div>
					<div class="goodsCheckbox">
						<label v-if="checkboxShowArray[itemIndex]" :for="'goodListLi'+itemIndex">
							<img :src="checkboxArray[itemIndex]? imgchecked : imgUnChecked ">
							<input type="checkbox" style="display:none" :id="'goodListLi'+itemIndex" :data-index="itemIndex" :checked="checkboxArray[itemIndex]?true:false">
						</label>
						<label v-else>
							<img :src="imgDisabled" style="cursor:no-drop;">
						</label>
					</div>
				</li>
			</ul>
		</section>
	</div>
</template>
<script>
	import axios from '@/common/js/axios.js'
	let $data={
		data:[],
		proNumber:1,
		baseHead :'',
		select:'',
		provinceId:'',
		province:[],
		getCity:[],   // 市
		cityId:'',
		baseId:'',
		spec_name:{},//记录每行商品每行规格项选择的item_id
		checkboxArray:[],
		checkboxShowArray:[],//
		goodsPrice:[],//记录每种key组合的price，store_count，key_name对象
		goodsPriceItem:[],//放入数组显示的价格值
		shipping_fee:'', //运费 
		imgUnChecked:require('../../common/images/main/checkbox.png'),
		imgchecked:require('../../common/images/main/checkbox-checked.png'),
		imgDisabled:require('../../common/images/main/checkbox-disabled.png'),
		selectGoods:[]
	}
	let $this={}
	export default{
		data(){
			$this = this
			return $data
		},
		props:{
			addGoodsData:Array
		},
		created:function(){
			$this.baseHead = $baseHead
		},
		mounted(){
		},
		watch:{
			addGoodsData(to,from){
				var tempObject={};
				this.data= this.addGoodsData;
				for(var i=0;i<this.addGoodsData.length;i++){
					this.goodsPriceItem.push(0);
					this.checkboxArray.push(false);
					if(this.addGoodsData[i]['specPriceData']==null||this.addGoodsData[i]['specPriceData']==''||!this.addGoodsData[i]['specPriceData'][0]){
						//若商品没有规格项，将数据模拟成有规格项，便于后续处理数据的一致性
						var temp={}
						var itemTemp={}
						itemTemp['price']=this.addGoodsData[i]['goods_price'];
						itemTemp['store_count']=this.addGoodsData[i]['store_count'];
						itemTemp['key']=this.addGoodsData[i]['goods_id'];
						temp[this.addGoodsData[i]['goods_id']]=itemTemp;
						this.goodsPrice[i]=temp;
						tempObject[i]=[];
						tempObject[i][0]=this.addGoodsData[i]['goods_id'];
					}else{
						//有规格项
						this.goodsPrice[i]=this.addGoodsData[i]['specPriceData'][0]['goodsPrice'];
						for(var j=0;j<this.addGoodsData[i]['specPriceData'][0]['specData'].length;j++){
							for(var k=0;k<this.addGoodsData[i]['specPriceData'][0]['specData'][j]['item'].length;k++)
							{
								if(k==0){
									if(tempObject[i]==null||tempObject[i]==''){
										tempObject[i]=[];
									}
									tempObject[i][j]=this.addGoodsData[i]['specPriceData'][0]['specData'][j]['item'][0]['item_id'];
								}
							}
						}
					}
				}
				this.spec_name=tempObject;
				for(var i=0;i<this.addGoodsData.length;i++){
					this.selectSpecPrice(i);
				}
				////console.log(this.spec_name);
			}
		},
		methods:{
			openList:function() {
				$this.isShow=true;
				clearTimeout($this.clock);
			},
			closeList:function() {
				clearTimeout($this.clock);
				$this.clock = setTimeout(function (){
					$this.isShow=false;
				}, 300);
			},
			ulClickListen:function(e) {
				switch (e.target.nodeName.toLowerCase()){
					case 'content':{

					}
					case 'h1':{

					}
					case 'li':{

					}
					case 'ul':{

					}
					case 'input':{
						const index = parseInt(e.target.dataset.index);
						if(isNaN(index))return false;
						var temp=[];
						for(var i=0;i<$this.checkboxArray.length;i++){
							temp[i]=$this.checkboxArray[i];
						}
						temp[index]=!temp[index];
						$this.checkboxArray='';
						$this.checkboxArray=temp;
						if(temp[index]){
							var goods={}
							goods['goods_id']=$this.addGoodsData[index]['goods_id'];
							goods['goods_name']=$this.addGoodsData[index]['goods_name'];
							var specKey="";
							if($this.spec_name.hasOwnProperty(0)){
								for(var i=0;i<$this.spec_name[index].length;i++){
									if(specKey=="")specKey=$this.spec_name[index][i];
									else specKey=specKey+"_"+$this.spec_name[index][i];
								}
							}

							if($this.goodsPrice[index][specKey]['key_name']!=null){
								goods['goods_key']=specKey;
								goods['goods_key_name']=$this.goodsPrice[index][specKey]['key_name'];
							}
							goods['goods_price']=$this.goodsPrice[index][specKey]['price'];
							
							if($this.goodsPrice[index][specKey]['store_count']==0)$this.checkboxShowArray[index]=false;
							else　$this.checkboxShowArray[index]=true;
							$this.selectGoods[index]=goods;
						}else{
							delete $this.selectGoods[index];
						}
						$this.$emit('addGoodsListen',$this.selectGoods);
						break;
					}
					case 'img':{
						const index = parseInt(e.target.dataset.id);
						if(!isNaN(index))window.open(window.location.origin + '/#/detail/'+index);
						break;
					}
				}
			},
			selectSpec:function(itemIndex,specIndex,e) {
				if (e.target.nodeName.toLowerCase() === 'p'||e.target.nodeName.toLowerCase() === 'img') {
	          	//改变搭配购买商品的规格后，清空原选择
	          	$this.checkboxArray[itemIndex]=false;
	          	delete $this.selectGoods[itemIndex];
	          	$this.$emit('addGoodsListen',$this.selectGoods);

	          	const index = parseInt(e.target.dataset.index)
	            // 获得引索后，只需要修改data数据就能改变UI了
	            var temp={};
	            for(var i=0;i<Object.keys($this.spec_name).length;i++){
	            	temp[i]=$this.spec_name[i];
	            }
	            temp[itemIndex][specIndex]=e.target.dataset.value;
	            $this.spec_name='';
	            $this.spec_name=temp;
	            $this.selectSpecPrice(itemIndex);
	        }
	    },
	    selectSpecPrice:function(num) {
	    	var specKey="";
	    	if(!$this.spec_name.hasOwnProperty(0)){
	    		return '';
	    	}
	    	for(var i=0;i<$this.spec_name[num].length;i++){
	    		if(specKey=="")specKey=$this.spec_name[num][i];
	    		else specKey=specKey+"_"+$this.spec_name[num][i];
	    	}
	    	var tempArray=[];
	    	for(var i=0;i<$this.goodsPriceItem.length;i++){
	    		tempArray.push($this.goodsPriceItem[i]);
	    	}
	    	tempArray[num]=$this.goodsPrice[num][specKey]['price'];

	    	if($this.goodsPrice[num][specKey]['store_count']==0)$this.checkboxShowArray[num]=false;
	    	else　$this.checkboxShowArray[num]=true;

	    	$this.goodsPriceItem='';
	    	$this.goodsPriceItem=tempArray;
	    	return true;
	    }
	},
	computed:{
	},
	components:{
	}
	
}
</script>
<style lang="scss">
	.selectAddGoods{
		.purchsae-select{
			height: 50px;
			display: flex;
			align-items: center;
			justify-content:space-between;
			position:relative;
			width: 100%;
			border: 0;
			padding: 0 15px;
			border-radius: 4px;
			border: 1px solid #E0E0E0; 
			cursor:pointer;
		}
		ul.purchsae-list{
			border-radius:4px;
			background:white;
			p{
				margin-bottom:0;
			}
			>li{
				padding: 0 1rem;
				display:flex;
				align-items:center;
				min-height:124px;
				border-bottom:1px solid #e0e0e0;
				position:relative;
				.goodsCheckbox{
					line-height:15px;
					width:20px;
					label{
						line-height:0;
						img{
							cursor:pointer;
						}
					}
				}
				.goodsImg{
					margin:0 10px;
					width:80px;
					height:80px;
				}
				.goodsInf{
					margin-right:5px;
					display:flex;
					flex-wrap: wrap;
					flex: 1;
					h1{
						cursor: default;
						color: #333;
						font-size: 14px;
					}
					span{
						color: #9da2a6;
						font-size: 12px;
					}
				}
				ul.specData{
					margin-bottom:3px;
					display: flex;
					flex-wrap: wrap;
					li{
						list-style: none;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 5px;
						padding: 0 5px;
						text-align: center;
						cursor: pointer;
						border: 1px solid #e0e0e0;
						margin-right: 6px;
						margin-bottom:3px;
						min-height: 20px;
						text-align: center;
						cursor: pointer;
						p{
							color: #5c6670;
							font-size: 12px;
							line-height:normal;
						}
						img{
							height:15px;
							width:15px;
						}
						&.active{
							background: #5D6670;
							border: 2px solid #5D6670;
							p{
								color: white;
							}
						}
					}
				}
				.count-style{
					position:absolute;
					right:1rem;
					bottom:0;
					display:flex;
					flex:1;
					flex-direction: column;
					cursor: default;
					span{
						color: #c8161e;
						align-self: flex-end;
					}
					p{
						align-self: flex-end;
					}
					.count{
						width: 30px;
						.btn-top{
							top:2px;
						}
						.counter-btn{
							width: 10px;
							height: 10px;
							line-height:5px;
							font-size: 10px;
						}
						input{
							padding-left:3px;
							width: 35px;
							height: 20px;
						}
					}
				}
			}
		}
		.purchsae-make{
			border: 1px solid #E0E0E0;
			margin-top: 10px;
			padding:20px 20px 15px 20px;
			border-radius: 4px 4px 0 0;
			border-bottom: 0;
			box-sizing: border-box;
			.server-top{
				height: 80px;
				width: 80px;
				display: inline-block;
				border:1px solid #e0e0e0;
			}
			.makeso{
				display: inline-block;
				margin-left: 30px;
				p{
					display: block;
					padding: 0;
					line-height: 20px;
					color: #9da2a6;
					font-size: 14px;
					padding-top:10px;
					padding-bottom:10px;
				}
				.colores{
					i{
						width: 20px;
						height: 20px;
						border-radius: 4px;
						border:1px solid #e0e0e0;
						display:inline-block;
					}
				}
			}
			.maketo{
				float: right;
				padding-top: 50px
			}
		}
		.car-list{
			height: 200px;
			border: 1px solid #E0E0E0;
			border-radius: 0 0 4px 4px;
			clear: both;
			padding: 95px;
			margin-bottom: 20px;
			h1{
				text-align: center;
			} 
		}
	}
</style>